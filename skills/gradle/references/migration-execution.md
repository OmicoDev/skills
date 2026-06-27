# Gradle Migration Execution

Read this when: concrete Gradle upgrade, deprecation cleanup, DSL migration, Maven migration, Ant migration, or legacy Gradle modernization steps are needed.

## Gradle Upgrade Flow

1. Collect `./gradlew --version`, `help --warning-mode=all`, and `buildEnvironment`.
2. Fix local deprecations on the current Gradle version when practical.
3. Upgrade third-party plugins to versions compatible with current and target Gradle.
4. Check runtime JVM, plugin bytecode, Android/Kotlin compatibility, and CI JDK.
5. Upgrade wrapper in the smallest reasonable step.
6. Run representative tasks: tests, publishing dry-runs, Android/native variants, custom plugin TestKit tests, and CI entrypoints.
7. Fix failures by owner and repeat.

## Representative Task Set

- Always include startup (`help`) and at least one real verification task.
- Include custom task/plugin functional tests when build logic changed.
- Include dependency reports when repository, lock, or platform policy changed.
- Include publishing dry-runs when publications or signing changed.
- Include Android/native/frontend variants when those ecosystems are present.
- Include CI entrypoints because local task success can miss CI init scripts, credentials, caches, and JDK differences.

## Deprecation Cleanup

- Treat deprecation warnings as owner evidence.
- Separate Gradle API deprecations from third-party plugin deprecations.
- Prefer Build Scan deprecation views when upload policy permits; otherwise use warning-mode output.
- Do not silence warnings before opening an issue or upgrading the owning plugin.

## Groovy To Kotlin DSL

- Convert one build surface at a time.
- Expect typed accessor differences, provider syntax changes, and dynamic Groovy lookup failures.
- Replace Groovy task-name blocks with `tasks.named` or `tasks.register`.
- Keep semantic changes separate from DSL syntax migration.

## Maven Migration

- Keep the old Maven and new Gradle builds side by side until critical artifacts, reports, published metadata, and deployment inputs compare cleanly.
- Treat `gradle init` Maven conversion as a bootstrap for common JVM, WAR, and Maven Publish shapes; audit custom lifecycle phases and plugins afterward.
- Do not assume Maven assemblies convert automatically. Rebuild them with Distribution/Application, archive tasks, or a purpose-built plugin after comparing produced layout and metadata.
- Map Maven modules to Gradle projects before migrating plugin behavior.
- Translate dependency management to platforms, constraints, catalogs, or BOM import as appropriate.
- Translate profiles into Gradle properties, variants, source sets, or separate tasks only when the behavior is still needed.
- Verify resources, integration tests, publishing metadata, and CI commands.

## Maven Detail Checks

- Map Maven scopes to Gradle buckets deliberately; do not put everything on `implementation`.
- Use `api` only for dependencies exposed to consumers at compile time; otherwise prefer `implementation`.
- Translate Maven parent dependency management separately from module layout.
- Replace Maven parent build logic with convention plugins or shared platforms, not broad `allprojects` mutation.
- Account for conflict-resolution semantics: Maven's nearest-wins graph can differ from Gradle's newest-wins default, so compare selected dependency versions before treating runtime changes as source problems.
- Recreate resource filtering only where the application requires it.
- Replace Maven lifecycle assumptions with explicit Gradle lifecycle tasks.
- Use `publishToMavenLocal` only for Maven interop; prefer project dependencies or composite builds inside Gradle.
- Convert parameter-only Maven mojos into typed Gradle tasks; rewrite mojos that depend on the Maven project object around Gradle's model instead of transcribing the code.
- Validate generated `pom` conversion before deleting the Maven build.

## Ant Migration

- Treat `ant.importBuild()` and AntBuilder calls as migration bridges; imported Ant builds are not configuration-cache compatible.
- Use imported Ant targets as a bridge, not the final architecture.
- Move file work to Gradle task types and providers.
- Translate Ivy/file dependencies into repositories and dependency declarations.
- Replace custom Ant tasks with typed Gradle tasks when behavior becomes permanent.

## Ant Detail Checks

- Keep Ant properties and Gradle properties separate until ownership is clear.
- Bridge Gradle project properties into Ant properties explicitly when imported targets need them; they are not the same property map.
- Replace path-sensitive Ant file operations with Gradle file properties.
- Translate Ant paths and filesets to `FileCollection` and `FileTree` before adding more Ant-only glue.
- Move Ivy repositories and configurations into Gradle dependency management.
- Do not mimic Ivy retrieve by copying every resolved dependency from Gradle's cache unless a package or external tool truly needs materialized libraries; otherwise consume resolved files directly through configurations.
- Preserve target order only when Gradle task inputs/outputs cannot express the relationship yet.
- Rename imported targets on collision and replace dependencies in stages so standard Gradle lifecycle tasks can take over.

## Legacy Gradle Modernization

- Replace `compile`/`runtime` era configurations with modern buckets.
- Replace eager task APIs with registration and configuration avoidance.
- Remove broad `allprojects`/`subprojects` mutation in favor of convention plugins.
- Move configuration-time IO/process work into tasks or provider/value-source APIs.
- Move subproject `gradle.properties` policy to root properties or convention plugins.
- Check Isolated Projects only after configuration-cache and cross-project coupling issues are understood.

## Source Calibration

Primary upstream pages: Upgrading Gradle, Feature Lifecycle, Kotlin DSL Migration, Migrating from Maven, Migrating from Ant, Using Ant from Gradle, Task Configuration Avoidance.
