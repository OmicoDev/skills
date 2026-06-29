# Gradle Runtime And Structure

Read this when: wrapper files, Gradle runtime, daemon JVM selection, Gradle user home, VFS/file watching, init scripts, or structure routing owns the work.

## Scope Boundary

- This file owns the build's runtime environment: wrapper files, daemon/client boundaries, Daemon JVM policy, Gradle user home, VFS/file watching, and init scripts.
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
- If wrapper files are missing, generate them with a trusted installed Gradle or trusted Gradle distribution by running the `wrapper` task in the project; do not download or copy unaudited wrapper scripts or JARs into the repository.
- Upgrade with the `wrapper` task, not only by editing `distributionUrl`; run it once for properties and again when scripts/JAR should be refreshed.
- Since Gradle 9, `gradle-wrapper.properties` requires `X.Y.Z` versions even when the `wrapper` task can resolve labels or major/minor selectors.
- Use `-bin` distributions by default; choose `-all` only for offline or air-gapped source/docs needs, or when policy explicitly requires the larger distribution.
- Use `distributionSha256Sum` from the Gradle release checksums for the distribution ZIP; validate `gradle-wrapper.jar` separately because a ZIP checksum does not prove the checked-in JAR.
- `distributionSha256Sum` is checked when the wrapper downloads the distribution; verify checksum policy with a clean or controlled Gradle user home when an existing cached distribution could mask the check.
- If `gradle-wrapper.properties` contains `distributionSha256Sum`, keep wrapper task configuration or CLI checksum input in sync when regenerating wrapper properties.
- For private wrapper distributions, use HTTPS plus host-scoped credentials or tokens in user/CI properties. Do not commit shared credentials in `distributionUrl`.
- When refreshing Gradle 9.5+ wrapper or application Windows scripts, review custom `.bat` callers/templates for changed environment scoping, `CALL`/exit behavior, and removed exit-environment-variable assumptions.
- Treat `./gradlew wrapper --gradle-version <version>` as a mutating upgrade command. Review scripts, JAR, properties, URL validation, retry/timeout policy, checksums, and CI entrypoints together; a Wrapper JAR checksum matching a different Gradle version usually means properties changed without regenerating the JAR.

## Runtime Boundaries

- CLI clients, wrapper scripts, and Tooling API clients locate or start a compatible daemon, send one build request, and stream logs, events, models, and results; the daemon hosts build logic, creates task graphs, and starts worker processes for daemon-owned work.
- Gradle reuses an existing daemon only when Gradle version, Java home/version, JVM arguments, JVM attributes, and immutable JVM properties match exactly. Changing `org.gradle.jvmargs`, `org.gradle.java.home`, Daemon JVM criteria, locale, file encoding, temporary directory, or SSL store system properties can intentionally create another daemon.
- Worker processes do not own settings, project topology, dependency policy, or task graph construction.
- Debug daemon trouble by naming the failing runtime first: client launch, wrapper distribution download, Tooling API connection, daemon execution, or worker process work.
- `gradle --status` only reports daemons for the same Gradle version as the command, and `gradle --stop` only stops daemons started with that Gradle version. Use JDK tools such as `jps` when investigating daemons across Gradle versions.
- Idle timeout and low-memory daemon exits are normal lifecycle events; confirm daemon logs before treating a disappeared daemon as a crash.
- The client JVM comes from the launcher environment such as `JAVA_HOME`, `java` on `PATH`, or the IDE; Gradle distributions do not embed Java, and Daemon JVM toolchains do not remove the prerequisite needed to start the wrapper or client.
- The daemon JVM comes from checked-in Daemon JVM criteria, Tooling API requests, `org.gradle.java.home`, or the launcher fallback. `gradle/gradle-daemon-jvm.properties` takes precedence over `JAVA_HOME` and `org.gradle.java.home` for the build it belongs to.
- Treat `./gradlew updateDaemonJvm --jvm-version <version>` as a mutating runtime-policy command like `wrapper`. Pass explicit version, vendor, native-image, and platform/URL choices when committing shared policy; running without arguments can seed criteria from the current daemon JVM when no criteria file exists.
- Daemon JVM criteria can include version, recognized or exact-match vendor, native-image capability, and platform download URLs. Use `./gradlew help --task updateDaemonJvm` to inspect accepted vendor aliases before committing a vendor-specific policy.
- Generating Daemon JVM platform URLs requires configured toolchain download repositories unless `toolchainPlatforms` is cleared or explicit `toolchainDownloadUrls` are configured. Disabling `org.gradle.java.installations.auto-detect` or `auto-download` affects Daemon JVM resolution as well as project Java toolchains.
- Daemon JVM criteria select the JVM that runs Gradle; Java toolchains select JVMs used by project tasks. Do not fix compile/test toolchain failures by changing only daemon memory, and do not fix daemon startup failures by changing only `java.toolchain`.
- `JAVA_HOME` is an environment default, not a reproducible project contract.
- Gradle behavior configuration precedence is command line, system properties, Gradle properties, then environment variables; Wrapper execution follows this order, and within Gradle properties, `GRADLE_USER_HOME` can override checked-in project properties.
- When user-home evidence differs, check both `GRADLE_USER_HOME` and `-Dgradle.user.home` because the system property can relocate the user home before its `gradle.properties` is read.
- Treat `org.gradle.*` properties as Gradle runtime configuration, not build-logic feature flags; use project properties, provider-backed extension values, or typed conventions for build behavior users should control.
- `org.gradle.jvmargs` configures the daemon JVM, not the lightweight client JVM; use `GRADLE_OPTS` only for client options or to pass `-Dorg.gradle.jvmargs=...`.
- `--no-daemon` can still create a single-use daemon when the client JVM does not match the build's required daemon JVM or JVM args. To fully avoid a daemon, the client process must match those requirements.
- User-home cache and daemon-log cleanup normally runs in the background when daemons stop or shut down; with `--no-daemon`, cleanup can run in the foreground after the build and explain extra post-build work.
- Init scripts can mutate any build; check them when behavior differs by user, CI image, or machine.

