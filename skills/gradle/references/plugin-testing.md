# Gradle Plugin Testing

Read this when: Gradle plugin tests, TestKit, `GradleRunner`, `ProjectBuilder`, plugin-under-test classpaths, cross-version plugin tests, or build-logic functional tests owns the work.

## Test Type Choices

- Unit test pure logic without Gradle APIs when possible.
- Use `ProjectBuilder` only for configuration logic such as applying a plugin and inspecting registered extensions or tasks; it does not execute tasks.
- Treat `ProjectBuilder` file/layout resolution as fixture-owned; Gradle 9 anchors settings/build-scoped locations to the configured project directory, so tests must not rely on host-build files leaking in.
- Use integration tests for plugin code that talks to external systems, file IO, HTTP, or other collaborators that should not be mocked away.
- Use TestKit functional tests for end-to-end plugin behavior from a build user's perspective.
- Prefer a dedicated JVM test suite for TestKit functional tests in modern plugin builds; `java-gradle-plugin` adds the JVM Test Suite plugin transitively.
- Separate unit, integration, and functional test source sets or JVM test suites when their dependencies, runtime environment, or execution policy differs.
- Wire non-default integration or functional suites into `check` when they are part of the release signal; a source set alone only compiles code and does not create an execution gate.
- `gradleTestKit()` supplies TestKit and the Tooling API client, not JUnit, TestNG, Spock, or Gradle's implementation dependencies; declare test frameworks and helper libraries explicitly.
- On Gradle 9+, direct `ValidatePlugins` usage needs the Java Toolchains service, supplied by `jvm-toolchains` or JVM plugins such as `java-library`; its `launcher` must also run on a Java version supported by the Gradle daemon.
- For plugin projects on Gradle 9.4+, `java-gradle-plugin` exposes `gradleApi()` as `compileOnlyApi`; register extra test source sets with `gradlePlugin.testSourceSets(...)` or add explicit `gradleApi()` when custom lanes no longer see Gradle API types.
- With `java-gradle-plugin`, `validatePlugins` is wired into `check`, warnings fail by default, and applying a publishing plugin enables stricter validation by convention; do not relax `failOnWarning` or `ignoreFailures` in release gates unless the risk is explicitly accepted.
- Script-local custom tasks or plugins are prototypes; once extracted into `buildSrc`, included `build-logic`, or a plugin project, use composite builds for manual tryouts but add automated TestKit functional tests instead of treating manual runs as release evidence.

## TestKit Model

- `GradleRunner` executes a real Gradle build through the Tooling API in a separate process from the test JVM.
- `GradleRunner` compatibility follows the Tooling API compatibility range; do not assume arbitrary old Gradle versions are supported.
- Test builds do not share the test process classpath or classloaders. Put the plugin under test on the runner classpath deliberately.
- The Java Gradle Plugin Development plugin adds `gradleTestKit()` and can inject the plugin-under-test classpath through `withPluginClasspath()`.
- Automatic classpath injection expects the plugin-under-test to be applied in the test build with the `plugins {}` DSL.
- If functional tests use a custom source set or suite, register it with the plugin development extension so plugin classpath metadata is generated for that lane; use additive `gradlePlugin.testSourceSet(functionalTest)` or include every intended lane in a replacing `gradlePlugin.testSourceSets(...)` call, because `testSourceSets(...)` clears earlier/default test source sets.
- Prefer `withPluginClasspath()` backed by `java-gradle-plugin` metadata over hard-coded `build/classes`, JAR, or runtime classpath assembly.
- Treat an empty explicit `withPluginClasspath(files)` as no injected plugin classpath. When a plugin-not-found failure lacks the `Gradle TestKit (classpath: ...)` hint, inspect the fixture's generated metadata or file list before debugging plugin resolution.
- Treat injected plugin classpath as plugin-resolution classpath, not a global buildscript classpath. Classes become visible when the plugin is applied in a project and can flow to its child projects, but they are not visible to unrelated projects or to later TestKit builds unless the runner injects them again.
- `buildSrc` and injected plugin classpaths stay isolated from each other; a class name clash should resolve according to whether the build applies the plugin from TestKit injection or from `buildSrc`.
- TestKit uses isolated fixture directories, a TestKit-controlled Gradle User Home, and dedicated Gradle daemons; it does not inherit default `~/.gradle/gradle.properties`, caches, init scripts, or environment customizations unless the fixture wires them.
- TestKit working directories are not deleted by default.
- Set `org.gradle.testkit.dir` or `GradleRunner.withTestKitDir(...)` when TestKit state should live under a build-managed directory or be cleaned predictably.
- Set TestKit directory and Gradle distribution cache controls in the test JVM or runner process; fixture `gradle.properties` and build scripts affect the build under test, not where the runner downloads Gradle or stores TestKit state.
- If the fixture passes `-g` or `--gradle-user-home`, that directory overrides the TestKit directory as the test build's Gradle User Home; isolate and clean it with the same care as `withTestKitDir(...)`.
- On Windows, TestKit disables file-system watching for `GradleRunner` builds to avoid fixture root locks; pass `--watch-fs` only when watcher behavior is the behavior under test.

