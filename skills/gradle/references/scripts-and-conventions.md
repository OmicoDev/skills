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
- Root build scripts configure only root-owned behavior and lightweight aggregation; subproject scripts configure project-specific plugins, dependencies, tasks, publications, source sets, and tool configuration.
- Convention plugins encode repeated project policy; binary plugins encode reusable behavior and richer APIs.
- Precompiled script plugins are internal convention plugins in `buildSrc` or an included `build-logic` build. Their plugin ID is derived from the filename and optional Kotlin package; Groovy precompiled scripts cannot use packages; convert to a binary plugin before publishing.
- Use suffixes to signal script target: `.settings.gradle(.kts)` backs `Settings`, `.init.gradle(.kts)` backs `Gradle` for precompiled script plugins, and plain `.gradle(.kts)` backs `Project`; discovered init scripts are conventionally named `init.gradle(.kts)`.

## Safe Authoring Defaults

- Match the existing DSL and style; for brand-new builds or subprojects without an established repository DSL, prefer Kotlin DSL.
- Prefer `plugins {}` for static plugin application; keep it constrained, idempotent, side-effect-free, and before ordinary script body logic. Put plugin repositories, default plugin versions, and version-loading logic in settings `pluginManagement`, use catalog plugin aliases only where supported, and avoid buildscript classpath plugin wiring unless legacy constraints require it.
- In settings scripts, keep `pluginManagement {}` before plugin requests and ordinary statements; in init scripts, keep `initscript {}` before ordinary script body when it declares the init script classpath.
- In precompiled script plugins, put external plugin versions on the plugin project's implementation classpath; avoid `version "..."` and `apply false` inside the script `plugins {}` block, and expect precompiled settings plugin requests to be resolved during compilation even when the plugin is not applied by a consuming build.
- Use `buildscript {}` only for script classpath resolution. Do not create or resolve arbitrary buildscript configurations in project, settings, init, or standalone scripts.
- Do not rely on plugin application order. If custom plugin logic requires another plugin, apply it explicitly; if integration is optional, react with `pluginManager.withPlugin(...)`, `plugins.withId(...)`, or type-based `plugins.configureEach(...)`.
- Keep top-level build script work small; top-level statements run during configuration.
- Keep build scripts declarative: tasks and plugins should own IO, process execution, network calls, timestamps/randomness, and generated files; use Gradle logging for reusable diagnostics instead of leaving `println` debugging in shared scripts.
- Prefer `tasks.register`, `tasks.named`, and `configureEach` over `create`, `getByName`, and broad eager iteration.
- Wire task outputs into inputs/source sets with providers instead of manual `dependsOn`.
- Because task configuration actions may run immediately, later, or never, mutate only that task inside its action; configure relationships or other tasks through their own providers/actions.
- Use extensions or typed properties for configuration. Use `extra` only for legacy interop or tiny script-local values.
- Read properties through providers when values affect configuration-cache inputs.
- Do not use Gradle or plugin internal APIs; avoid package segments named `internal` and types ending in `Internal` or `Impl` unless you are maintaining that implementation itself.
- Treat only documented public Gradle APIs as stable. Top-level `org.gradle.*` classes being public does not make every `org.gradle.*` subpackage safe.

## Provider-Safe Patterns

- Pass `TaskProvider` objects to `dependsOn`, `builtBy`, and task inputs instead of unwrapping tasks.
- Use `layout.buildDirectory.dir(...)` and `layout.projectDirectory.file(...)` instead of `file("$buildDir/...")`.
- Use task outputs, `CopySpec`, and provider-backed file properties instead of manual filesystem work during configuration.
- Use `providers.gradleProperty`, `providers.systemProperty`, and `providers.environmentVariable` when values affect build configuration; prefer `withType(...).configureEach` for lazy bulk configuration by type and `named(...)` for known task or container names.
- For Gradle 9.6+ `getProperties()` deprecations, replace `project.properties`, script `properties`, and filtered bulk maps with targeted provider reads, `providers.gradlePropertiesPrefixedBy(...)` for deliberate namespaces, or explicit maps for the exact keys being forwarded.
- When filtering Gradle domain-object collections, prefer `withType(...).matching { ... }.configureEach`; do not use deprecated `DomainObjectCollection.findAll(Closure)` because it eagerly snapshots instead of returning a live filtered collection, and still avoid broad `matching`, `tasks.all`, `whenTaskAdded`, and collection iteration.
- Avoid `afterEvaluate`; react to plugins, providers, and domain object collections instead. If it appears necessary, limit it to final validation or diagnostics and document why providers, conventions, or plugin-application callbacks cannot express the timing.
- `afterEvaluate` callbacks run by registration order, can see stale or default extension values, defeat task configuration avoidance when they touch tasks, and are configuration-cache hostile when they capture mutable project state.
- Assume only a last or single `afterEvaluate` callback sees final state; treat missing lazy hooks as a Gradle API gap before making `afterEvaluate` design policy.
- Do not rely on parent-project property/method lookup through Groovy bare names, `property`, `getProperty`, `findProperty`, or `hasProperty`; migrate to `providers.gradleProperty`, local `extra[...]`, convention plugins, modeled dependencies, or explicit transitional `rootProject`/`parent` references, then enable `NO_IMPLICIT_LOOKUP_IN_PARENT_PROJECTS` to verify Gradle 10 behavior.

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
- On Gradle 9.6+ or Isolated Projects, use Develocity plugin 4.0+; older Develocity plugins rely on implicit parent-project lookup, so upgrade the plugin instead of preserving the old lookup path in build scripts.
- Groovy DSL dynamic lookup can hide misspellings and eager task realization. In Groovy blocks, unqualified members resolve against the block delegate; inspect the `Action<T>` or `Closure` delegate type in API docs.
- After Groovy upgrades, especially Gradle 9's Groovy 4 move, qualify ambiguous closure access with `owner`, `this`, `delegate`, or `super` before changing Gradle model logic; `DELEGATE_FIRST` dynamic lookup may pick a different member than before.
- Avoid modeling Gradle DSL Boolean properties as `isX: Boolean`; Groovy 4 no longer treats `Boolean` `is` getters as properties, and Gradle is moving toward that behavior.
- Avoid Groovy metaclass tricks in build scripts; use Gradle extensions, containers, or extra properties for modeled dynamic state.
- Do not translate snippets between DSLs mechanically when provider types, delegated properties, or named containers are involved.
- Keep plugin aliases in `plugins {}` and library aliases in `dependencies {}`.
- When a plugin relies on Groovy metaprogramming, prefer a small applied Groovy script as a compatibility boundary from Kotlin DSL instead of spreading `withGroovyBuilder` calls through the main script.
- Account for Kotlin DSL cold compilation cost on clean checkouts or ephemeral CI; changes in `buildSrc` invalidate build-script caching.

## Property Placement

- Put shared Gradle runtime flags such as caching, parallelism, JVM args, file encoding, and warning mode in root or user `gradle.properties`; trial with CLI flags first and avoid committing explicit Gradle defaults as policy.
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
