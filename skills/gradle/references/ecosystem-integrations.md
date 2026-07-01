# Gradle Ecosystem Integrations

Read this when: Gradle coordinates Android, native builds, frontend tools, IDE import, Tooling API, Maven/Ant, test reporting, or external processes.

## General Rule

Gradle should model external tools as tasks with declared inputs, outputs, tool versions, environment assumptions, and ownership boundaries. Do not run external tools during configuration.

## Android

- Read [compatibility-matrix.md](compatibility-matrix.md) before changing Gradle, AGP, Android Studio, Kotlin, or JDK versions in the same flow; keep their compatibility as one constraint set.
- Android Gradle Plugin owns Android variants, Android source sets, generated code integration, packaging, and many task names; use AGP/Android Components APIs for generated sources and variant wiring instead of task names when possible.
- Separate Kotlin Android, KAPT/KSP, Compose compiler, Kotlin JVM target, and Android Studio sync behavior from command-line Gradle execution before patching core Gradle logic.

## Native

- Prefer the modern `cpp-application`, `cpp-library`, `cpp-unit-test`, `swift-application`, `swift-library`, and `xctest` plugins for new native work. Treat older software-model plugins, `model { components { ... } }`, `NativeLibrarySpec`, CUnit, and legacy GoogleTest plugin surfaces as legacy migration owners.
- Native plugins own components, binaries, target machines, build types, toolchains, native test tasks, and Xcode/Visual Studio metadata.
- Identify whether Gradle owns native compilation or delegates to an external native build; check components, binaries, target machines, and toolchains before task wiring.
- Treat native variants as build type plus target machine, and for libraries also linkage. Inspect variant-derived tasks/configurations such as `compileDebugCpp`, `linkDebug`, `createRelease`, `installDebug`, `runTest`, or `xcTest` instead of assuming one binary.
- `assemble` normally builds the development binary, usually the host debug variant. Use variant lifecycle tasks when CI or release needs a non-default target, release build, static library, or installed executable.
- Keep C++ public headers in the exported contract and private headers internal. A native library dependency belongs in `api` when it is needed by public headers or unresolved static-library symbols; otherwise keep it in `implementation` to avoid leaking include roots and link libraries to consumers.
- Declare native dependencies on public declaration configurations such as `api`, `implementation`, and `main<Variant>Implementation`. Use internal resolvable configurations such as `cppCompile<Variant>`, `swiftCompile<Variant>`, `nativeLink<Variant>`, or `nativeRuntime<Variant>` to diagnose the actual compile, link, or runtime inputs.
- Model cross-compilation through `targetMachines` and toolchain configuration. Gradle selects an available toolchain that can build the target machine; C++ generally discovers Visual Studio, Xcode/Clang, GCC, or Clang from the host environment, while Swift uses the official Swift toolchain on macOS/Linux.
- Keep compiler arguments, linker arguments, macros, generated headers/resources, and native outputs on the owning component or variant tasks; avoid shell environment hacks and hard-coded compiler paths unless modeling a toolchain gap.
- Native test plugins create executable or bundle test variants and wire the host-matching test lifecycle into `check`. C++ unit tests and XCTest inherit the tested component where present; diagnose missing libraries through compile/link/runtime configurations before adding ad hoc task dependencies.
- Xcode generation has effectively no generated-file customization; Visual Studio can customize generated solution/project locations. For both, inspect native component/linkage modeling and the `xcode` or `visualStudio` tasks before patching generated `.xcodeproj`, `.xcworkspace`, `.sln`, or `.vcxproj` output.

## Frontend And External Processes

- Model Node/npm/pnpm/yarn/Vite/Webpack commands and other external processes as typed tasks.
- Inputs should include executable/tool versions, lockfiles, package manifests, config files, sources, and relevant environment; outputs should live under `build/` unless another tool requires a different workspace.
- Wire frontend build outputs into JVM/native packaging with providers.
- Use `ExecOperations`, `JavaExec`, or typed task wrappers instead of ad hoc shell strings.
- Make package installs and networked update steps explicit tasks, not hidden configuration work.

