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

## Upgrade Evidence Gate

- Prefer the latest minor or patch in the current major before jumping majors; if a direct latest-minor upgrade fails, bisect by minor versions to isolate Gradle or plugin incompatibility.
- Treat Gradle release support as a moving line: older minors in the latest major become EOL after a newer minor, the previous major receives only critical/security fixes after a new major, and two-majors-back lines should not be upgrade targets.
- For cross-major upgrades, clear the previous major's within-line upgrade guide and deprecations before reading the target-major guide; removals often correspond to warnings from the older line.
- Capture deprecation evidence before changing the wrapper. Prefer Build Scan deprecation views when upload policy permits; otherwise capture `--warning-mode=all` output.
- Use `--warning-mode=fail` as a post-cleanup regression gate, not the first discovery command; keep `--warning-mode=all` or Build Scan evidence for owner attribution.
- If `--warning-mode=all` still leaves ownership unclear, rerun the same representative task with `--stacktrace` or `-Dorg.gradle.deprecation.trace=true` before editing; Gradle may otherwise print only the first Gradle script frame and suppress repeated warning messages by message or location.
- Audit `enableFeaturePreview(...)` entries and incubating API usage during wrapper upgrades; preview flags live in settings, become obsolete when a feature is promoted or removed, and should not be treated as durable compatibility policy.
- Classify broken usage by feature lifecycle: public API removals should have prior deprecations, incubating APIs may change with release notes, and internal APIs have no compatibility promise.
- Update third-party plugins before a major wrapper jump when compatibility says they support both the current and target Gradle versions. If a plugin requires the target Gradle first, isolate that plugin change as its own phase.
- Keep plugins on latest compatible versions, but phase risky plugin updates from wrapper upgrades unless compatibility requires coupling; use shadow or parallel CI lanes when the compatibility signal is incomplete.
- Isolate expected one-time generated-file churn from behavioral upgrade work, such as wrapper script rewrites, lockfile line-ending normalization, or dependency-verification keyring encoding updates, so review does not mistake upgrade housekeeping for dependency or build logic changes.
- When `gradle-wrapper.properties` contains `distributionSha256Sum`, pair every wrapper version or distribution URL change with the matching new checksum; a stale or missing checksum is a wrapper-security failure to fix before dependency or task debugging.
- Treat wrapper `networkTimeout`, `retries`, `retryBackOffMs`, and URL validation as wrapper runtime policy; review them with `gradle-wrapper.properties` instead of scattering retry workarounds through CI scripts.
- After wrapper upgrade, repeat deprecation capture and representative tasks before treating the target version as promoted.

## Compatibility Surface

- Gradle runtime JVM.
- Java toolchains and target bytecode.
- Embedded Kotlin and Groovy versions used by Gradle.
- Embedded Kotlin/Groovy upgrades affect Kotlin DSL scripts, Groovy scripts, build logic, and published plugins; decide whether the plugin's minimum consumer Gradle version moves or whether it must target an older Kotlin/Groovy level explicitly.
- Android Gradle Plugin and Kotlin Gradle Plugin compatibility.
- Third-party plugin compatibility and plugin bytecode target.
- `buildSrc`, included build logic, and TestKit coverage.
- Dependency verification, lockfiles, publishing, and CI JDK.

## Failure Ownership

- Startup failure: wrapper distribution, Gradle runtime JVM, init scripts, or settings plugins.
- Script compilation failure: DSL syntax, accessors, plugin classpath, or embedded Kotlin/Groovy compatibility.
- Script behavior changes after a major upgrade: inspect embedded Kotlin/Groovy language changes before rewriting Gradle model logic.
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
