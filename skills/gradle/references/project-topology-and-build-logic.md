# Gradle Project Topology And Build Logic

Read this when: settings scripts, project inclusion, multi-project builds, composite builds, build logic placement, root layout, or `init` scaffolding owns the work.

## Scope Boundary

- This file owns checked-in project topology, project paths, included builds, build logic location, and source/layout conventions.
- Use [runtime-and-structure.md](runtime-and-structure.md) when the issue is wrapper files, the Gradle runtime JVM, daemon selection, Gradle user home, or init scripts.
- Use [scripts-and-conventions.md](scripts-and-conventions.md) once the topology is clear and the work is ordinary build script or convention plugin editing.
- Use [dependency-artifact-selection.md](dependency-artifact-selection.md) when a project-to-project problem is specifically about sharing custom artifacts.

## Owner Selection

- `settings.gradle(.kts)` owns `rootProject.name`, included projects, included builds, `pluginManagement`, dependency repository policy, and catalogs.
- Project build scripts own plugins, dependencies, source sets, tasks, publications, and extension configuration for that project.
- Root project scripts should stay lightweight unless the root intentionally builds software or aggregates; declare shared plugin versions there, but apply source-affecting plugins only to projects that contain source.
- Reusable conventions belong in precompiled or binary convention plugins, preferably from an included `build-logic` build; use `buildSrc` only when its automatic buildscript classpath is an intentional tradeoff.
- Generated files, `.gradle/`, and `build/` are not source structure unless modeled as task inputs or outputs.

## Multi-Project Topology

- Use `include(...)` for subprojects in one build rooted by a single settings file. Project paths map to directories relative to the root project unless project descriptors override project name, `projectDir`, or `buildFileName`.
- Nested project paths create intermediate projects. If directory nesting is only organizational, include a flat logical project name and set `projectDir` with a project descriptor.
- Name the root project in settings so IDE imports, dependency substitution, and diagnostics do not depend on the checkout directory name; keep logical project names aligned with physical locations enough that `projects` output explains the repository layout.
- Compare project identity with `path` or `buildTreePath`, not reference identity; Gradle 9.3+ may expose different `Project` instances for the same logical project.
- Check `./gradlew -q projects` before renaming projects, changing directories, or updating CI task paths.
- Avoid accidentally empty projects: starting with Gradle 9, included project directories must exist and be writable unless the settings script deliberately creates or remaps them.
- Do not include directories as Gradle projects only for visual grouping; empty/grouping projects add configuration and task-path surface without owning source, variants, or lifecycle aggregation.
- Split monoliths by natural code boundaries early, such as API/implementation seams, feature slices, source-generation inputs and consumers, or independently changing dependency sets; avoid arbitrary tiny projects that add configuration and classpath overhead without isolating meaningful work.
- Prefer project dependencies for subprojects in the same build. Do not reach across projects through task paths or files when variants can express the relationship.
- Keep repository and catalog policy in settings when the policy is meant to apply consistently across projects.

## Composite Builds

- Use `includeBuild(...)` when separate builds should be composed together, such as local module replacement or a dedicated build-logic build.
- The `includeBuild(...)` path should point at the included build root that contains its settings file. Relative paths resolve from the including settings directory; avoid absolute paths in checked-in topology.
- Included builds are not subprojects. Do not use `project(":included-build:module")`; depend on their external coordinates and let composite substitution replace them.
- Included-build tasks can be invoked by fully qualified path or wired with `gradle.includedBuild("name").task(":path")`; use this for orchestration, not as a substitute for project dependencies.
- Included builds do not share repositories, plugin management, version catalogs, `buildSrc`, or user-defined root `gradle.properties`; runtime Gradle properties from the root invocation still apply.
- Include plugin-providing builds in settings so `plugins {}` resolution can see them; do not rely on `--include-build` for modern plugin blocks. For settings plugins, prefer a separate minimal included build inside `pluginManagement { includeBuild(...) }` instead of pulling general `build-logic` into early settings resolution.
- Default composite substitution uses project `group` and `name`. Declare substitutions explicitly when publication coordinates, artifact names, variants, or default configurations differ.
- For local forks, keep the consumer dependency declared with the original external coordinates and include the fork with `includeBuild(...)`; if Gradle still resolves externally, check the fork's `group`, project name, version, and settings inclusion before editing repositories.
- The main build is not auto-substituted by coordinates; use `includeBuild(".")` only when the main build's projects should also be addressable as composite substitutes.
- Composite substitutions are not transitive across builds. Align `group` and `rootProject.name` or duplicate explicit substitutions where each build needs them.
- Default substitutions require Gradle to inspect included builds for provided coordinates and can fully configure them; explicit substitutions can reduce configuration cost when only a subset is needed.
- Disable global substitution rules on a resolvable configuration only when the build must compare or consume the published module instead of the included build.
- A substituted project dependency points at the target project's default configuration; composites can diverge from published behavior when publication metadata has custom variants, capabilities, or POM/Ivy tweaks.
- Composite build paths must be unique across the flattened build tree. Rename included build paths in settings when directory names collide with existing project paths.

