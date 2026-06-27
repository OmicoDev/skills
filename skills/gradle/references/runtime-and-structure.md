# Gradle Runtime And Structure

Read this when: wrapper files, Gradle runtime, daemon JVM selection, Gradle user home, init scripts, or structure routing owns the work.

## Scope Boundary

- This file owns the build's runtime environment: wrapper files, daemon/client boundaries, Daemon JVM policy, Gradle user home, and init scripts.
- Read [project-topology-and-build-logic.md](project-topology-and-build-logic.md) for settings scripts, project inclusion, multi-project builds, composite builds, build logic placement, root layout, or `init` scaffolding.
- Build authoring files own script-level changes after the owner surface is clear; JVM files own toolchains used by compile/test tasks, while this file owns only the JVM that starts and runs Gradle.

## Ownership

- The wrapper selects the Gradle distribution. The launcher JVM starts the client. The daemon JVM runs build logic. Worker JVMs run daemon-owned work.
- Gradle user home owns wrapper distributions, dependency caches, daemon state, init scripts, downloaded toolchains, and local properties.
- Project `.gradle/` is local state and project `build/` directories are generated outputs.
- Gradle user home cache cleanup, cache marking, and daemon log retention are user-home policy, not project policy.
- Keep shared runtime flags in root/user `gradle.properties` rather than subproject properties.

## Wrapper And Runtime

- The wrapper is the Gradle version of record. Prefer wrapper commands over globally installed `gradle`.
- Treat wrapper scripts and `gradle-wrapper.jar` as pre-build executable trust roots; dependency verification, repository policy, and build logic safeguards do not run before them.
- Upgrade with the `wrapper` task, not only by editing `distributionUrl`; run it once for properties and again when scripts/JAR should be refreshed.
- Since Gradle 9, `gradle-wrapper.properties` requires `X.Y.Z` versions even when the `wrapper` task can resolve labels or major/minor selectors.
- Use `-bin` distributions by default; choose `-all` only for offline or air-gapped source/docs needs, or when policy explicitly requires the larger distribution.
- Use `distributionSha256Sum` for the distribution ZIP; validate `gradle-wrapper.jar` separately because a ZIP checksum does not prove the checked-in JAR.
- `distributionSha256Sum` is checked when the wrapper downloads the distribution; verify checksum policy with a clean or controlled Gradle user home when an existing cached distribution could mask the check.
- If `gradle-wrapper.properties` contains `distributionSha256Sum`, keep wrapper task configuration or CLI checksum input in sync when regenerating wrapper properties.
- For private wrapper distributions, use HTTPS plus host-scoped credentials or tokens in user/CI properties. Do not commit shared credentials in `distributionUrl`.
- Treat `./gradlew wrapper --gradle-version <version>` as a mutating upgrade command. Review scripts, JAR, properties, URL validation, retry/timeout policy, checksums, and CI entrypoints together.

## Runtime Boundaries

