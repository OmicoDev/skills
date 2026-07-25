# Gradle JVM Testing And Quality

Read this when: JVM test tasks, JVM Test Suite, fixtures, test filtering, report aggregation, JaCoCo, or JVM source-quality checks owns the task.

Read [jvm-compilation-and-toolchains.md](jvm-compilation-and-toolchains.md) when JVM plugin selection, source sets, compilation, Java toolchains, or generated API documentation owns the task.

## Testing

- `Test` tasks execute test classes or definitions; JVM Test Suite models a suite, its source set, dependencies, target `Test` task, and verification variants.
- Custom `Test` tasks need `testClassesDirs` and execution `classpath`; JVM language plugins and source sets wire these for conventional tests, but hand-authored tasks must not rely on legacy implicit `test` source-set wiring.
- `Test` tasks run in forked JVMs. Increase `maxParallelForks` only when tests isolate filesystem, ports, services, and static state; use `org.gradle.test.worker` for per-fork resources.
- Use `forkEvery` only to contain leaky tests or frameworks; low nonzero values create many fresh test JVMs and can dominate test time.
- Replace deprecated `setAllJvmArgs(...)` on `Test`, `JavaExec`, or other `JavaForkOptions` with `setJvmArgs`, `jvmArgs`, or `jvmArgumentProviders`; manually clear system properties, argument providers, heap settings, assertions, or debug flags when the old clear-all behavior was intentional.
- Configure frameworks explicitly: `useJUnitPlatform()`, TestNG, and JUnit Vintage/Jupiter launcher/runtime dependencies belong on the test classpath; use TestNG 6.9.13.3+ for stable class/method reporting on Gradle 9.3+, and replace Gradle 9.4+ closure-style `Test` hooks (`beforeTest`, `afterTest`, `beforeSuite`, `afterSuite`, `onOutput`, `testFramework(Closure)`) with `addTestListener(...)`, `addTestOutputListener(...)`, or `options(Action)`.
- Use test filtering for narrow execution, but do not commit local filters accidentally. `--test-dry-run` proves selected tests without execution; treat its reports as selection evidence, not pass/fail evidence, because selected tests are reported as skipped.
- `--tests` filters are additive with build-script filters and wildcards are text-based, not package-depth aware; use command-line filters for temporary local selection and keep persistent script filters intentional.
- When `scanForTestClasses = false`, `includes` and `excludes` own class selection; without patterns Gradle falls back to `**/*Tests.class` and `**/*Test.class` while excluding `**/Abstract*.class`. JUnit Platform ignores `scanForTestClasses`.
- Use `ignoreFailures` only when downstream tasks must continue after a failing `Test` task; it does not skip remaining detected tests or turn failures into passes.
- `failFast` saves time but can leave partial test reports; use `--continue` for aggregate reports after failures, and ensure report tasks do not depend on failed task dependencies.
- JUnit XML `mergeReruns` changes reporting of pass-on-retry failures and groups executions by reported test name; it does not add retry behavior. Keep retry policy in the framework or a retry plugin.
- Configure fork options, logging, reports, debug ports, and task-level framework options on `Test` tasks or suite targets; `--debug-jvm` starts the test JVM suspended on port 5005 unless `debugOptions` changes it.
- Single-project HTML reports include all `Test` tasks that ran in that project; cross-project test or coverage reports should use `test-report-aggregation` or `jacoco-report-aggregation` rather than file-tree collection from subproject `build/` directories.
- Aggregation plugins resolve project verification variants by suite name through `testReportAggregation` or `jacocoAggregation`; automatic report objects require JVM Test Suite producers, standalone aggregators must register reports and project dependencies, and `com.android.application` remains outside the current boundary.
- Treat aggregate test and coverage reports as variant selection: producers expose `org.gradle.category=verification`, `org.gradle.testsuite.name=<suite>`, and `org.gradle.verificationtype`; use public attributes/constants or `outgoingVariants` evidence before hard-coding literals.
- Do not assume JaCoCo tasks are lifecycle-wired: `jacocoTestReport` does not depend on `test`, and `jacocoTestCoverageVerification` is not a dependency of Java's `check` task unless the build wires it deliberately.
- The JaCoCo plugin instruments `Test` tasks and can instrument other `JavaForkOptions` tasks; execution data is deleted when an instrumented task starts, so model report dependencies instead of relying on stale `.exec` files.
- Use test fixtures when reusable test support is part of the project contract. Fixture `implementation` dependencies do not leak to consuming test compile classpaths, and published external fixtures rely on Gradle Module Metadata variants/capabilities.
- For non-class-based engines such as Cucumber, use JUnit Platform, add the runtime `TestEngine`, wire `testDefinitionDirs`, and prefer a separate `Test` task or suite from class-based tests. Filtering is file-level by path-derived names, ambiguous dotted paths cannot be selected individually, and `maxParallelForks` distributes definition directories, not individual files inside one directory.

