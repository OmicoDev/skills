# Gradle Model Boundaries

Read this when: the owner surface, lifecycle phase, or Gradle model boundary is unclear.

## Route

- Read [best-practice-audits.md](best-practice-audits.md) when the task asks for a broad Gradle best-practice audit, official best-practice coverage, or every-practice review.
- Read [commands-and-evidence.md](commands-and-evidence.md) when the first job is choosing commands, flags, logs, or evidence.
- Read [wrapper-and-distributions.md](wrapper-and-distributions.md) when wrapper files, wrapper generation or upgrades, distribution download, checksum, retry, or installation owns the change.
- Read [runtime-and-structure.md](runtime-and-structure.md) when the Gradle client or daemon, daemon JVM selection, Gradle user home, VFS/file watching, or init scripts own the change.
- Read [project-topology-and-build-logic.md](project-topology-and-build-logic.md) when settings scripts, project inclusion, included builds, build logic placement, or directory layout owns the change.
- Read [scripts-and-conventions.md](scripts-and-conventions.md) when changing build scripts or reusable conventions.
- Read [dependency-policy.md](dependency-policy.md) when configurations, repositories, variants, locks, verification, or selected versions are involved.
- Read [plugins-services-and-diagnostics.md](plugins-services-and-diagnostics.md) when plugin shape, shared services, lifecycle-result work, structured diagnostics, or TestKit coverage owns the change.
- Read [performance-strategy.md](performance-strategy.md) when configuration time, task avoidance, cache reuse, or incremental behavior is involved.

## Model Boundaries

- Initialization reads settings and discovers builds, projects, plugin management, dependency repository policy, version catalogs, and included builds.
- Configuration creates and configures project models and task graphs for the requested entrypoints.
- Execution runs selected tasks and should do the actual filesystem, network, process, and compiler work.
- Do not use task execution, task graph callbacks, or resolved dependency/artifact files to decide project topology, plugin application, or shared conventions; those decisions belong before the graph is calculated, usually in settings, plugins, or lazy task/configuration wiring.
- Gradle state is scoped as process, session, build tree, build, then project. A value tied to one scope should not be cached or mutated as if it lived in another.
- Settings scripts own topology. Project scripts own project plugins, dependencies, tasks, extensions, and outgoing publications.
- Providers are lazy value recipes. Keep values as providers until a Gradle-owned consumer or task action needs them.
- Provider laziness is still a model boundary: calling `get()`, querying presence to branch, resolving a configuration, or using eager task collection APIs during configuration realizes values early and can change graph shape, cache inputs, or dependency resolution timing.
- Configurations are dependency buckets with declarable, resolvable, or consumable roles. Do not use one role to fake another.
- Components expose variants. Variants carry attributes, capabilities, artifacts, dependencies, and metadata.
- The wrapper selects Gradle. The Gradle runtime JVM runs Gradle. Java toolchains select JVMs for compile, test, javadoc, and custom Java tool tasks.
- Init scripts and init plugins run before repository build logic and can affect every build attached to that Gradle user home or CI image.
- Flow actions and build services model lifecycle-adjacent work. Ordinary tasks still own source, output, process, and filesystem work.
- Isolated Projects forbids cross-project mutable model access during configuration. Read immutable project identity sparingly; move shared policy to convention plugins, variants, or state-isolating lifecycle callbacks. Route migration details to [isolated-projects.md](isolated-projects.md).
- Register `gradle.lifecycle.beforeProject/afterProject` from the owning build before projects are loaded; late registration after settings evaluation fails instead of attaching to already-loaded projects. Its isolated actions are configuration-cache-serialized per target and cannot share mutable state or make an included build's build logic access another build's Gradle model.
- Treat legacy `gradle.rootProject {}` and `allprojects {}` hooks as cross-project mutable configuration, not delayed execution: actions registered before projects load are queued for project loading, while later registrations run immediately against mutable project state and still need an eager, non-isolated owner.

## State Scope

- Process state is daemon-wide and normally tied to one Gradle user home. Do not treat it as checked-in project state.
- Session state belongs to one invocation, including continuous build sessions that may run the build more than once.
- Build tree state belongs to one execution of one build definition, including included builds.
- Build state belongs to one root or included build inside the build tree.
- Project state belongs to one project inside one build execution. Cross-project reads must be immutable identity reads or modeled through dependencies, variants, publications, or convention plugins.
- Same-build project-state coordination does not generalize to included builds; pass build-tree identity or modeled artifacts across composite boundaries instead of retaining `Project` objects or mutable model-derived state.
- Project paths such as `:lib` are build-local; build-tree identity paths are the global identity across included builds. In composite-build triage, keep the owning build identity attached to project paths before diagnosing task selection, dependency substitution, or cross-build model access.
- When Gradle exposes both `path` and `buildTreePath`, use `buildTreePath` or identity path for tooling, composite, and external references; use `path`, `project(...)`, or relative project names only for lookup inside the owning build.

## Ownership Questions

- Does the value decide which projects exist? Settings owns it.
- Does the value decide how one project builds? That project or convention plugin owns it.
- Does the value decide what files a task reads or writes? The task owns it.
- Does the value decide which dependency files are selected? Dependency resolution owns it.
- Does the value decide which JVM runs Gradle? Wrapper/runtime owns it.
- Does the value decide which JVM compiles or tests code? Toolchains own it.
- Does the value cross project boundaries? Prefer variants, publications, convention plugins, or `project.isolated` identity access over direct project model reads.
- Does the value cross included-build boundaries? Treat each included build as its own build owner; share through plugin management, external coordinates, substitutions, environment, or explicitly duplicated settings.

## Smell Routing

- Work happens during configuration: route to [performance-strategy.md](performance-strategy.md), [configuration-cache.md](configuration-cache.md), or [task-types-and-validation.md](task-types-and-validation.md).
- Root script mutates all projects: route to [project-topology-and-build-logic.md](project-topology-and-build-logic.md) and build logic organization.
- CI or a developer machine behaves differently with the same repository files: route to [runtime-and-structure.md](runtime-and-structure.md) and inspect init scripts, Gradle user home, and CI-injected options.
- Isolated Projects violation: read [isolated-projects.md](isolated-projects.md) and identify whether it is project-to-project, project-to-build, cross-build, or build-to-project callback access before replacing APIs.
- Dependency version changed in the wrong place: route to [dependency-policy.md](dependency-policy.md).
- Task ordering was added to paper over missing outputs: route to [task-types-and-validation.md](task-types-and-validation.md).
- Runtime JDK and compile target are confused: route to [jvm-and-tests.md](jvm-and-tests.md).

## Review Heuristics

- Every cross-project convention should have an obvious plugin owner.
- Every generated file should have a producing task and consuming provider.
- Every external process should be inside a task, worker, or value source.
- Every daemon, worker, client, or Tooling API concern should name which runtime owns the failure.
- Every dependency policy should state its owner layer.
- Every performance change should name configuration, execution, dependency resolution, or output reuse as the target.
