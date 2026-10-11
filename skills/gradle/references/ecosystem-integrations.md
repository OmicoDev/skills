# Gradle Ecosystem Integrations

Read this when: Gradle coordinates Android, native builds, frontend tools, IDE import, Tooling API, Maven/Ant, test reporting, or external processes.

## General Rule

Gradle should model external build tools as tasks with declared inputs, outputs, tool versions, environment assumptions, and ownership boundaries. When configuration genuinely needs a process-derived input, follow the provider/`ValueSource` guidance in [external-processes.md](external-processes.md).

## Android

- Read [compatibility-matrix.md](compatibility-matrix.md) before changing Gradle, AGP, Android Studio, Kotlin, or JDK versions in the same flow; keep their compatibility as one constraint set.
- Android Gradle Plugin owns Android variants, Android source sets, generated code integration, packaging, and many task names; use AGP/Android Components APIs for generated sources and variant wiring instead of task names when possible.
- Separate Kotlin Android, KAPT/KSP, Compose compiler, Kotlin JVM target, and Android Studio sync behavior from command-line Gradle execution before patching core Gradle logic.

## Native

- Prefer the modern `cpp-application`, `cpp-library`, `cpp-unit-test`, `swift-application`, `swift-library`, and `xctest` plugins for new native work. Gradle 9.7 deprecates the old software model for removal in Gradle 10, including `model {}`, `RuleSource`, rule-based component/native/test plugins, `componentReport`, and `dependentComponents`; treat those surfaces as migration owners rather than extending them.
- Native plugins own components, binaries, target machines, build types, toolchains, native test tasks, and Xcode/Visual Studio metadata.
- Identify whether Gradle owns native compilation or delegates to an external native build; check components, binaries, target machines, and toolchains before task wiring.
- Treat native variants as build type plus target machine, and for libraries also linkage. Inspect variant-derived tasks/configurations such as `compileDebugCpp`, `linkDebug`, `createRelease`, `installDebug`, `runTest`, or `xcTest` instead of assuming one binary.
- `assemble` normally builds the development binary, usually the host debug variant. Use variant lifecycle tasks when CI or release needs a non-default target, release build, static library, or installed executable.
- Keep C++ public headers in the exported contract and private headers internal. Use `api` for dependencies needed by public headers and `implementation` for private implementation dependencies. In Gradle 9.7.1, native link/runtime variants also carry implementation dependencies; unresolved static-library symbols alone do not require promoting a dependency to `api`. Diagnose consumer compile headers separately from link/runtime inputs.
- Declare native dependencies on public declaration configurations such as `api`, `implementation`, and `main<Variant>Implementation`. Use internal resolvable configurations such as `cppCompile<Variant>`, `swiftCompile<Variant>`, `nativeLink<Variant>`, or `nativeRuntime<Variant>` to diagnose the actual compile, link, or runtime inputs.
- Model cross-compilation through `targetMachines` and toolchain configuration. Gradle selects an available toolchain that can build the target machine; C++ generally discovers Visual Studio, Xcode/Clang, GCC, or Clang from the host environment, while Swift uses the official Swift toolchain on macOS/Linux.
- Keep compiler arguments, linker arguments, macros, generated headers/resources, and native outputs on the owning component or variant tasks; avoid shell environment hacks and hard-coded compiler paths unless modeling a toolchain gap.
- Native test plugins create executable or bundle test variants and wire the host-matching test lifecycle into `check`. C++ unit tests and XCTest inherit the tested component where present; diagnose missing libraries through compile/link/runtime configurations before adding ad hoc task dependencies.
- Xcode generation has effectively no generated-file customization; Visual Studio can customize generated solution/project locations. For both, inspect native component/linkage modeling and the `xcode` or `visualStudio` tasks before patching generated `.xcodeproj`, `.xcworkspace`, `.sln`, or `.vcxproj` output.

## Frontend And External Processes

- Read [external-processes.md](external-processes.md) when process execution APIs, `providers.exec/javaexec`, external-tool cancellation, or subprocess cleanup owns the implementation.
- Read [worker-api-and-processes.md](worker-api-and-processes.md) when Worker API isolation or worker daemon behavior owns the implementation.
- Model Node/npm/pnpm/yarn/Vite/Webpack commands and other external processes as typed tasks.
- Inputs should include executable/tool versions, lockfiles, package manifests, config files, sources, and relevant environment; outputs should live under `build/` unless another tool requires a different workspace.
- Wire frontend build outputs into JVM/native packaging with providers.
- Use `ExecOperations`, `JavaExec`, or typed task wrappers instead of ad hoc shell strings.
- Make package installs and networked update steps explicit tasks, not hidden configuration work.