## Runner Decisions

- Always call `withProjectDir(...)` with an isolated fixture root before `build()` or `buildAndFail()`; TestKit requires it and suppresses parent `settings.gradle` discovery for that fixture build.
- Keep the TestKit directory fixture-owned, writable, and directory-shaped; a file path, unwritable location, or uncreatable parent fails before the build under test starts.
- Treat `withArguments(...)` as setting the complete Gradle argument list for that runner; compose fixture defaults and per-test flags before calling it so one helper does not silently replace another.
- Use `build()` when success is expected and `buildAndFail()` when failure is part of the contract.
- Use `run()` when the test intentionally inspects the returned result without treating success or failure as the API-level expectation.
- When `build()` or `buildAndFail()` reports an unexpected result, inspect the exception's `BuildResult` for output and started tasks before rewriting the fixture; runner configuration errors, daemon startup failures, and Tooling API transport failures are not ordinary target-build assertions.
- Assert task outcomes, output, logs, generated files, reports, and diagnostics according to the behavior under test.
- Assert explicit task paths such as `result.task(":verifyUrl")`; a `null` task result means the task was not part of the executed build, not that it had the wrong outcome.
- Prefer `BuildResult.getOutput()` for assertions. Use `forwardOutput()` only for live diagnostics because it merges stdout and stderr and replaces previous stream-specific forwarding; use `forwardStdOutput(...)` and `forwardStdError(...)` when the test needs separated streams.
- For very large output, stream with `BuildResult.getOutputReader()` and close the reader; `getOutput()` materializes the merged build output.
- For prompt-driven behavior, provide deterministic `withStandardInput(...)` and capture the prompt through output forwarding; do not let TestKit tests depend on an ambient console.
- Treat `BuildResult.tasks` as the target build's started tasks, not build setup work such as `buildSrc`; task order is start order and can be nondeterministic under parallel execution.
- Do not share one `GradleRunner` instance across concurrent tests; create separate runner instances for parallel fixture lanes.
- Use `withGradleVersion`, `withGradleInstallation`, or `withGradleDistribution` for cross-version plugin tests; otherwise the runner normally uses the Gradle version building or importing the plugin project, so the test proves only that default execution lane.
- If the runner cannot infer a Gradle runtime from its own classpath, specify one explicitly with `withGradleVersion(...)`, `withGradleInstallation(...)`, or `withGradleDistribution(...)`.
- `withGradleVersion(...)` and remote `withGradleDistribution(...)` can download Gradle distributions into the Gradle User Home seen by the test JVM; for offline or hermetic CI, preseed that cache, set `gradle.user.home`/`GRADLE_USER_HOME` deliberately, or use `withGradleInstallation(...)` or a local distribution URI.
- For supported-version claims, choose an explicit Gradle version matrix instead of relying on the build Gradle version as the only lane.
- For multi-variant plugins, test each Gradle API-version boundary with explicit `withGradleVersion(...)` lanes and fixtures that consume the plugin the same way users do; otherwise the default or current-build variant can hide broken variant wiring.
- Gradle version selection does not choose the daemon JVM. When daemon-JDK behavior matters, express it as a fixture input: `org.gradle.java.home` in fixture Gradle properties or runner arguments, checked-in Daemon JVM criteria plus fixture-owned Java installation discovery, or a deliberate test JVM launch for implicit-daemon lanes.
- To debug build logic exercised by TestKit, enable `org.gradle.testkit.debug=true` for the test JVM or call `GradleRunner.withDebug(true)`. Debugging the test JVM alone does not debug the build process.
- Do not combine `withEnvironment(...)` with TestKit debug; debug mode runs the build in-process, while custom environment variables require a forked build process.
- For configuration-cache functional tests, run the same fixture at least twice with `--configuration-cache`; one successful invocation proves storage, not reuse.
- When TestKit fixtures also apply Java agents such as JaCoCo, verify the configuration-cache lane separately because agent instrumentation can interfere with TestKit-run builds.
- For build-cache functional tests, pass `--build-cache`, assert `FROM_CACHE` where relevant, and isolate or clean the local build cache because TestKit can reuse TestKit-controlled Gradle User Home state between tests.
- A cacheability claim needs more than a warm `FROM_CACHE` assertion: vary inputs, verify re-execution, and include relocatability when outputs should move across directories or machines.
- Execute `assemble` when IDE-run TestKit tests need freshly generated plugin classpath metadata.