## Test Suite Decisions

- Model a new suite when tests differ by purpose, sources, dependencies, runtime environment, duration, or CI stage; use framework tags/groups and `--tests` only for narrowing tests inside the same purpose.
- Use an extra `Test` task for a narrow local workflow; use JVM Test Suite for reusable convention, variant-aware reporting, or a source/dependency owner that should survive across projects.
- For integration, functional, smoke, or contract tests, wire execution and `check` participation deliberately. `shouldRunAfter` orders work but does not select it; keep flaky, expensive, or environment-dependent suites behind explicit tasks or CI stages.
- Treat JVM Test Suite as an incubating API behind shared convention plugins. The built-in `test` suite keeps legacy names, needs an explicit framework, and automatically sees production dependencies; additional suites conventionally use JUnit Jupiter but need explicit `project()` dependencies when they test project outputs.
- Configure suite dependencies inside the suite; suite-level `useJUnitJupiter()` adds framework libraries and configures target `Test` tasks, while task-level `useJUnitPlatform()` only changes execution. Configure target `Test` tasks for ordering, forks, logging, debug, filters, and framework options.
- Treat suite names as published verification coordinates. Renaming a suite or aggregating a non-`test` suite requires matching report objects and matching producer variants.

## JVM Quality Checks

- Checkstyle and PMD own Java source quality checks; CodeNarc owns Groovy source quality checks and only adds source-set tasks when used with the Groovy plugin.
- Quality plugins create source-set tasks such as `checkstyleMain`, `pmdMain`, and `codenarcMain` and wire them into `check`; triage the narrow source-set task before broad `check`. Gradle 9.4+ gives CodeNarc a source-set compilation classpath by default, so clear or override it only when enhanced classpath rules are not wanted.
- Tool libraries belong in `checkstyle`, `pmd`, `pmdAux`, or `codenarc` configurations, not application classpaths. Use `pmdAux` for PMD type-resolution complaints and `codenarc` for a different Groovy/tool dependency; adding any `checkstyle` dependency replaces the default `com.puppycrawl.tools:checkstyle` unless that module is added explicitly.
- Checkstyle and PMD run with the Gradle runtime JVM by default; configure Checkstyle task `javaLauncher` when the Checkstyle tool requires a different JDK than the build runtime.
- PMD `threads` is internal to PMD and multiplies with Gradle parallel task execution across projects; size it for the whole build, not one task in isolation. Remove `targetJdk` configuration instead of replacing it; supported PMD versions infer language level from rulesets.
- Default quality config locations are root `config/checkstyle/checkstyle.xml` and `config/codenarc/codenarc.xml`; inspect tool config and generated reports before changing dependencies.

## Failure Triage

- Missing test dependencies: inspect test runtime classpath, framework engine dependencies, and launcher libraries; Gradle 9 no longer masks missing runtime dependencies by leaking internal framework implementation libraries.
- No tests discovered: inspect engine setup, compiled test classes, suite/task selection, and custom `Test` task wiring for `testClassesDirs` and `classpath`; under JUnit Platform, `scanForTestClasses` has no effect. On Gradle 9+, a task with sources and no filters fails when it discovers no tests unless `failOnNoDiscoveredTests` is disabled.
- No tests match filters: inspect `--tests`, build-script filters, includes, and excludes; filter mismatch is controlled by `failOnNoMatchingTests`, not `failOnNoDiscoveredTests`.
- Unsupported class file version: separate Gradle runtime JVM, plugin bytecode, compile target, and test runtime.
- Slow tests: inspect forks, parallelism, reports, test isolation, and cacheability policy.
- Missing aggregate reports: inspect `testReportAggregation` or `jacocoAggregation` project dependencies, producer verification attributes, suite names, Android plugin boundaries, and whether the build stopped before report tasks.
- External test fixtures fail to resolve: verify the producer publishes Gradle Module Metadata and the `-test-fixtures` capability before replacing it with classifier or file dependencies.
