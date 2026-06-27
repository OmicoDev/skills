# Gradle Ecosystem Integrations

Read this when: Gradle coordinates Android, native builds, frontend tools, IDE import, Tooling API, Maven/Ant, test reporting, or external processes.

## General Rule

Gradle should model external tools as tasks with declared inputs, outputs, tool versions, environment assumptions, and ownership boundaries. Do not run external tools during configuration.

## Android

- Read [compatibility-matrix.md](compatibility-matrix.md) before changing Gradle, AGP, Android Studio, Kotlin, or JDK versions in the same flow; keep their compatibility as one constraint set.
- Android Gradle Plugin owns Android variants, Android source sets, generated code integration, packaging, and many task names; use AGP/Android Components APIs for generated sources and variant wiring instead of task names when possible.
- Separate Kotlin Android, KAPT/KSP, Compose compiler, Kotlin JVM target, and Android Studio sync behavior from command-line Gradle execution before patching core Gradle logic.

## Native

- Native plugins own components, binaries, target machines, build types, toolchains, native test tasks, and Xcode/Visual Studio metadata.
- Identify whether Gradle owns native compilation or delegates to an external native build; check components, binaries, target machines, and toolchains before task wiring.
- Treat native variants as build type, target machine, and for libraries linkage; inspect variant-derived tasks/configurations instead of assuming one binary.
- Keep public/exported headers and API dependencies as the consumer contract; private headers and implementation dependencies stay internal to the component.
- Model cross-compilation, compiler/linker flags, generated headers/resources, and native outputs through the native model and task outputs instead of shell environment or hard-coded compiler paths.
- For Xcode or Visual Studio issues, inspect the Gradle `xcode`/`visualStudio` generation tasks and native component/linkage modeling before patching generated `.xcodeproj`, `.sln`, or `.vcxproj` output. Generated IDE files delegate build ownership back to Gradle.

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
- Use Tooling API launchers, stdout/stderr capture, progress listeners, cancellation tokens, and public models before scraping command-line output from an embedded Gradle invocation.
- Close `ProjectConnection` instances when finished. `ProjectConnection` is thread-safe and long-lived, while `GradleConnector` instances are not thread-safe.
- Recreate a Tooling API connection after connector inputs such as `gradle.properties`, daemon JVM policy, distribution choice, or Gradle user home change.
- Treat Tooling API `BuildAction` classes as serialized code sent into the build; compile them to the lowest Java level supported by the target Gradle range.
- Use `org.gradle.tooling.parallel` when IDE/model-building parallelism needs a different risk profile from task execution parallelism.
- Notify Gradle daemons about files changed by the external tool itself; do not replay changes discovered by another watcher because Gradle already watches the file system.
- Do not depend on IDE-only files for Gradle build correctness.
- Use public models or custom tooling models when external consumers need structured information.
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
- For Ant migration, isolate imported targets, file operations, Ivy dependencies, properties, and custom Ant tasks.
- Do not keep Maven/Ant compatibility layers longer than the migration phase requires.

## Test Reporting Integrations

- Use Gradle's normal `Test` task for JVM test frameworks it can execute directly.
- Use the Test Event Reporting API when a plugin or platform provider needs non-JVM or custom test execution to produce Gradle-compatible test events and HTML reports; treat the API and `TestEventReporterFactory` as incubating and keep wrappers small.
- Inject `TestEventReporterFactory` into the custom task or plugin-owned type that records events; do not synthesize Gradle test result files by hand.
- Put binary test results and HTML report directories under the task's `build/` ownership and model them as outputs when the custom test task should be cacheable or incremental.
- Model the reporting hierarchy deliberately: create root/group reporters, record per-test metadata and failures, and close groups/root with success or failure that matches the executed test system.
- Use try-with-resources or equivalent cleanup for root, group, and per-test reporters so lifecycle events are completed and resources close even when the underlying test engine fails.
- Keep test execution ownership in the custom task; the reporting API records results, it does not replace declaring task inputs, outputs, classpaths, or environment.

## Source Calibration

Primary upstream pages: Gradle and Third-party Tools, Tooling API, IDEA Plugin, Eclipse Plugins, Visual Studio Plugin, Xcode Plugin, Test Event Reporting API, Native Software, Migrating from Maven, Migrating from Ant.