- The CLI client, wrapper script, and Tooling API clients locate or start a compatible daemon, send one build request, and stream logs, events, models, and results.
- The daemon runs build logic, resolves dependencies, creates task graphs, coordinates execution, and starts worker processes for daemon-owned work such as compilation, tests, and Worker API actions.
- Gradle reuses an existing daemon only when the Gradle version, Java home/version, and JVM arguments are compatible. Changing `org.gradle.jvmargs` or daemon JVM policy can intentionally create another daemon.
- Worker processes do not own settings, project topology, dependency policy, or task graph construction.
- Debug daemon trouble by naming the failing runtime first: client launch, wrapper distribution download, Tooling API connection, daemon execution, or worker process work.
- `gradle --status` only reports daemons for the same Gradle version as the command. Use JDK tools such as `jps` when investigating daemons across Gradle versions.
- The Gradle client JVM comes from the launcher environment such as `JAVA_HOME`, `java` on `PATH`, or the IDE.
- The daemon JVM comes from Daemon JVM criteria, Tooling API requests, `org.gradle.java.home`, or the launcher environment fallback.
- Gradle distributions do not embed a Java runtime; Daemon JVM toolchains do not remove the wrapper/client Java prerequisite.
- `gradle/gradle-daemon-jvm.properties` records checked-in Daemon JVM criteria and takes precedence over `JAVA_HOME` and `org.gradle.java.home`.
- Treat `./gradlew updateDaemonJvm --jvm-version <version>` as a mutating runtime-policy command like `wrapper`.
- Daemon JVM criteria can include version, vendor, native-image capability, and platform download URLs. Generating URLs requires configured toolchain download repositories unless platforms are cleared or explicit URLs are supplied.
- Daemon JVM auto-detection and auto-provisioning share Java toolchain discovery flags, but they select the JVM that runs Gradle. Java toolchains select JVMs used by project tasks.
- `JAVA_HOME` is an environment default, not a reproducible project contract.
- Gradle behavior configuration precedence is command line, system properties, Gradle properties, then environment variables; within Gradle properties, `GRADLE_USER_HOME` can override checked-in project properties.
- `org.gradle.jvmargs` configures the daemon JVM, not the lightweight client JVM; use `GRADLE_OPTS` only for client options or to pass `-Dorg.gradle.jvmargs=...`.
- `--no-daemon` can still create a single-use daemon when the client JVM does not match the build's required daemon JVM or JVM args. To fully avoid a daemon, the client process must match those requirements.
- Init scripts can mutate any build; check them when behavior differs by user, CI image, or machine.

## Init Scripts And Lifecycle Hooks

- Init scripts run during initialization before settings and project scripts.
- Use them for environment policy: enterprise repositories, plugin resolution rules, global listeners, init plugins, or CI-wide defaults.
- Discovery order is repeated command-line `--init-script`/`-I`, `GRADLE_USER_HOME/init.gradle(.kts)`, alphabetical `GRADLE_USER_HOME/init.d/*.init.gradle(.kts)`, then alphabetical `GRADLE_HOME/init.d/*.init.gradle(.kts)`.
- All discovered init scripts run; do not assume a later script replaces an earlier one.
- Do not hide repository-specific build behavior in init scripts when a checked-in convention plugin can own it.
- Configure Gradle user home cache cleanup and `CACHEDIR.TAG` cache marking only from `GRADLE_USER_HOME/init.d`; this intentionally couples the policy to that user home.
- Init scripts cannot rely on classes from the target build's `buildSrc`.
- Init script `initscript {}` dependencies build the init script classpath; they cannot use project dependencies from the target build.
- Init plugins target `Plugin<Gradle>`, not `Plugin<Project>` or `Plugin<Settings>`, and should interact with settings/projects through lifecycle callbacks.
- `gradle.properties` values are available to settings/projects, not as direct properties on the `Gradle` receiver of an init script.
- TestKit builds use isolated Gradle user homes, so machine/user init scripts may not explain TestKit behavior unless the test explicitly wires them.
- Lifecycle hooks such as `settingsEvaluated`, `projectsLoaded`, `beforeProject`, `afterProject`, and `projectsEvaluated` are global mutation points. Review them for configuration-cache and isolated-project impact.

## Runtime Review

- Check whether the command uses the checked-in wrapper or a globally installed Gradle.
- Check whether CI and developers use the same wrapper version, daemon JVM criteria, and Gradle user home policy.
- Check whether private wrapper credentials are host-scoped and kept in user/CI properties.
- Check whether Gradle user home, init scripts, CI-injected properties, or cache cleanup policy can explain behavior that is not reproducible from repository files alone.
- Check daemon logs under `GRADLE_USER_HOME/daemon/<gradle-version>/` when client output hides startup, crash, or connection details.
- Check whether the failure happens before settings are loaded, during daemon startup, during dependency resolution, or inside worker JVM work.

## Source Calibration

Primary upstream pages: Gradle Wrapper, Gradle Daemon, Directory Layout, Build Environment, Build Lifecycle, Initialization Scripts and Init Plugins, Best Practices for Security. Local architecture docs: Gradle Runtimes, Build Execution Model, Build State Model, ADR-0007 Java prerequisite.
