# Gradle Java Compatibility

Read this when: deciding whether a Java version can run Gradle, is only safe as a toolchain, or explains Java runtime/class-file failures.

## Java Relation

| Java | Runs Gradle | Toolchains |
| --- | --- | --- |
| 8 | 2.0 to 8.14.x | N/A |
| 9 | 4.3 to 8.14.x | N/A |
| 10 | 4.7 to 8.14.x | N/A |
| 11 | 5.0 to 8.14.x | N/A |
| 12 | 5.4 to 8.14.x | N/A |
| 13 | 6.0 to 8.14.x | N/A |
| 14 | 6.3 to 8.14.x | N/A |
| 15 | 6.7 to 8.14.x | 6.7 |
| 16 | 7.0 to 8.14.x | 7.0 |
| 17 | 7.3+ | 7.3 |
| 18 | 7.5+ | 7.5 |
| 19 | 7.6+ | 7.6 |
| 20 | 8.3+ | 8.1 |
| 21 | 8.5+ | 8.4 |
| 22 | 8.8+ | 8.7 |
| 23 | 8.10+ | 8.10 |
| 24 | 8.14+ | 8.14 |
| 25 | 9.1.0+ | 9.1.0 |
| 26 | 9.4.0+ | 9.4.0 |
| 27 | 9.8.0+ | 9.8.0 |

## Diagnostic Rules

- Gradle `8.14.x` is the last line that can run on Java 8 through 16; Gradle 9 requires a runtime JVM of 17+ even when project code targets older Java.
- Java 20, 21, and 22 show why runtime and toolchain columns must not be collapsed: toolchain support appears before that Java can safely run Gradle.
- Wrapper, Gradle client, Tooling API client, and TestKit client JVM compatibility does not prove daemon compatibility; the daemon JVM must still satisfy the runtime column for the selected Gradle version.
- When Gradle reports that it requires a newer JVM, distinguish the current-process case from the build-configured daemon JVM case; fix `JAVA_HOME`, IDE/TestKit launcher, `org.gradle.java.home`, or daemon JVM criteria before changing project toolchains or source compatibility.
- Gradle 8.8+ uses `updateDaemonJvm` and `gradle/gradle-daemon-jvm.properties` for daemon-runtime selection, not project compilation toolchains; Java vendor criteria arrived in 8.10, generated daemon toolchain download URLs in 8.13, and native-image capability criteria in 8.14, while a build with no daemon JVM setting falls back to the launcher Java home.
- For toolchain discovery/provisioning knobs such as `org.gradle.java.installations.auto-detect`, `auto-download`, `paths`, and `fromEnv`, use `-D...` or `gradle.properties`; Gradle 9.1+ deprecates supplying them as command-line project properties with `-P...`, and conflicting `-D`/`-P` values are an error.
- `N/A` in the toolchains column for Java 8 through 14 is not a ban on compiling or testing against those Java levels; use the task's toolchain support and `options.release`/target settings instead of treating the table cell as a failure.
- `Unsupported class file major version`, `invalid source release`, and `Unsupported Java runtime` can point to different owners: Gradle runtime JVM, plugin bytecode, compile toolchain, test launcher, or dependency bytecode.
- On Gradle 8.1+, `Unsupported worker JDK version` points at a forked worker process reading worker action bytecode; check the process-isolated worker executable/toolchain and worker implementation bytecode before changing the Gradle daemon JVM.
- A manually registered `ValidatePlugins` task without the Java Toolchain plugin warns on Gradle 8.1 through 8.14.x and fails on Gradle 9.0+; apply the plugin instead of changing consumer source compatibility. On Gradle 9.2+, an explicitly selected validation launcher must also meet Gradle's minimum daemon Java, while the default convention falls back from an incompatible project toolchain to the daemon JVM.
- Test task Java failures belong to the test launcher, not compilation by default: Gradle 8.0+ rejects different toolchains selected by `test.executable` and `test.javaLauncher`, and the selected launcher must satisfy that Gradle version's worker JVM minimum before any test framework code runs.
- On Gradle 6.7+, pair toolchains with `JavaCompile.options.release` when targeting older APIs; toolchains choose a JDK but do not forbid newer APIs.
- Gradle 9.8.0+ supports Java 27 for toolchains and running Gradle, but its published platform matrix excludes macOS `AMD64` with Java 27 or newer from tested coverage; verify that host separately instead of treating version compatibility as platform coverage.
- For CI upgrades, pin and report both the Gradle runtime JVM and project toolchains.
- On Gradle 8.2+, diagnose multiple Java toolchain failures in Alpine or other musl-based runtimes separately from ordinary version compatibility; musl JVMs can affect toolchain detection and forked Java processes through `LD_LIBRARY_PATH`, so prefer a glibc-based image or a single Gradle/runtime toolchain before broad toolchain rewrites.
- If startup fails before task graph creation, inspect wrapper distribution, Gradle runtime JVM, init scripts, settings plugins, and plugin bytecode before changing project source compatibility.
