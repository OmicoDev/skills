# Gradle JVM And Tests

Read this when: Java/Kotlin/Groovy/Scala build authoring, Java toolchains, JVM test tasks, code-quality checks, test suites, fixtures, source sets, or report aggregation owns the task.

## JVM Plugin Boundaries

- `java` owns source sets, compile/test/jar lifecycle, and standard JVM configurations.
- `java-library` adds API/implementation separation and API variants.
- `java-platform` publishes dependency constraints, not ordinary compiled classes.
- Kotlin, Groovy, Scala, Android, and external JVM plugins add their own task and source-set layers; identify which plugin owns the model before patching.
- The Kotlin Gradle Plugin adds the Kotlin standard library to each source set by default; do not declare `kotlin-stdlib` explicitly unless the build disables that default or owns a deliberate stdlib version policy.

## Toolchains

- Read [compatibility-java.md](compatibility-java.md) when deciding whether a Java version can run Gradle or is only safe as a toolchain target for the selected Gradle version.
- The Gradle runtime JVM runs Gradle and plugins.
- Java toolchains select JVMs for compile, test, javadoc, and custom Java tool tasks.
- Prefer toolchains over `JAVA_HOME` or `sourceCompatibility`/`targetCompatibility` alone.
- Toolchains choose the JDK; they do not prevent accidental use of newer Java APIs. Use `--release` for Java API targeting when compiling Java sources for older platforms.
- A non-empty `JavaToolchainSpec` must set `languageVersion`; vendor, implementation, and native-image capability are refinements, not substitutes.
- Diagnose with `./gradlew -q javaToolchains` when available in the build; the report shows detection source, metadata, auto-detection/download state, and invalid installations.
- Configure toolchain resolver plugins and toolchain repositories in settings when auto-provisioning is allowed. Repository order decides which matching JDK is downloaded first.
- Auto-provisioning only downloads GA JDKs when no detected toolchain matches; it does not update already-provisioned JDKs. Stop daemons after changing toolchain locations or provisioning policy.
- For custom Java tasks, expose `JavaCompiler`, `JavaLauncher`, or `JavadocTool` providers, or lazily map their executable/home paths into `RegularFileProperty` or `DirectoryProperty`; avoid eager `.get()` during configuration.
- Mark custom task toolchain tool properties as `@Nested` inputs so launcher, compiler, or javadoc tool changes participate in validation, up-to-date checks, and cache keys.
- Custom `fromEnv` and `paths` locations extend the detected candidate set. Precedence still prefers the current Gradle JVM, then JDKs over JREs, vendor order, higher versions, then path ordering.

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
- Custom `Test` tasks need `testClassesDirs` and execution `classpath`; JVM language plugins and source sets wire these for conventional tests, but hand-authored tasks must not rely on legacy implicit `test` source-set wiring.
- `Test` tasks run in forked JVMs. Increase `maxParallelForks` only when tests isolate filesystem, ports, services, and static state; use `org.gradle.test.worker` for per-fork resources.
- Use `forkEvery` only to contain leaky tests or frameworks; low nonzero values create many fresh test JVMs and can dominate test time.
- Use `useJUnitPlatform()`, TestNG, or other framework configuration explicitly when required. JUnit Jupiter needs platform execution plus Jupiter, Platform, and launcher runtime dependencies; JUnit 3/4 on the platform needs Vintage.
- Use test filtering for narrow execution, but do not commit local filters accidentally. `--test-dry-run` proves selected tests without executing them.
- `--tests` filters are additive with build-script filters and wildcards are text-based, not package-depth aware; use command-line filters for temporary local selection and keep persistent script filters intentional.
- When `scanForTestClasses = false`, `includes` and `excludes` own class selection; without patterns Gradle falls back to `**/*Tests.class` and `**/*Test.class` while excluding `**/Abstract*.class`. JUnit Platform ignores `scanForTestClasses`.
- Use `ignoreFailures` only when downstream tasks must continue after a failing `Test` task; it does not skip remaining detected tests or turn failures into passes.
- `failFast` saves time but can leave partial test reports; use `--continue` when aggregate test or coverage reports must be produced even after failures.
- JUnit XML `mergeReruns` changes reporting of pass-on-retry failures; it does not add retry behavior. Keep retry policy in the framework or a retry plugin.
- Configure fork options, logging, reports, debug ports, and task-level framework options on `Test` tasks or suite targets; `--debug-jvm` starts the test JVM suspended on port 5005 unless `debugOptions` changes it.
- Single-project HTML reports include all `Test` tasks that ran in that project; cross-project test or coverage reports should use `test-report-aggregation` or `jacoco-report-aggregation` rather than file-tree collection from subproject `build/` directories.
- Aggregation plugins resolve verification variants by suite name through `testReportAggregation` or `jacocoAggregation`. They need JVM Test Suite producers for automatic report objects; manually register reports when the aggregation project does not apply `jvm-test-suite`, and keep `com.android.application` outside the current aggregation-plugin boundary.
- Treat aggregate test and coverage reports as variant selection: producers expose `org.gradle.category=verification`, `org.gradle.testsuite.name=<suite>`, and a verification type; use public attributes/constants or `outgoingVariants` evidence before hard-coding literal strings.
- Do not assume JaCoCo tasks are lifecycle-wired: `jacocoTestReport` does not depend on `test`, and `jacocoTestCoverageVerification` is not a dependency of Java's `check` task unless the build wires it deliberately.
- The JaCoCo plugin instruments `Test` tasks and can instrument other `JavaForkOptions` tasks; execution data is deleted when an instrumented task starts, so model report dependencies instead of relying on stale `.exec` files.
- Use test fixtures when reusable test support is part of the project contract. Fixture `implementation` dependencies do not leak to consuming test compile classpaths, and published external fixtures rely on Gradle Module Metadata variants/capabilities.
- For non-class-based engines such as Cucumber, use JUnit Platform, add the runtime `TestEngine`, wire `testDefinitionDirs`, and prefer a separate `Test` task or suite from class-based tests. Filtering is file-level by path-derived names, ambiguous dotted paths cannot be selected individually, and `maxParallelForks` distributes definition directories, not individual files inside one directory.

