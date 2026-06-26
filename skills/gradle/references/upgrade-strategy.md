# Gradle Upgrade Strategy

Read this when: changing Gradle versions, handling deprecations, checking compatibility, migrating DSLs, or migrating from Maven/Ant/legacy Gradle patterns.

## First Choice

- Read [compatibility-matrix.md](compatibility-matrix.md) before changing Gradle, JVM, Kotlin, Groovy, AGP, Tooling API/TestKit, or CI platform versions.
- Read [migration-execution.md](migration-execution.md) for wrapper upgrade flow, compatibility checks, deprecation cleanup, Maven/Ant migration, Groovy-to-Kotlin DSL migration, and legacy modernization.
- Read [runtime-and-structure.md](runtime-and-structure.md) for wrapper upgrade mechanics and runtime boundaries.
- Read [jvm-and-tests.md](jvm-and-tests.md) for runtime JVM, toolchain, class file, and test failures.
- Read [plugins-services-and-diagnostics.md](plugins-services-and-diagnostics.md) for plugin compatibility, TestKit, custom task validation, or plugin bytecode issues.

## Baseline Commands

```bash
./gradlew --version
./gradlew help --warning-mode=all
./gradlew buildEnvironment
```

Then run representative tasks. `help` alone proves startup, not build correctness.

## Compatibility Surface

- Gradle runtime JVM.
- Java toolchains and target bytecode.
- Embedded Kotlin and Groovy versions used by Gradle.
- Android Gradle Plugin and Kotlin Gradle Plugin compatibility.
- Third-party plugin compatibility and plugin bytecode target.
- `buildSrc`, included build logic, and TestKit coverage.
- Dependency verification, lockfiles, publishing, and CI JDK.

## Failure Ownership

- Startup failure: wrapper distribution, Gradle runtime JVM, init scripts, or settings plugins.
- Script compilation failure: DSL syntax, accessors, plugin classpath, or embedded Kotlin/Groovy compatibility.
- Task validation failure: custom task annotations, properties, or Gradle API changes.
- Dependency failure: repository policy, metadata, locks, verification, or removed configurations.
- Test failure after upgrade: test JVM, framework engine, classpath, or bytecode target.
- Publishing failure: publication metadata, signing, repository credentials, or removed deferred configuration behavior.

## Phase Boundaries

Split separate phases when possible:

- wrapper/runtime upgrade
- third-party plugin upgrades
- deprecation cleanup
- DSL migration
- dependency modernization
- build logic extraction
- Maven/Ant migration
- CI/publishing changes

Only combine phases when their dependency is real and visible.

## Source Calibration

Primary upstream pages: Compatibility Matrix, Feature Lifecycle, Upgrading Gradle, Migrating from Maven, Migrating from Ant.