## Fixture Rules

- Keep fixture builds minimal and explicit: settings, build script, plugin application, sample sources, and expected outputs.
- Include at least one fixture that applies the plugin by public ID through the `plugins {}` DSL so descriptor generation and automatic classpath injection are covered together.
- A fixture that puts plugin classes on `buildscript { dependencies { classpath(...) } }` and uses `apply plugin:` can prove legacy or manual classpath consumption, but it does not prove plugin marker metadata or `plugins {}` DSL injection.
- Test both Groovy and Kotlin DSL fixtures when the plugin exposes public DSL, typed accessors, or convention APIs users will write in both DSLs.
- Include configuration-cache and build-cache fixture coverage when the plugin advertises support for those modes.
- Tests inside an included `build-logic` build do not run just because the root build needs build-logic artifacts; invoke `:build-logic:check` or wire CI explicitly.
- Do not rely on machine-local init scripts, default Gradle properties, ambient repositories, or user home state in fixtures.
- When behavior under test depends on init scripts or init plugins, pass an explicit `--init-script`/`-I` or create fixture-owned init files in the test Gradle User Home.
- Prefer local test repositories, included builds, or generated fixtures over live network dependencies.

## Symptom Map

- Plugin not found in TestKit build: inspect plugin-under-test classpath injection, plugin DSL application, plugin id, and custom source-set metadata.
- `InvalidPluginMetadataException` before the TestKit build runs: check that `plugin-under-test-metadata.properties` is on the test runtime classpath, has a non-empty `implementation-classpath`, and was generated for the source set or suite under test; remember `withPluginClasspath(explicitFiles)` replaces conventional metadata-backed classpath injection.
- `InvalidRunnerConfigurationException` before the TestKit build runs: check `withProjectDir(...)`, TestKit directory validity, debug plus environment-variable usage, and explicit Gradle runtime selection before changing the fixture build.
- `UnsupportedFeatureException` when reading `BuildResult.output` in debug mode: the target Gradle version may be too old for debug output capture; disable debug for that lane or use a supported explicit `withGradleVersion(...)`.
- `ValidatePlugins` fails before validation output: check for a missing Java Toolchains plugin or a `launcher` set to a Java version below Gradle's daemon minimum before changing plugin descriptors.
- TestKit execution fails before a build result with a daemon Java version message: inspect fixture daemon-JVM inputs and the selected Gradle version's Java runtime support; `buildAndFail()` only expects build failure, not client/daemon startup failure.
- Test passes in Gradle but fails in IDE: regenerate plugin classpath metadata and check which Gradle distribution the IDE import supplied.
- Breakpoints do not hit plugin code: enable TestKit debug for the runner's build process.
- Cache test is flaky: isolate TestKit dir and local build cache, then verify clean/warm runs separately.
- Root `check` misses convention-plugin regressions: confirm whether the plugin lives in an included build whose own `check` task was never invoked.
- Functional test leaks machine policy: inspect Gradle User Home, init scripts, repositories, credentials, and fixture settings.