## Test Suite Decisions

- Use an extra `Test` task for a narrow local workflow; use JVM Test Suite when the suite has its own sources, dependencies, targets, or reusable convention.
- Use separate source sets for integration, functional, smoke, or contract tests. Wire custom suites into `check` only when they should run in ordinary verification; keep flaky, expensive, or environment-dependent suites behind explicit tasks or CI stages.
- Treat the JVM Test Suite API as incubating and keep shared convention plugins as the compatibility buffer.
- The built-in `test` suite keeps legacy source set and configuration names, but it still needs an explicit framework. Additional suites do not automatically depend on production outputs.
- Additional suites conventionally use JUnit Jupiter unless changed, but only the built-in `test` suite is automatically wired to production implementation dependencies.
- Configure suite dependencies inside the suite when they are suite-scoped. Configure target `Test` tasks for task behavior such as ordering, forks, logging, debug, filters, and framework options.
- Suite-level `useJUnitJupiter()` adds framework libraries and configures target `Test` tasks; task-level `useJUnitPlatform()` only changes the execution framework.
- Treat suite names as published verification coordinates. Renaming a suite or aggregating a non-`test` suite requires matching report objects and matching producer variants.

## JVM Quality Checks

- Checkstyle and PMD own Java source quality checks; CodeNarc owns Groovy source quality checks and only adds source-set tasks when used with the Groovy plugin.
- Quality plugins create source-set tasks such as `checkstyleMain`, `pmdMain`, and `codenarcMain` and wire them into `check`; triage the narrow source-set task before broad `check`.
- Tool libraries belong in `checkstyle`, `pmd`, `pmdAux`, or `codenarc` configurations, not application classpaths. Use `pmdAux` for PMD type-resolution complaints and `codenarc` for a different Groovy/tool dependency; adding any `checkstyle` dependency replaces the default `com.puppycrawl.tools:checkstyle` unless that module is added explicitly.
- Checkstyle and PMD run with the Gradle runtime JVM by default; configure Checkstyle task `javaLauncher` when the Checkstyle tool requires a different JDK than the build runtime.
- PMD `threads` is internal to PMD and multiplies with Gradle parallel task execution across projects; size it for the whole build, not one task in isolation.
- Default quality config locations are root `config/checkstyle/checkstyle.xml` and `config/codenarc/codenarc.xml`; inspect tool config and generated reports before changing dependencies.

## Failure Triage

- Missing test dependencies: inspect test runtime classpath, framework engine dependencies, and launcher libraries; Gradle 9 no longer masks missing runtime dependencies by leaking internal framework implementation libraries.
- No tests found: inspect `--tests` plus build-script filters, includes/excludes, engine setup, compiled test classes, and suite/task selection. Custom `Test` tasks must wire `testClassesDirs` and `classpath`; under JUnit Platform, `scanForTestClasses` has no effect.
- Unsupported class file version: separate Gradle runtime JVM, plugin bytecode, compile target, and test runtime.
- Slow tests: inspect forks, parallelism, reports, test isolation, and cacheability policy.
- Missing aggregate reports: inspect `testReportAggregation` or `jacocoAggregation` project dependencies, producer verification attributes, suite names, Android plugin boundaries, and whether the build stopped before report tasks.
- External test fixtures fail to resolve: verify the producer publishes Gradle Module Metadata and the `-test-fixtures` capability before replacing it with classifier or file dependencies.

## Source Calibration

Primary upstream pages: Java Plugin, Java Library Plugin, Toolchains for JVM projects, Testing in Java and JVM projects, JVM Test Suite Plugin, Test Fixtures, Test Report Aggregation Plugin, JaCoCo Plugin, JaCoCo Report Aggregation Plugin, Checkstyle Plugin, PMD Plugin, CodeNarc Plugin, Best Practices for Dependencies.
