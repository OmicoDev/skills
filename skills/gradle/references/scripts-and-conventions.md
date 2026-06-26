# Gradle Scripts And Conventions

Read this when: editing `build.gradle(.kts)`, `settings.gradle(.kts)`, convention plugins, or reusable build logic.

## First Choice

- Read [providers-and-properties.md](providers-and-properties.md) for Provider API, managed properties, `ObjectFactory`, domain object containers, and lazy value wiring.
- Read [jvm-and-tests.md](jvm-and-tests.md) for Java/Kotlin/Groovy/Scala plugins, Java toolchains, JVM tests, fixtures, report aggregation, and source sets.
- Read [dependency-policy.md](dependency-policy.md) for dependency declarations, versions, catalogs, platforms, repositories, locks, or verification.
- Read [task-types-and-validation.md](task-types-and-validation.md) when task logic is more than a tiny script-local action.
- Read [plugins-services-and-diagnostics.md](plugins-services-and-diagnostics.md) when repeated script logic should become a convention or binary plugin.

## Script Ownership

- Settings scripts configure build topology and repository/plugin/catalog policy.
- Root build scripts configure only root-owned behavior and lightweight aggregation.
- Subproject scripts configure project-specific plugins, dependencies, tasks, publications, source sets, and tool configuration.
- Convention plugins encode repeated project policy. Binary plugins encode reusable behavior and richer APIs.

## Safe Authoring Defaults

- Match the existing DSL and style.
- Prefer `plugins {}` for static plugin application and `plugins.withId(...)` to react to plugin-owned models.
- Keep top-level build script work small; top-level statements run during configuration.
- Prefer `tasks.register`, `tasks.named`, and `configureEach` over `create`, `getByName`, and broad eager iteration.
- Wire task outputs into inputs/source sets with providers instead of manual `dependsOn`.
- Use extensions or typed properties for configuration. Use `extra` only for legacy interop or tiny script-local values.
- Read properties through providers when values affect configuration-cache inputs.

## Provider-Safe Patterns

- Pass `TaskProvider` objects to `dependsOn`, `builtBy`, and task inputs instead of unwrapping tasks.
- Use `layout.buildDirectory.dir(...)` and `layout.projectDirectory.file(...)` instead of `file("$buildDir/...")`.
- Use `providers.gradleProperty`, `providers.systemProperty`, and `providers.environmentVariable` when values affect build configuration.
- Prefer `configureEach` for lazy bulk configuration by type.
- Use `named(...)` when configuring a known task or container element.
- Avoid `afterEvaluate`; react to plugins, providers, and domain object collections instead.
- If `afterEvaluate` appears necessary, limit it to final validation or diagnostics and document why providers, conventions, or `plugins.withId(...)` cannot express the timing.

## DSL Notes

- Kotlin DSL gives static accessors after plugins and extensions are known; script plugins and dynamic additions can limit accessors.
- Groovy DSL dynamic lookup can hide misspellings and eager task realization.
- Do not translate snippets between DSLs mechanically when provider types, delegated properties, or named containers are involved.
- Keep plugin aliases in `plugins {}` and library aliases in `dependencies {}`.

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

- Does this script execute IO, network, or process work during configuration?
- Does this script realize tasks unrelated to the requested task?
- Does this script read another project's mutable model?
- Does this script call `.get()` where a provider-aware API exists?
- Does this script configure plugin-owned model before the plugin is applied?
- Does this script duplicate convention logic already present in build logic?
- Does this script hide behavior in `afterEvaluate` or root `subprojects`?

## Source Calibration

Primary upstream pages: Writing Build Scripts, Gradle Managed Types, Kotlin DSL, Groovy Build Script Primer, Writing Tasks, Properties and Providers. Local architecture docs: ADR-0010 Gradle properties naming.
