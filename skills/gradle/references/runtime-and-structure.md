# Gradle Runtime And Structure

Read this when: wrapper files, Gradle runtime, init scripts, settings scripts, project inclusion, multi-project builds, composite builds, build logic placement, repository policy, or directory layout owns the work.

## Scope Boundary

- This file owns the build's runtime, topology, checked-in structure, and where build logic should live.
- Build authoring files own script-level changes after the owner surface is clear; JVM files own toolchains used by compile/test tasks, while this file owns only the JVM that runs Gradle.

## Ownership

- `settings.gradle(.kts)` owns root name, included projects, included builds, plugin repositories, dependency repository policy, and catalogs.
- Project build scripts own plugins, dependencies, source sets, tasks, publications, and extension configuration for that project.
- Root project scripts should stay lightweight unless the root intentionally produces an artifact; reusable conventions belong in precompiled or binary convention plugins, usually in included build logic.
- Generated files, `.gradle/`, and `build/` are not source structure unless modeled as task inputs or outputs.
- Name the root project in settings, and keep shared build flags in root/user `gradle.properties` rather than subproject properties.

## Wrapper And Runtime

- The wrapper is the Gradle version of record. Prefer wrapper commands over globally installed `gradle`.
- Upgrade with the `wrapper` task, not only by editing `distributionUrl`.
- Since Gradle 9, wrapper versions in `gradle-wrapper.properties` require `X.Y.Z` format.
- Run `wrapper` once for wrapper properties, again when scripts/JAR should be refreshed; commit scripts, JAR, and properties together.
- Use `distributionSha256Sum` and wrapper JAR validation when policy requires wrapper supply-chain checks.
- For private wrapper distributions, use host-scoped wrapper credentials or tokens in user/CI properties. Do not commit shared credentials in `distributionUrl`.
- `./gradlew wrapper --gradle-version <version>` is a mutating upgrade command, not a diagnostic command. Review wrapper properties, scripts, JAR, checksum policy, and CI entrypoints together.

## Runtime Boundaries

- The CLI client, wrapper script, and Tooling API clients locate or start a compatible daemon, send one build request, and stream logs, events, models, and results.
- The daemon runs build logic, resolves dependencies, creates task graphs, coordinates execution, and starts worker processes for daemon-owned work such as compilation, tests, and Worker API actions.
- Worker processes do not own settings, project topology, dependency policy, or task graph construction.
- Debug daemon trouble by naming the failing runtime first: client launch, wrapper distribution download, Tooling API connection, daemon execution, or worker process work.
- The Gradle client JVM comes from the launcher environment such as `JAVA_HOME`, `java` on `PATH`, or the IDE.
- The daemon JVM comes from Daemon JVM criteria, Tooling API requests, `org.gradle.java.home`, or the launcher environment fallback.
- Gradle distributions do not embed a Java runtime; Daemon JVM toolchains do not remove the wrapper/client Java prerequisite.
- `gradle/gradle-daemon-jvm.properties` records checked-in Daemon JVM criteria and takes precedence over `JAVA_HOME` and `org.gradle.java.home`.
- Treat `./gradlew updateDaemonJvm --jvm-version <version>` as a mutating runtime-policy command like `wrapper`.
- Daemon JVM criteria can include version, vendor, native-image capability, and platform download URLs. Generating URLs requires configured toolchain download repositories unless platforms are cleared or explicit URLs are supplied.
- Daemon JVM auto-detection and auto-provisioning share Java toolchain discovery flags, but they select the JVM that runs Gradle. Java toolchains select JVMs used by project tasks.
- Gradle user home owns wrapper distributions, dependency caches, daemon state, init scripts, downloaded toolchains, and local properties.
- `JAVA_HOME` is an environment default, not a reproducible project contract. Project `.gradle/` is local state and project `build/` directories are generated outputs.
- Init scripts can mutate any build; check them when behavior differs by user, CI image, or machine.

## Init Scripts And Lifecycle Hooks

