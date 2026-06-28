# Gradle Performance Strategy

Read this when: build speed, task avoidance, configuration cache, build cache, incremental work, file watching, daemon behavior, or isolated projects owns the work.

## First Choice

- Read [configuration-cache.md](configuration-cache.md) for configuration-cache enablement, reports, incompatible task/plugin repairs, and configuration inputs.
- Read [isolated-projects.md](isolated-projects.md) for Isolated Projects adoption, cross-project mutable access, diagnostics mode, IDE sync model caching, and isolation violations.
- Read [build-cache-and-incremental.md](build-cache-and-incremental.md) for task output caching, up-to-date checks, incremental tasks, remote cache policy, and cache misses.
- Read [task-types-and-validation.md](task-types-and-validation.md) when a task's inputs, outputs, validation, or cacheability is the suspected owner.
- Read [dependency-repositories.md](dependency-repositories.md) when slow resolution, dynamic/changing versions, repository order, or network access dominates.

## Evidence First

```bash
./gradlew help --profile
./gradlew <task> --profile
./gradlew <task> --scan
./gradlew <task> --info
./gradlew <task> --configuration-cache
./gradlew <task> --parallel
```

Compare repeated runs and avoid broad optimization changes before identifying the dominant cost.

## Diagnosis Matrix

- Treat Build Scan and `--profile` categories as owner evidence before changing build logic: startup points to wrapper/daemon/init scripts, settings and `buildSrc` points to settings or build-logic bootstrap, loading projects points to project count, configuration points to plugin/task graph work, dependency resolution points to repository/metadata/version policy, and execution points to tasks.
- Separate first-run startup from persistent startup cost: wrapper distribution download and daemon startup can disappear on repeat runs, while warm-daemon startup cost usually points to init scripts or client/daemon launch policy.
- If `settings` and `buildSrc` remain dominant after `buildSrc` is already up-to-date, inspect settings work and build-logic bootstrap before tuning task execution.
- Slow before tasks start: inspect configuration time, task realization, plugin application, dependency resolution during configuration, and project coupling.
- Slow dependency resolution: inspect repository count/order, dynamic versions, changing modules, [dependency-metadata-rules.md](dependency-metadata-rules.md), and network/cache behavior.
- Slow tests: inspect forks, parallelism, reports, logging, framework startup, and cacheability.
- Slow compilation: inspect toolchains, compiler daemon reuse, annotation processors, ABI changes, and source layout.
- Poor cache reuse: inspect declared inputs, output determinism, path normalization, environment reads, and remote cache trust policy.
- Poor parallel speedup: inspect the Build Scan timeline for critical-path tasks, late long-running tasks, and unnecessary task dependencies before raising worker counts or adding parallel flags.

## Distinctions

- Configuration cache stores the configured task graph for a requested task set.
- Configuration cache reduces repeated configuration cost, but cache misses, first runs, changed build logic, or different task requests still pay for expensive configuration work.
- Build cache stores task and artifact-transform outputs keyed by declared normalized inputs.
- Up-to-date checks reuse local task outputs.
- Incremental tasks process changed inputs during execution.
- A task can be incremental without being safely cacheable.
- Isolated Projects builds on configuration-cache discipline and cross-project ownership boundaries; route details to [isolated-projects.md](isolated-projects.md).
- Treat parallelism as separate owner surfaces: `--parallel` targets task execution across projects, Configuration Cache can enable task execution parallelism within a project, Isolated Projects targets configuration/model parallelism, `org.gradle.tooling.parallel` targets Tooling API model builders, and `org.gradle.workers.max` caps parallel work across phases.
- Use Gradle Profiler scenarios or method profilers when category evidence points to plugin/custom task algorithms or constrained resources rather than Gradle model structure.

## Common Performance Owners

- Too much configuration work: eager task creation, broad plugin application, cross-project mutation, configuration-time dependency resolution.
- Slow execution: expensive tasks, insufficient task inputs/outputs, external tools, test forks, compiler daemons, annotation processors.
- Poor reuse: undeclared inputs, non-relocatable paths, non-deterministic outputs, environment leakage, remote cache policy.
- Runtime factors: Gradle/JDK/plugin versions, daemon reuse, heap settings, parallelism, file-system watching, Gradle user home state, and CI cache strategy.
- Isolated Projects factors: cross-project model reads, root script mutation, and logic that assumes every project is configured together.
- Tooling API/IDE parallelism can be controlled separately from task parallelism in modern Gradle; separate IDE sync instability from task execution instability.

## File System Watching

- Treat file-system watching as daemon-local VFS reuse, not as task input declaration. If Gradle misses a change, first suspect undeclared inputs/outputs or unsupported file-system behavior.
- Diagnose with `--watch-fs`/`--no-watch-fs` and `-Dorg.gradle.vfs.verbose=true`; keep verbose VFS logging out of default CI unless it is actively proving a watcher issue.
- On Linux, large builds can hit inotify watch limits; raising limits costs memory, so memory-constrained CI may be better served by disabling watching.
- Symlink-heavy or unsupported file systems can reduce watcher value and cross-platform cache reuse. Route persistent cache misses to [build-cache-and-incremental.md](build-cache-and-incremental.md).

## Rollout Order

1. Remove obvious eager configuration and configuration-time resolution.
2. Fix task validation warnings and undeclared inputs/outputs.
3. Enable local cache or configuration cache on representative commands.
4. Add CI coverage for selected workflows.
5. Roll out remote cache, default configuration cache, or Isolated Projects only after representative workflows are stable.

## Avoid

- Enabling every optimization globally from one `help` run.
- Using `clean` as part of normal performance measurement.
- Treating configuration cache as permission to leave network, filesystem scans, CPU-heavy work, or eager plugin logic in the configuration phase.
- Treating configuration on demand as a modern substitute for configuration cache or isolated projects.
- Enabling Isolated Projects before checking current limitations, local-only cache behavior, and representative IDE/CI workflows in [isolated-projects.md](isolated-projects.md).
- Uploading Build Scan data where policy forbids it.

## Source Calibration

Primary upstream pages: Performance, Inspecting Builds, Best Practices for Performance, Configuration Cache, Build Cache, File System Watching, Gradle Daemon, Isolated Projects.