## Build Logic Placement

- Keep one-off project behavior in the project build script; move repeated convention blocks to precompiled script plugins or binary plugins.
- Prefer an included `build-logic` build for convention plugins and custom plugin code; it behaves like an external dependency, can be built independently, and narrows invalidation compared with `buildSrc`.
- Split `build-logic` into subprojects when consumers can depend on fewer convention artifacts, but avoid many plugin-combination classpaths that make behavior, performance, or build-service wiring harder to reason about.
- Use `buildSrc` for rapid prototyping or tiny single-root reuse when automatic classpath inclusion is worth whole-build invalidation; only one root `buildSrc` is allowed, and it has its own build/catalog/repository setup.
- Treat a root `buildSrc` directory as active only when it contains a valid settings/build script or non-empty `src` tree; empty or arbitrary `buildSrc` directories are ignored, but `buildSrc` remains a reserved project/build name and must not be included or renamed as ordinary topology.
- `buildSrc` classes and precompiled script plugins are automatically on build-script classpaths, but components produced by `buildSrc` are not composite substitutes for the main or included builds; use explicit included builds and dependency substitution when build logic or application code must consume local modules by coordinates.
- Avoid `allprojects` and `subprojects` mutation for cross-project conventions. Apply convention plugins explicitly to participating projects.
- Do not model subproject-specific build behavior with subproject `gradle.properties`; use typed extensions configured in the subproject script, and move repeated defaults into a convention plugin with root/user properties only as inputs.
- For aggregation, consume variants or reports rather than reading mutable subproject state.
- Avoid init scripts for project behavior; they are user or environment policy.

## Layout Rules

- Keep source files out of the root project unless the root intentionally builds software.
- Prefer standard plugin conventions such as `src/main/java` and `src/test/java`.
- Separate language source directories when multiple JVM languages are compiled.
- Separate unit, integration, functional, and smoke test sources when they have different dependencies or execution policy.
- Use `layout.projectDirectory`, `layout.settingsDirectory`, task/file providers, and [file-operations-and-archives.md](file-operations-and-archives.md) rules instead of hard-coded paths or manual filesystem loops.
- Keep generated sources under `build/` and wire them through source sets or task outputs.

## Build Init

- Use `./gradlew init` or `gradle init` only for new scaffolds or deliberate conversion work; treat it as a mutating scaffold/conversion command, not an inspection command.
- In non-interactive environments, inspect `gradle help --task init` and pass explicit `--type`, `--dsl`, `--project-name`, `--package`, `--java-version`, `--use-defaults`, and `--overwrite` choices as needed.
- The `init` task is available at the root without applying the plugin or creating a stub build script. If `pom.xml` is present and `--type` is omitted, Gradle can infer Maven conversion; pass `--type` explicitly when conversion is not intended.
- Use `--into` and `--project-name` deliberately because output directory and root project identity become checked-in topology. Treat `--overwrite` as destructive until generated changes are reviewed.
- Review generated settings, wrapper, build scripts, source layout, catalogs, lifecycle mapping, profiles, resources, dependencies, publishing, and insecure repository handling before keeping conversion output.
- Maven conversion maps Maven `compile` scope to Gradle `api` to preserve exposed dependencies; after conversion, move implementation-only dependencies to `implementation` deliberately.
- All build-init types set up the wrapper; review wrapper files with [runtime-and-structure.md](runtime-and-structure.md) before accepting scaffold output.
- When converting one project into many, create a non-source root if needed, move the original source-owning build script and source directories into an app/domain subproject, keep one root `settings.gradle(.kts)`, and keep shared logic in convention plugins instead of root `subprojects` mutation.

## Structural Review

- Check whether CI calls root tasks, project tasks, or included-build tasks, and whether IDE import expects stable project names.
- Check whether convention plugins are applied explicitly by each project and repository/catalog policy lives in settings.
- Check whether generated source directories are owned by tasks and composite substitutions mirror published metadata closely enough for the workflow being tested.

## Failure Map

- Task path changed unexpectedly: run `projects`, compare root/project names, and update CI or IDE assumptions.
- Dependency from an included build did not substitute: compare requested coordinates with included project `group` and `name`, then inspect explicit substitutions.
- Main-build project did not substitute by coordinates: decide whether self-including the main build is intentional.
- Included build behaves differently from published module: compare default configuration with publication metadata, variants, artifacts, and capabilities.
- Composite invocation deadlocks or conflicts: check whether parallel Gradle invocations include the same build instead of sharing one build tree.
- Build logic change invalidates every configuration: evaluate whether `buildSrc` should move to an included `build-logic` build.
- Cross-project convention is invisible in a subproject: replace `allprojects` or `subprojects` mutation with an applied convention plugin.
