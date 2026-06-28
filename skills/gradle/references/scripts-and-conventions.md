# Gradle Scripts And Conventions

Read this when: editing `build.gradle(.kts)`, `settings.gradle(.kts)`, convention plugins, or reusable build logic.

## First Choice

- Read [providers-and-properties.md](providers-and-properties.md) for Provider API, managed properties, `ObjectFactory`, domain object containers, and lazy value wiring.
- Read [file-operations-and-archives.md](file-operations-and-archives.md) for file paths, copy/sync/delete tasks, `CopySpec`, archives, permissions, and reproducible archive output.
- Read [jvm-and-tests.md](jvm-and-tests.md) for Java/Kotlin/Groovy/Scala plugins, Java toolchains, JVM tests, fixtures, report aggregation, and source sets.
- Read [dependency-policy.md](dependency-policy.md) for dependency declarations, versions, catalogs, platforms, repositories, locks, or verification.
- Read [task-types-and-validation.md](task-types-and-validation.md) when task logic is more than a tiny script-local action.
- Read [plugins-services-and-diagnostics.md](plugins-services-and-diagnostics.md) when repeated script logic should become a convention or binary plugin.

## Script Ownership

- Settings scripts configure build topology and repository/plugin/catalog policy.
- Root build scripts configure only root-owned behavior and lightweight aggregation.
- Subproject scripts configure project-specific plugins, dependencies, tasks, publications, source sets, and tool configuration.
- Convention plugins encode repeated project policy. Binary plugins encode reusable behavior and richer APIs.
- Precompiled script plugins are internal convention plugins in `buildSrc` or an included `build-logic` build. Their plugin ID is derived from the filename and optional Kotlin package; Groovy precompiled scripts cannot use packages; convert to a binary plugin before publishing.
- Precompiled script plugin suffixes choose the target: `.settings.gradle(.kts)` becomes `Plugin<Settings>`, `.init.gradle(.kts)` becomes `Plugin<Gradle>`, and plain `.gradle(.kts)` becomes `Plugin<Project>`.

## Safe Authoring Defaults

- Match the existing DSL and style.
- For brand-new builds or subprojects without an established repository DSL, prefer Kotlin DSL; otherwise preserve the repository's chosen DSL.
- Prefer `plugins {}` for static plugin application; keep it constrained, idempotent, side-effect-free, and before ordinary script body logic. Put plugin repositories, default plugin versions, and version-loading logic in settings `pluginManagement`, use catalog plugin aliases only where supported, and avoid buildscript classpath plugin wiring unless legacy constraints require it.
- In precompiled script plugins, put external plugin versions on the plugin project's implementation classpath; `version "..."` and `apply false` are not supported inside the precompiled script.
- Use `buildscript {}` only for script classpath resolution. Do not create or resolve arbitrary buildscript configurations in project, settings, init, or standalone scripts.
- Do not rely on plugin application order. If custom plugin logic requires another plugin, apply it explicitly; if integration is optional, react with `pluginManager.withPlugin(...)`, `plugins.withId(...)`, or type-based `plugins.configureEach(...)`.
- Keep top-level build script work small; top-level statements run during configuration.
- Prefer `tasks.register`, `tasks.named`, and `configureEach` over `create`, `getByName`, and broad eager iteration.
- Wire task outputs into inputs/source sets with providers instead of manual `dependsOn`.
- Inside a task registration or configuration action, mutate only that task; configure other tasks through their own providers or actions.
- Use extensions or typed properties for configuration. Use `extra` only for legacy interop or tiny script-local values.
- Read properties through providers when values affect configuration-cache inputs.
- Do not use Gradle or plugin internal APIs; avoid package segments named `internal` and types ending in `Internal` or `Impl` unless you are maintaining that implementation itself.
- Treat only documented public Gradle APIs as stable. Top-level `org.gradle.*` classes being public does not make every `org.gradle.*` subpackage safe.

## Provider-Safe Patterns

- Pass `TaskProvider` objects to `dependsOn`, `builtBy`, and task inputs instead of unwrapping tasks.
- Use `layout.buildDirectory.dir(...)` and `layout.projectDirectory.file(...)` instead of `file("$buildDir/...")`.
- Use task outputs, `CopySpec`, and provider-backed file properties instead of manual filesystem work during configuration.
- Use `providers.gradleProperty`, `providers.systemProperty`, and `providers.environmentVariable` when values affect build configuration.
- Prefer `withType(...).configureEach` for lazy bulk configuration by type; `withType(...) {}`, `tasks.all`, `whenTaskAdded`, and task collection iteration realize tasks.
- Prefer lazy `matching { ... }` or `configureEach` over Groovy `DomainObjectCollection.findAll(Closure)`, which eagerly evaluates containers and is deprecated in Gradle 9.4+.
- Use `named(...)` when configuring a known task or container element.
- Avoid `afterEvaluate`; react to plugins, providers, and domain object collections instead.
- `afterEvaluate` callbacks run by registration order, can see stale state, and defeat task configuration avoidance when they register or configure tasks.
- If `afterEvaluate` appears necessary, limit it to final validation or diagnostics and document why providers, conventions, or `plugins.withId(...)` cannot express the timing.