## IDE Metadata

- Read [tooling-api.md](tooling-api.md) when IDE import or sync, an external Gradle client, `ProjectConnection`, build actions, custom tooling models, or model-building parallelism owns the behavior.
- Do not depend on IDE-only files for Gradle build correctness.
- IDE metadata plugins are integration aids, not the source of build truth.
- Modern IDEA and Eclipse should usually import the Gradle build directly; apply `idea` or `eclipse` only when the build intentionally contributes IDE model customization or generated project files.
- IDEA/Eclipse generated-file tasks are deprecated for removal in Gradle 10, but their DSL customization can still be consumed by IDE import. Keep generated-file hooks separate from build model fixes.
- For Gradle 9.6+ IDE file-generation deprecations, migrate away from the generation/open/clean tasks and generated-file settings such as `iml`, `ipr`, `workspace`, `EclipseJdt.file`, and `withXml`. In 9.7.1, keep Eclipse project/classpath `beforeMerged` and `whenMerged` hooks and WTP component model settings used by IDE import; WTP facet and component `file` merging settings are deprecated, not the entire `eclipse.wtp` block.
- `withXml` changes generated XML only. In Gradle 9.7.1, Eclipse project/classpath `beforeMerged` and `whenMerged` also customize the Tooling API import model. These model hooks do not replace Gradle task wiring, dependency declarations, or publication configuration.
- Eclipse WTP is web/enterprise IDE metadata, not a packaging substitute for War/Ear. Applying `eclipse` to a War/Ear project also applies `eclipse-wtp`; utility Java projects need explicit WTP application when required. In Gradle 9.7.1, WTP component settings can supply classpath attributes consumed by Buildship without generating Eclipse files.
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
- Use the Test Event Reporting API when a plugin or platform provider needs non-JVM or custom test execution to produce Gradle-compatible test events and HTML reports; treat the API and `TestEventReporterFactory` as incubating, minimum-Gradle-version-sensitive public API and keep wrappers small.
- Inject `TestEventReporterFactory` into the custom task or plugin-owned type that records events; do not synthesize Gradle test result files by hand.
- Put binary test results and HTML report directories under the task's `build/` ownership and model them as outputs when the custom test task should be cacheable or incremental.
- Model the reporting hierarchy deliberately: root and group reporters can create child groups or leaf test reporters, while leaf test reporters cannot have children.
- Emit events in lifecycle order: call `started(...)` once, record output or metadata only after start, finish with exactly one `succeeded(...)`, `skipped(...)`, or `failed(...)`, and close every reporter even when the underlying test engine fails.
- In Gradle 9.7.1, complete and close each child before completing its parent group, including the root; a child that has reported its result but remains open still blocks parent completion. Nest resource scopes so child closure precedes the parent's terminal event.
- Version-gate entrypoints in cross-version plugins: `TestEventReporterFactory` is Gradle 8.12+, its three-argument root factory replaces the 8.12 single-name factory in 8.13, and the explicit `closeThrowsOnTestFailures` overload is 9.3+. Single key/value metadata existed in 8.13 with an `Object` value; 9.4 replaces that signature with a `String` value.
- In Gradle 9.7.1, explicitly mark the root reporter failed when the custom engine's outcome should fail the task; reporting failed children alone does not make root closure throw. The default factory throws on close when the root was marked failed. Use the 9.3+ `closeThrowsOnTestFailures = false` overload only when task outcome is intentionally managed elsewhere; it does not turn failed report results into successes.
- For one plugin binary spanning Gradle 8.13 and 9.4+, prefer map-form `metadata(...)` with string values: its erased signature survives the change from `Map<String, Object>` to `Map<String, String>`, while the single-value signature changes. Omit metadata on 8.12 or isolate it behind a version-specific helper; do not bind to internal result writers.
- Keep test execution ownership in the custom task; the reporting API records results, it does not replace declaring task inputs, outputs, classpaths, or environment.
- Empty or partial custom test report: check reporter hierarchy, `started(...)`, `succeeded(...)`/`failed(...)`, and resource closure before changing report directories.