## IDE And Tooling API

- IDE import/sync consumes Gradle models; task execution behavior may differ from sync behavior.
- Tools that use Gradle should usually be modeled by plugins and tasks; tools that execute Gradle should usually use the Tooling API.
- Tooling API clients are version-independent, wrapper-aware, daemon-backed external clients with their own JVM and compatibility surface.
- The Tooling API always uses a Gradle daemon. IDE or embedded-client failures should inspect daemon selection and daemon logs even when ordinary CLI reproduction uses different daemon flags.
- Separate Tooling API compatibility into four axes: Tooling API library/client JVM, target Gradle distribution, daemon JVM, and serialized `BuildAction` or custom-model bytecode.
- Let Tooling API connections use the target build distribution by default; overriding the Gradle version or distribution makes the client own that compatibility risk.
- If the target build has no wrapper or configured distribution, the Tooling API falls back to the client library's Gradle version; embedded tools should make that choice visible instead of treating it as project-owned.
- Treat Tooling API library upgrades as integration compatibility work: the client supports running target builds from the last five Gradle major releases plus current/next-major forward compatibility, and individual launcher/model/test methods can still require newer target Gradle versions.
- Use Tooling API launchers, stdout/stderr capture, progress listeners, cancellation tokens, and public models before scraping command-line output from an embedded Gradle invocation.
- On Gradle 9.3+, use incubating resilient `BuildController.fetch(...)` when a Tooling API build action should continue after model-fetch failures; always inspect `FetchModelResult.getFailures()` and the nullable model before treating missing data as an unsupported or absent model.
- `withArguments(...)` supports build-execution options modeled by `StartParameter`; do not pass CLI-only commands such as `-?`, `-v`, or daemon toggles through Tooling API launchers.
- `setEnvironmentVariables(...)` replaces the operation environment; copy the current environment first when adding overrides, especially on Windows.
- Close `ProjectConnection` instances when finished. `ProjectConnection` is thread-safe and long-lived, while `GradleConnector` instances are not thread-safe.
- Treat `BuildLauncher`, `ModelBuilder`, and `TestLauncher` as per-operation builders; they are not thread-safe even when the `ProjectConnection` is.
- Progress notifications from one `ProjectConnection` are serialized, but the delivery thread may change; keep listeners thread-safe and marshal UI updates explicitly.
- Recreate a Tooling API connection after connector inputs such as `gradle.properties`, daemon JVM policy, distribution choice, or Gradle user home change.
- Treat Tooling API `BuildAction` classes as serialized code sent into the build; compile them to the lowest Java level supported by the target Gradle range.
- Kotlin DSL script editor models are Tooling API root-project models, not project-source Kotlin compilation: request `KotlinDslScriptsModel` with `prepareKotlinBuildScriptModel` and classpath or strict-classpath provider mode, use `org.gradle.tooling.model.kotlin.dsl.scripts` only for explicit script files, and when Isolated Projects is enabled diagnose discovery through the isolated model builder because explicit script lists are rejected.
- In composite builds, Tooling API task paths and prior test descriptors can target included builds, but class/method selectors without task targets apply only to the root build; use task-scoped test selectors for included-build tests.
- Use `org.gradle.tooling.parallel` when IDE/model-building parallelism needs a different risk profile from task execution parallelism.
- Notify Gradle daemons about files changed by the external tool itself; do not replay changes discovered by another watcher because Gradle already watches the file system.
- Pass absolute canonical paths to `notifyDaemonsAboutChangedPaths(...)`; for renames send both old and new paths so retained VFS state cannot miss either side.
- Do not depend on IDE-only files for Gradle build correctness.
- Use public models or custom tooling models when external consumers need structured information.
- Register custom tooling model builders through the injectable `ToolingModelBuilderRegistry` in a plugin; do not scrape task output or CLI text to fabricate IDE models.
- Custom tooling models belong in plugins and should be versioned like public integration contracts.
- IDE metadata plugins are integration aids, not the source of build truth.
- Modern IDEA and Eclipse should usually import the Gradle build directly; apply `idea` or `eclipse` only when the build intentionally contributes IDE model customization or generated project files.
- IDEA/Eclipse generated-file tasks are deprecated for removal in Gradle 10, but their DSL customization can still be consumed by IDE import. Keep generated-file hooks separate from build model fixes.
- Use `beforeMerged`, `whenMerged`, and `withXml` only for generated IDE metadata. These hooks do not change Gradle task execution, dependency resolution, or published metadata.
- Eclipse WTP is web/enterprise IDE metadata: it is applied with War/Ear projects for generated Eclipse files, not a packaging substitute for the War/Ear plugins.
- Visual Studio generation mirrors native components and linkages into solution/project files; inspect native component and binary modeling before patching generated `.sln` or `.vcxproj` output.
- When IDE sync fails but CLI works, inspect import-specific models, JVMs, and Tooling API client behavior.