## DSL Notes

- Kotlin DSL type-safe accessors are computed after the `plugins {}` block and before the script body. Model elements created later in the script need ordinary Gradle APIs.
- Kotlin DSL accessors are unavailable for `apply(plugin = "...")`, `apply(from = "...")` script plugins, binary plugins implemented in Kotlin, initialization scripts, and cross-project plugin application.
- When no Kotlin accessor exists, use standard APIs such as `tasks.named<T>()`, `configurations.named(...)`, `extensions.configure<T>()`, `the<T>()`, and container `named(...)`.
- Use `./gradlew kotlinDslAccessorsReport` to discover generated accessor names and backing types when plugin documentation is unclear.
- Kotlin DSL task and container accessors are lazy providers; keep them as providers unless a provider-aware API is unavailable.
- On Gradle 9+, legacy eager Kotlin DSL configuration artifact accessors and `"name"()` task/domain-object syntax are gone; use `named(...)`, generated provider accessors, or container APIs and unwrap only at execution boundaries.
- On Gradle 9.6+, replace Kotlin DSL delegated properties such as `by registering`, `by existing`, `by project`, `by extra`, and `Property<T>`/`ConfigurableFileCollection` delegates with explicit `register`, `named`, `providers.gradleProperty`, `extra[...]`, `get`, or `set` APIs.
- Lazy property assignment with `=` works for final lazy properties such as `Property<T>` or `ConfigurableFileCollection`; custom setters can block it.
- In settings Kotlin DSL, apply Develocity explicitly with `id("com.gradle.develocity") version "..."`; the old `gradle-enterprise` plugin-block shorthand is gone in Gradle 9.
- Groovy DSL dynamic lookup can hide misspellings and eager task realization. In Groovy blocks, unqualified members resolve against the block delegate; inspect the `Action<T>` or `Closure` delegate type in API docs.
- After Groovy upgrades, especially Gradle 9's Groovy 4 move, qualify ambiguous closure access with `owner`, `this`, `delegate`, or `super` before changing Gradle model logic; `DELEGATE_FIRST` dynamic lookup may pick a different member than before.
- Avoid modeling Gradle DSL Boolean properties as `isX: Boolean`; Groovy 4 no longer treats `Boolean` `is` getters as properties, and Gradle is moving toward that behavior.
- Avoid Groovy metaclass tricks in build scripts; use Gradle extensions, containers, or extra properties for modeled dynamic state.
- Do not translate snippets between DSLs mechanically when provider types, delegated properties, or named containers are involved.
- Keep plugin aliases in `plugins {}` and library aliases in `dependencies {}`.
- When a plugin relies on Groovy metaprogramming, prefer a small applied Groovy script as a compatibility boundary from Kotlin DSL instead of spreading `withGroovyBuilder` calls through the main script.
- Account for Kotlin DSL cold compilation cost on clean checkouts or ephemeral CI; changes in `buildSrc` invalidate build-script caching.

## Property Placement

- Put Gradle runtime flags such as caching, parallelism, JVM args, and warning mode defaults in root or user `gradle.properties`.
- Put project-specific domain settings in typed extensions, not global project properties.
- Keep secrets out of committed properties; read them through providers and CI secret storage.
- Avoid subproject `gradle.properties` for shared policy because it is easy to miss during reviews and migrations.
- Treat `org.gradle.internal.*` as unsupported troubleshooting or Gradle-development state, not project policy.
- Treat `org.gradle.experimental.*` and `org.gradle.unsafe.*` as unstable feature flags that need explicit owner/risk notes before committing.
- For custom build-logic properties, use a project/plugin namespace rather than `org.gradle.*`, and prefer typed extensions when the value configures reusable behavior.

## Escalation

- If a block is repeated across projects, extract a convention plugin.
- If task logic needs services, cacheability, validation annotations, Worker API, or integration tests, create a typed task or plugin.
- If a dependency fix requires forcing, substitution, or metadata mutation, read dependency references before editing declarations.

## Review Checklist

- Does this script execute IO, network, or process work during configuration, or realize tasks unrelated to the requested task?
- Does this script read another project's mutable model or configure plugin-owned model before the plugin is applied?
- Does this script call `.get()` where a provider-aware API exists?
- Does this script duplicate convention logic already present in build logic?
- Does this script hide behavior in `afterEvaluate` or root `subprojects`?

## Source Calibration

Primary upstream pages: Writing Build Scripts, Working with Plugins, Version Catalogs, Gradle Managed Types, Kotlin DSL, Groovy Build Script Primer, Public Gradle APIs, Pre-compiled Script Plugins, Writing Tasks, Properties and Providers, General Gradle Best Practices, Best Practices for Structuring Builds. Local architecture docs: ADR-0010 Gradle properties naming.