## VFS And File Watching

- This file owns whether the daemon can retain Virtual File System state; read [performance-strategy.md](performance-strategy.md) for speed evidence and [commands-and-evidence.md](commands-and-evidence.md) for continuous-build flag selection.
- File system watching is daemon-owned state retained between builds; it improves repeat build file snapshots but does not replace declared task inputs and outputs.
- Toggle with `--watch-fs`/`org.gradle.vfs.watch=true` or `--no-watch-fs`/`org.gradle.vfs.watch=false`; use `org.gradle.vfs.verbose=true` to see VFS events and retained snapshot counts at build start and finish.
- Unsupported or unstable file systems are runtime evidence, not build logic evidence. Be suspicious of network mounts, unsupported file systems, symlinked inputs, and CI/project directories outside the watched hierarchy.
- There is no public custom watch-exclude API; reduce noisy watching or re-execution by narrowing the task's declared inputs, such as `fileTree.exclude(...)`.
- `Dropped VFS state due to lost state` means the daemon lost reliable watch state after unknown or excessive file events; the build can continue, but repeat-build performance evidence is no longer comparable.
- On Linux, large builds can hit inotify watch limits or memory pressure because each watched directory consumes a watch; raise limits deliberately or disable watching in constrained agents.
- Continuous build depends on active file watching and daemon execution. It does not work with `--no-daemon`, does not recompute the build model after build logic changes, and may miss newly created previously absent input directories or filtered file trees.
- `--project-cache-dir` disables default file watching and is incompatible with explicitly enabled `--watch-fs`/`org.gradle.vfs.watch=true`.

## Init Scripts And Lifecycle Hooks

- Init scripts run during initialization before settings and project scripts.
- Use them for environment policy: enterprise repositories, plugin resolution rules, global listeners, init plugins, or CI-wide defaults.
- Treat init scripts and init plugins as production code because they affect every build attached to that user home, Gradle installation, CI image, or explicit `--init-script` invocation.
- Discovery order is repeated command-line `--init-script`/`-I`, `GRADLE_USER_HOME/init.gradle(.kts)`, alphabetical `GRADLE_USER_HOME/init.d/*.init.gradle(.kts)`, then alphabetical `GRADLE_HOME/init.d/*.init.gradle(.kts)`.
- All discovered init scripts run; do not assume a later script replaces an earlier one.
- Do not hide repository-specific build behavior in init scripts when a checked-in convention plugin can own it.
- Configure Gradle user home cache cleanup and `CACHEDIR.TAG` cache marking only from `GRADLE_USER_HOME/init.d`; this intentionally couples the policy to that user home.
- Treat init scripts as separate script classpaths: implementation classes must come from Gradle APIs or `initscript {}` repositories and `classpath` dependencies; target build `buildSrc`, plugin/dependency repositories, and project dependencies do not supply init script classes.
- Init plugins target `Plugin<Gradle>`, not `Plugin<Project>` or `Plugin<Settings>`, and should interact with settings/projects through lifecycle callbacks.
- `gradle.properties` values are available to settings/projects, not as direct properties on the `Gradle` receiver of an init script.
- TestKit builds use isolated Gradle user homes, so machine/user init scripts may not explain TestKit behavior unless the test explicitly wires them.
- Choose lifecycle hooks by phase: `beforeSettings` is init-script-only pre-settings wiring and has already fired inside `settings.gradle(.kts)`; `settingsEvaluated` and `projectsLoaded` own settings/topology follow-up; `gradle.lifecycle.beforeProject` and `afterProject` own isolated project defaults/checks; `projectsEvaluated` runs before task graph finalization. Review all global callbacks for configuration-cache and isolated-project impact.

## Runtime Review

- Check whether the command uses the checked-in wrapper or a globally installed Gradle.
- Check whether CI and developers use the same wrapper version, daemon JVM criteria, and Gradle user home policy.
- Check whether private wrapper credentials are host-scoped and kept in user/CI properties.
- When Gradle warns that multiple daemons may spawn because the Gradle JDK and `JAVA_HOME` differ, compare `JAVA_HOME`, IDE Gradle JDK, Daemon JVM criteria, `org.gradle.java.home`, and Java toolchain requests before changing memory or daemon flags.
- Check whether Gradle user home, init scripts, CI-injected properties, or cache cleanup policy can explain behavior that is not reproducible from repository files alone.
- Check daemon logs under `GRADLE_USER_HOME/daemon/<gradle-version>/` when client output hides startup, crash, or connection details.
- Check whether the failure happens before settings are loaded, during daemon startup, during dependency resolution, or inside worker JVM work.
