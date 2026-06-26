# Gradle JVM And Tests

Read this when: Java/Kotlin/Groovy/Scala build authoring, Java toolchains, JVM test tasks, test suites, fixtures, source sets, or report aggregation owns the task.

## JVM Plugin Boundaries

- `java` owns source sets, compile/test/jar lifecycle, and standard JVM configurations.
- `java-library` adds API/implementation separation and API variants.
- `java-platform` publishes dependency constraints, not ordinary compiled classes.
- Kotlin, Groovy, Scala, Android, and external JVM plugins add their own task and source-set layers; identify which plugin owns the model before patching.

## Toolchains

- Read [compatibility-java.md](compatibility-java.md) when deciding whether a Java version can run Gradle or is only safe as a toolchain target for the selected Gradle version.
- The Gradle runtime JVM runs Gradle and plugins.
- Java toolchains select JVMs for compile, test, javadoc, and custom Java tool tasks.
- Prefer toolchains over `JAVA_HOME` or `sourceCompatibility`/`targetCompatibility` alone.
- Toolchains choose the JDK; they do not prevent accidental use of newer Java APIs. Use `--release` for Java API targeting when compiling Java sources for older platforms.
- Diagnose with `./gradlew -q javaToolchains` when available in the build.
- Configure toolchain resolver plugins and toolchain repositories in settings when auto-provisioning is allowed. Repository order decides which matching JDK is downloaded first.

## Compatibility Triage

- If Gradle will not start, inspect the Gradle runtime JVM first.
- If a plugin fails to load, inspect plugin version and bytecode target.
- If compilation emits unsupported release or classfile errors, inspect toolchain language version, `--release`, and source/target compatibility.
- If tests fail with classfile errors, inspect the test runtime launcher and test dependencies, not only the compiler.
- If Android is involved, check Gradle, AGP, Kotlin, JDK, and Android Studio as one compatibility stack.

## Source Sets And Generated Sources

- Keep generated sources under `build/`.
- Wire generated directories with providers from the producing task.
- Do not commit generated outputs unless project policy requires it.
- Keep resources and dependencies scoped to the owning source set.

## Testing

- `Test` tasks execute tests; JVM Test Suite models suites and targets.
- Use `useJUnitPlatform()`, TestNG, or other framework configuration explicitly when required.
- Use test filtering for narrow execution, but do not commit local filters accidentally.
- Configure `maxParallelForks`, fork options, logging, and reports on `Test` tasks or suite targets.
- Use test fixtures when production code must publish reusable test support.
- Use report aggregation plugins for cross-project test or JaCoCo reports.

## Test Suite Decisions

- Use an extra `Test` task for a narrow local workflow.
- Use JVM Test Suite when the suite has its own sources, dependencies, targets, or reusable convention.
- Use separate source sets for integration, functional, smoke, or contract tests.
- Wire custom suites into `check` only when they should run in ordinary verification.
- Keep flaky, expensive, or environment-dependent suites behind explicit tasks or CI stages.

## Failure Triage

- Missing test dependencies: inspect test runtime classpath and framework engine dependencies.
- No tests found: inspect includes/filters, engine setup, compiled test classes, and suite/task selection.
- Unsupported class file version: separate Gradle runtime JVM, plugin bytecode, compile target, and test runtime.
- Slow tests: inspect forks, parallelism, reports, test isolation, and cacheability policy.

## Source Calibration

Primary upstream pages: Java Plugin, Java Library Plugin, Toolchains for JVM projects, Testing in Java and JVM projects, JVM Test Suite Plugin, Test Fixtures, Report Aggregation.
