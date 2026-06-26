# Gradle Commands And Evidence

Read this when: choosing Gradle commands, flags, log levels, reports, or evidence routes from a failing run.

## Evidence To Preserve

- Exact command, working directory, task path, wrapper version, JVM, OS, and failure excerpt.
- Relevant files: `settings.gradle(.kts)`, target `build.gradle(.kts)`, `gradle.properties`, wrapper properties, catalogs, lockfiles, verification metadata, and CI command.
- Whether the failure happens locally, in CI, in IDE import/sync, or through the Tooling API.

## Command Playbook

Use the wrapper and the smallest useful command:

```bash
./gradlew --version
./gradlew -q projects
./gradlew tasks --all
./gradlew help --task <task>
./gradlew <task> --dry-run
./gradlew dependencies --configuration <configuration>
./gradlew dependencyInsight --dependency <module> --configuration <configuration>
./gradlew outgoingVariants
./gradlew resolvableConfigurations
./gradlew buildEnvironment
./gradlew help --warning-mode=all
./gradlew <task> --scan
./gradlew <task> --profile
```

Use `--scan` only when project policy permits uploading build data.

## Flag Selection

- Add `--stacktrace` for exception ownership.
- Add `--info` or `--debug` only when ordinary output lacks owner evidence.
- Add `--configuration-cache` to reproduce configuration-cache behavior.
- Add `--rerun-tasks` to separate task reuse from task action behavior.
- Add `--refresh-dependencies` only to test cache/repository hypotheses; do not leave it as a fix.
- Add `--offline` only to prove whether the cache already contains required modules.
- Use `--warning-mode=all` before Gradle upgrades or deprecation cleanup.

## Evidence Patterns

- For dependency selection, keep the configuration name. `runtimeClasspath` and `compileClasspath` can explain different selected versions.
- In dependency reports, `(*)` marks a repeated transitive subtree, `(c)` marks a dependency constraint, and `(n)` marks a non-resolvable dependency or configuration.
- For variant failures, capture the requested attributes and every candidate variant Gradle prints before changing attributes.
- For plugin resolution, capture plugin ID, version, plugin repositories, and whether the ID is applied in settings, build scripts, or convention plugins.
- For configuration-cache failures, keep the report path and the first local build logic class or script named by the report.
- For Problems API output, keep the console problem text and `build/reports/problems/problems-report.html` path when generated.
- For performance work, record at least two comparable runs before and after a change. Avoid comparing a warm daemon run with a cold daemon run.
- For CI-only failures, record Gradle user home cache settings, CI JDK, wrapper version, working directory, and any init scripts injected by CI.

## Symptom Routing

- Task not found or unexpected task path: read [runtime-and-structure.md](runtime-and-structure.md) and [plugins-services-and-diagnostics.md](plugins-services-and-diagnostics.md).
- Plugin not found: inspect `pluginManagement` repositories and plugin versions in settings.
- Dependency not found or wrong version: read [dependency-policy.md](dependency-policy.md).
- `No matching variant`, capability conflict, or attributes mismatch: read [dependency-variants-and-metadata.md](dependency-variants-and-metadata.md).
- Configuration cache report names build logic: read [configuration-cache.md](configuration-cache.md).
- Slow configuration or many realized tasks: read [performance-strategy.md](performance-strategy.md).
- Wrapper or JVM mismatch: read [runtime-and-structure.md](runtime-and-structure.md) and [jvm-and-tests.md](jvm-and-tests.md).
- New project scaffold or Maven conversion: read [runtime-and-structure.md](runtime-and-structure.md) before accepting generated files.

## Command Safety

- Prefer `help`, reports, and single task paths for diagnosis.
- Avoid `clean build` as a first command; it hides reuse behavior and costs time.
- Use `--dry-run` to inspect task graph shape, not task action correctness.
- Use `--continue` only to collect multiple independent failures.
- Treat `--exclude-task` as a local diagnostic or workflow choice, not a model fix for bad dependencies.
- Use configuration abbreviations only in local diagnosis; keep committed scripts and docs explicit.
- Treat `init` and `wrapper --gradle-version` as mutating owner commands; read runtime or upgrade guidance before running them.

## Avoid

- Treating `clean`, `--refresh-dependencies`, `--rerun-tasks`, disabled verification, or warning suppression as permanent repairs.
- Running `./gradlew build` before a narrower task can identify the owner.
- Changing repositories, plugin versions, or global properties before inspecting settings and wrapper evidence.

## Source Calibration

Primary upstream pages: Command-Line Interface, Build Environment Configuration, Inspecting Gradle Builds, Gradle Wrapper.