## Maven And Ant

- For Maven migration, map lifecycle, modules, dependency management, profiles, resources, plugins, and publishing separately.
- Read [migration-execution.md](migration-execution.md) for stepwise Maven/Ant replacement; this file owns the interop boundary while legacy build pieces still participate in a Gradle build.
- `ant.importBuild(...)` turns Ant targets into Gradle tasks and can rename targets to avoid collisions, but importing an Ant build disables configuration cache; use it only as a phased migration bridge.
- Ant tasks invoked through `AntBuilder` should run inside Gradle task actions with declared Gradle inputs and outputs. Do not execute Ant work during configuration, and replace permanent Ant work with typed Gradle tasks when cacheability or incrementality matters.
- Keep Ant properties/references separate from Gradle project properties and typed task properties. Copy values into `ant.properties` explicitly only at the boundary; prefer Gradle properties/providers for new build logic.
- When an Ant task requires paths or filesets, bridge Gradle `FileCollection` or `FileTree` values through `addToAntBuilder(...)`, preferably as resource collections when the Ant task supports them.
- Put custom Ant task classpaths in a resolvable Gradle configuration and declare the `taskdef` at the Ant boundary; migrate custom Ant task code to Gradle task types once behavior is no longer temporary.
- Do not keep Maven/Ant compatibility layers longer than the migration phase requires.

## Test Reporting Integrations

- Use Gradle's normal `Test` task for JVM test frameworks it can execute directly.
- Use the Test Event Reporting API when a plugin or platform provider needs non-JVM or custom test execution to produce Gradle-compatible test events and HTML reports; treat the API and `TestEventReporterFactory` as incubating and keep wrappers small.
- Inject `TestEventReporterFactory` into the custom task or plugin-owned type that records events; do not synthesize Gradle test result files by hand.
- Put binary test results and HTML report directories under the task's `build/` ownership and model them as outputs when the custom test task should be cacheable or incremental.
- Model the reporting hierarchy deliberately: root and group reporters can create child groups or leaf test reporters, while leaf test reporters cannot have children.
- Emit events in lifecycle order: call `started(...)` once, record output or metadata only after start, finish with exactly one `succeeded(...)`, `skipped(...)`, or `failed(...)`, and close every reporter even when the underlying test engine fails.
- The default root reporter close behavior fails the task when the root test tree failed; use the explicit `closeThrowsOnTestFailures` overload only when task outcome is intentionally managed elsewhere and the supported Gradle version has that overload.
- Keep test execution ownership in the custom task; the reporting API records results, it does not replace declaring task inputs, outputs, classpaths, or environment.
- Empty or partial custom test report: check reporter hierarchy, `started(...)`, `succeeded(...)`/`failed(...)`, and resource closure before changing report directories.
