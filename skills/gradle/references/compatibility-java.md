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

## Diagnostic Rules

- Gradle `8.14.x` is the last line that can run on Java 8 through 16; Gradle 9 requires a runtime JVM of 17+ even when project code targets older Java.
- Java 20, 21, and 22 show why runtime and toolchain columns must not be collapsed: toolchain support appears before that Java can safely run Gradle.
- Wrapper, Gradle client, Tooling API client, and TestKit client JVM compatibility does not prove daemon compatibility; the daemon JVM must still satisfy the runtime column for the selected Gradle version.
- When Gradle reports that it requires a newer JVM, distinguish the current-process case from the build-configured daemon JVM case; fix `JAVA_HOME`, IDE/TestKit launcher, `org.gradle.java.home`, or daemon JVM criteria before changing project toolchains or source compatibility.
- Treat `updateDaemonJvm` and `gradle/gradle-daemon-jvm.properties` as daemon-runtime selection, not project compilation toolchain configuration; they can impose Java version, vendor, native-image capability, and daemon toolchain download URLs, while a build with no daemon JVM setting falls back to the launcher Java home.
- For toolchain discovery/provisioning knobs such as `org.gradle.java.installations.auto-detect`, `auto-download`, `paths`, and `fromEnv`, use `-D...` or `gradle.properties`; Gradle 9.1+ deprecates supplying them as command-line project properties with `-P...`, and conflicting `-D`/`-P` values are an error.
- `N/A` in the toolchains column for Java 8 through 14 is not a ban on compiling or testing against those Java levels; use the task's toolchain support and `options.release`/target settings instead of treating the table cell as a failure.
- `Unsupported class file major version`, `invalid source release`, and `Unsupported Java runtime` can point to different owners: Gradle runtime JVM, plugin bytecode, compile toolchain, test launcher, or dependency bytecode.
- `Unsupported worker JDK version` points at a forked worker process reading worker action bytecode; check process-isolated worker executable/toolchain and worker implementation bytecode before changing the Gradle daemon JVM.
- `validatePlugins` toolchain failures belong to the worker JVM used for plugin validation; apply/configure the Java toolchain plugin and ensure the launcher can run at least Gradle's minimum daemon Java before changing consumer source compatibility.
- Test task Java failures belong to the test launcher, not compilation by default: if both `test.executable` and `test.javaLauncher` are configured they must identify the same toolchain, and the selected launcher must satisfy Gradle's worker JVM minimum before any test framework code runs.
- For older target APIs, pair toolchains with `JavaCompile.options.release`; toolchains choose a JDK but do not forbid newer APIs.
- For CI upgrades, pin and report both the Gradle runtime JVM and project toolchains.
- In Alpine or other musl-based runtimes, diagnose multiple Java toolchain failures separately from ordinary version compatibility; musl JVMs can affect toolchain detection and forked Java processes through `LD_LIBRARY_PATH`, so prefer a glibc-based image or a single Gradle/runtime toolchain before broad toolchain rewrites.
- If startup fails before task graph creation, inspect wrapper distribution, Gradle runtime JVM, init scripts, settings plugins, and plugin bytecode before changing project source compatibility.
