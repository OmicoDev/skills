# Gradle Performance Strategy

Read this when: build speed, task avoidance, configuration cache, build cache, incremental work, file watching, daemon behavior, or isolated projects owns the work.

## First Choice

- Read [configuration-cache.md](configuration-cache.md) for configuration-cache enablement, reports, incompatible task/plugin repairs, and configuration inputs.
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

- Slow before tasks start: inspect configuration time, task realization, plugin application, dependency resolution during configuration, and project coupling.
- Slow dependency resolution: inspect repository count/order, dynamic versions, changing modules, metadata rules, and network/cache behavior.
- Slow tests: inspect forks, parallelism, reports, logging, framework startup, and cacheability.
- Slow compilation: inspect toolchains, compiler daemon reuse, annotation processors, ABI changes, and source layout.
- Poor cache reuse: inspect declared inputs, output determinism, path normalization, environment reads, and remote cache trust policy.

## Distinctions

- Configuration cache stores the configured task graph for a requested task set.
- Build cache stores task and artifact-transform outputs keyed by declared normalized inputs.
- Up-to-date checks reuse local task outputs.
- Incremental tasks process changed inputs during execution.
- A task can be incremental without being safely cacheable.
- Isolated Projects builds on configuration-cache discipline and cross-project ownership boundaries.

## Common Performance Owners

- Too much configuration work: eager task creation, broad plugin application, cross-project mutation, configuration-time dependency resolution.
- Slow execution: expensive tasks, insufficient task inputs/outputs, external tools, test forks, compiler daemons, annotation processors.
- Poor reuse: undeclared inputs, non-relocatable paths, non-deterministic outputs, environment leakage, remote cache policy.
- Runtime factors: Gradle/JDK/plugin versions, daemon reuse, heap settings, parallelism, file-system watching, and CI cache strategy.
- Isolated Projects factors: cross-project model reads, root script mutation, and logic that assumes every project is configured together.
- Tooling API/IDE parallelism can be controlled separately from task parallelism in modern Gradle; separate IDE sync instability from task execution instability.

## Isolated Projects

- Treat Isolated Projects as a configuration-phase and model-building feature, not an execution-phase speedup.
- It can run project configuration in parallel and can cache tooling models for IDE sync locally, but it currently still configures all projects.
- Use it after configuration-cache discipline is mostly in place; both features share infrastructure, but isolation violations are owner-boundary problems.
- Diagnose first with `help` plus diagnostics mode:

```bash
./gradlew help -Dorg.gradle.unsafe.isolated-projects=true -Dorg.gradle.unsafe.isolated-projects.diagnostics=true
```

- Diagnostics mode intentionally disables some parallelism and per-project model reuse. Use it for migration evidence, not persistent performance settings.
- Warnings mode can estimate speedups while violations remain, but it does not make the build reliable and should not become release policy.
- Repair cross-project mutable access with convention plugins, project dependencies, variants, shared services with stable registration parameters, or state-isolating lifecycle callbacks.
- Keep IDE sync and CLI task execution as separate workflows; they can expose different lazy build logic and different isolation violations.

## Rollout Order

1. Remove obvious eager configuration and configuration-time resolution.
2. Fix task validation warnings and undeclared inputs/outputs.
3. Enable local cache or configuration cache on representative commands.
4. Add CI coverage for selected workflows.
5. Roll out remote cache, default configuration cache, or Isolated Projects only after representative workflows are stable.

## Avoid

- Enabling every optimization globally from one `help` run.
- Using `clean` as part of normal performance measurement.
- Treating configuration on demand as a modern substitute for configuration cache or isolated projects.
- Enabling Isolated Projects before checking current limitations, local-only cache behavior, and representative IDE/CI workflows.
- Uploading Build Scan data where policy forbids it.

## Source Calibration

Primary upstream pages: Performance, Configuration Cache, Build Cache, File System Watching, Gradle Daemon, Isolated Projects.
