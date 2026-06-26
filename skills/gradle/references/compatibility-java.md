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
- `Unsupported class file major version`, `invalid source release`, and `Unsupported Java runtime` can point to different owners: Gradle runtime JVM, plugin bytecode, compile toolchain, test launcher, or dependency bytecode.
- For older target APIs, pair toolchains with `JavaCompile.options.release`; toolchains choose a JDK but do not forbid newer APIs.
- For CI upgrades, pin and report both the Gradle runtime JVM and project toolchains.
- If startup fails before task graph creation, inspect wrapper distribution, Gradle runtime JVM, init scripts, settings plugins, and plugin bytecode before changing project source compatibility.