- Init scripts run during initialization before settings and project scripts.
- Use them for environment policy: enterprise repositories, plugin resolution rules, global listeners, init plugins, or CI-wide defaults.
- Discovery can come from command-line `--init-script`, Gradle user home `init.d`, or Gradle installation `init.d`; do not hide repository-specific build behavior there when a checked-in convention plugin can own it.
- Init scripts cannot rely on classes from the target build's `buildSrc`.
- Lifecycle hooks such as `settingsEvaluated`, `projectsLoaded`, `beforeProject`, `afterProject`, and `projectsEvaluated` are global mutation points. Review them for configuration-cache and isolated-project impact.

## Project Topology

- Use `include(...)` for subprojects in one build; use `includeBuild(...)` for separate builds composed together.
- Check `./gradlew -q projects` before renaming projects or changing paths.
- Prefer project dependencies for subprojects and composite builds for local module replacement across build boundaries.
- Included builds can supply plugins through `pluginManagement { includeBuild(...) }`.
- Included builds are not subprojects. Do not use `project(":included-build:module")`; depend on their external coordinates and let composite substitution replace them.
- Included builds do not share repositories, plugin management, version catalogs, `buildSrc`, or user-defined root `gradle.properties`; runtime Gradle properties from the root build apply to the invocation.
- Default composite substitution uses project `group` and `name`; declare substitutions explicitly when published coordinates, artifacts, variants, or default configurations differ.
- Composite substitution can affect task graph construction and may require configuring included builds; use it for real local replacement, not ordinary subproject wiring.
- Do not rely on task paths in CI until project renames are reflected in CI commands.

## Build Logic Placement

- Keep one-off project behavior in the project build script.
- Move repeated convention blocks to precompiled script plugins or binary plugins.
- Prefer an included `build-logic` build over `buildSrc` for larger or more isolated shared logic; use `buildSrc` only when automatic inclusion is acceptable.
- Avoid `allprojects` and `subprojects` mutation for cross-project conventions; use plugins applied by each participating project.
- For aggregation, consume variants or reports rather than reading mutable subproject state.
- Avoid init scripts for project behavior; they are user or environment policy.

## Layout And File Rules

- Keep source files out of the root project unless the root intentionally builds software.
- Prefer standard plugin conventions such as `src/main/java` and `src/test/java`.
- Separate language source directories when multiple JVM languages are compiled.
- Separate unit, integration, functional, and smoke test sources when they have different dependencies or execution policy.
- Avoid empty included projects caused by mismatched `include(...)` paths.
- Use `layout.projectDirectory`, `layout.buildDirectory`, and task/file providers instead of hard-coded paths.
- Keep generated sources under `build/` and wire them through source sets or task outputs. For copied or archived outputs, prefer Gradle task types and `CopySpec` over manual filesystem loops.

## Build Init

- Use `./gradlew init` or `gradle init` only for new scaffolds or deliberate conversion work; treat it as a mutating scaffold/conversion command, not an inspection command.
- Review generated settings, wrapper, build scripts, source layout, catalogs, lifecycle mapping, profiles, resources, dependencies, and publishing before keeping conversion output.

## Structural Review

- Check whether CI calls root tasks, project tasks, or included-build tasks.
- Check whether IDE import expects stable project names.
- Check whether convention plugins are applied explicitly by each project.
- Check whether repository/catalog policy lives in settings and generated source directories are owned by tasks.
- Check whether Gradle user home, init scripts, or CI-injected properties can explain behavior that is not reproducible from the repository alone.

## Source Calibration

Primary upstream pages: Gradle Wrapper, Gradle Daemon, Directory Layout, Build Lifecycle, Initialization Scripts and Init Plugins, Structuring and Organizing Gradle Projects, Multi-Project Builds, Composite Builds, Sharing Build Logic, Build Init Plugin. Local architecture docs: Gradle Runtimes, Build Execution Model, Build State Model, ADR-0007 Java prerequisite.
