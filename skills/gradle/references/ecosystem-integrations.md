# Gradle Ecosystem Integrations

Read this when: Gradle coordinates Android, native builds, frontend tools, IDE import, Tooling API, Maven/Ant, test reporting, or external processes.

## General Rule

Gradle should model external tools as tasks with declared inputs, outputs, tool versions, environment assumptions, and ownership boundaries. Do not run external tools during configuration.

## Android

- Read [compatibility-matrix.md](compatibility-matrix.md) before changing Gradle, AGP, Android Studio, Kotlin, or JDK versions in the same flow.
- Android Gradle Plugin owns Android variants, Android source sets, generated code integration, packaging, and many task names.
- Keep Gradle, AGP, Kotlin, JDK, and Android Studio compatibility together.
- Use AGP APIs rather than reaching into generated task names when possible.
- Separate Kotlin Android, KAPT/KSP, Compose, and Java toolchain issues before patching Gradle core logic.

## Android Diagnostics

- Check AGP version before applying generic Gradle variant advice.
- Prefer Android Components APIs for generated sources and variant wiring.
- Treat KAPT, KSP, Compose compiler, and Kotlin JVM target as separate owners.
- Keep Android Studio sync behavior separate from command-line task execution.
- Avoid configuring generated AGP tasks by name unless no public API exists.

## Native

- Native plugins own components, binaries, target machines, build types, toolchains, Xcode/Visual Studio integration, and native test tasks.
- Identify whether Gradle owns native compilation or delegates to an external native build.
- Keep compiler/linker flags and target machines in the native model rather than shell scripts.

## Native Diagnostics

- Check components, binaries, target machines, and toolchains before task wiring.
- Separate compile/link failures from Gradle model failures.
- Keep generated headers, resources, and native outputs modeled as task outputs.
- Avoid hard-coded compiler locations when Gradle toolchain modeling fits.

## Frontend And External Tools

- Model Node/npm/pnpm/yarn/Vite/Webpack commands as tasks.
- Track package manager lockfiles, package manifests, tool versions, environment variables, and output directories.
- Wire frontend build outputs into JVM/native packaging with providers.
- Avoid package installs during Gradle configuration.

## External Process Modeling

- Inputs should include executable version, lockfiles, config files, sources, and relevant environment.
- Outputs should live under `build/` unless another tool requires a different workspace.
- Use `ExecOperations`, `JavaExec`, or typed task wrappers instead of ad hoc shell strings.
- Make networked install/update steps explicit tasks, not hidden configuration work.

## IDE And Tooling API

- IDE import/sync consumes Gradle models; task execution behavior may differ from sync behavior.
- Tools that use Gradle should usually be modeled by plugins and tasks; tools that execute Gradle should usually use the Tooling API.
- Tooling API clients are wrapper-aware, daemon-backed external clients with their own JVM and compatibility surface.
- Do not depend on IDE-only files for Gradle build correctness.
- Use public models or custom tooling models when external consumers need structured information.
- Custom tooling models belong in plugins and should be versioned like public integration contracts.
- IDE metadata plugins are integration aids, not the source of build truth.
- When IDE sync fails but CLI works, inspect import-specific models, JVMs, and Tooling API client behavior.

## Maven And Ant

- For Maven migration, map lifecycle, modules, dependency management, profiles, resources, plugins, and publishing separately.
- For Ant migration, isolate imported targets, file operations, Ivy dependencies, properties, and custom Ant tasks.
- Do not keep Maven/Ant compatibility layers longer than the migration phase requires.

## Test Reporting Integrations

- Use Gradle's normal `Test` task for JVM test frameworks it can execute directly.
- Use the Test Event Reporting API when a plugin or platform provider needs non-JVM or custom test execution to produce Gradle-compatible test events and HTML reports.
- Keep test execution ownership in the custom task; the reporting API records results, it does not replace declaring task inputs, outputs, classpaths, or environment.

## Source Calibration

Primary upstream pages: Gradle and Third-party Tools, Tooling API, Test Event Reporting API, Native Software, Migrating from Maven, Migrating from Ant.
