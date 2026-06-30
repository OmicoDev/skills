# Gradle Isolated Projects

Read this when: Isolated Projects adoption, cross-project mutable access, parallel project configuration, IDE sync model caching, or isolation violations owns the work.

## Model

- Isolated Projects is experimental; APIs, behavior, and IDE/tooling support can change between Gradle releases.
- The feature isolates project configuration so one project cannot observe or mutate another project's mutable state.
- It builds on Configuration Cache infrastructure and enables safe parallel project configuration; tooling model caching is local and version/status sensitive.
- Do not equate Isolated Projects enablement with IDE model cache reuse. Tooling model caching is status-gated and has been disabled in some Gradle 9.x lines for correctness.
- It targets configuration and model-building performance, especially large multi-project builds and IDE sync. It does not speed up task execution directly.
- If Configuration Cache hits, initialization and configuration are skipped; Isolated Projects only matters when configuration or model building runs.
- Enabling Isolated Projects also enables Configuration Cache. It is an error to enable Isolated Projects while explicitly disabling Configuration Cache.

## Performance Boundaries

- For task runs, project configuration can run in parallel, but current work graph discovery is still sequential and all projects are still configured.
- Initialization remains sequential: init scripts and settings evaluation are not made parallel by Isolated Projects, so startup/settings slowness needs runtime or topology fixes instead of project-isolation fixes.
- Large unqualified aggregate invocations such as root `check` can still bottleneck in sequential work graph discovery; narrow requested tasks or aggregation design may matter more than isolation after configuration is fixed.
- For IDE sync or Tooling API model building, expect parallel project configuration benefits first; check current Gradle status before assuming full-model cache hits.
- The IDE or Tooling API client controls whether model builders run in parallel. Isolated Projects makes Gradle-side parallel model building safe, but the consuming tool may still need its own setting or support.
- If an IDE already fetches models in parallel, do not promise an extra sync speedup from that phase; Isolated Projects still validates the build logic and enables safe parallel model building where the tool supports it.
- Parallel model fetching can be allowed without Isolated Projects through Tooling API or parallel properties, but it lacks isolation validation and can expose flaky configuration logic; prefer Isolated-Projects-backed IDE parallelism.
- `org.gradle.workers.max` limits Isolated Projects configuration parallelism because it limits parallel work across Gradle phases.
- Parent projects still gate subproject configuration, and parallel project configuration can increase memory pressure; profile root/parent configuration and heap before blaming task execution.
- When tooling model caching is available, it is local only; do not expect remote cache reuse across checkouts.
- Changes to included builds can invalidate cached results broadly.
- Parallel execution (`--parallel`) and Configuration on Demand are ignored when Isolated Projects is enabled.

## Constraint Owners

- Cross-project access: project configuration logic must not read or mutate another project's mutable state.
- Project-to-build access: project logic touching build-scoped mutable state is risky and not fully enforced yet.
- Cross-build access: build logic should avoid `gradle.parent` and mutable state from other included builds.
- Build-to-project callback access: settings/init callbacks that later configure projects must avoid shared mutable captured state.
- Treat ordinary `Gradle` callback registration from project configuration as project-to-build access: after settings evaluation some registrations are no-ops or errors, and successful callbacks can run in different orders under parallel project configuration.
- Treat "not fully enforced yet" constraints as design constraints anyway; absence of an Isolated Projects violation is not proof that shared mutable build or included-build state is safe.
- Most `Project` methods and containers are mutable state, including `tasks`, `dependencies`, `configurations`, `repositories`, `extensions`, `plugins`, `layout`, `providers`, and `objects`.
- Treat `Project.getProperties()` and implicit parent project property/method lookup as incompatible migration signals.
- Treat `Project.findProperty()` with extra suspicion during migration because lenient parent lookup changes can return a different value without failing.
- Immutable project identity such as `name`, `path`, `projectDir`, `buildFile`, `rootDir`, and hierarchy navigation is allowed, but should still be minimized.
- `group`, `version`, `buildDir`, and `layout` are mutable and are not safe cross-project identity data.

## Migration Commands

```bash
./gradlew help -Dorg.gradle.unsafe.isolated-projects=true -Dorg.gradle.unsafe.isolated-projects.diagnostics=true
./gradlew <task> -Dorg.gradle.unsafe.isolated-projects=true
```

- Use `help` with diagnostics mode first because it exercises broad configuration with minimal task execution noise.
- Diagnostics mode runs project configuration and Configuration Cache store sequentially, disables per-project model reuse, and configures all projects. Configuration Cache reuse can still skip configuration after a violation-free run; change a build input when re-exercising diagnostics.
- Do not commit diagnostics mode as steady-state policy. Disable it after migration because it deliberately turns off Isolated Projects optimizations and can hide the real performance shape.
- A clean diagnostics `help` run is a baseline, not a proof of full compatibility; lazy task configuration, IDE model builders, and representative workflows can still surface violations.
- Isolated Projects violations appear in the Configuration Cache HTML report; keep the report path and owning script/plugin/class.
- Warning mode (`--configuration-cache-problems=warn` or `org.gradle.configuration-cache.problems=warn`) is only a temporary migration aid to estimate benefits while violations remain; it can still fail on concurrency errors and will not prevent new incompatibilities.
- IDE sync migration needs the properties in `gradle.properties`; command-line `-D` flags will not affect IDE sync started outside that invocation.

## Repair Order

1. Upgrade Gradle, IDEs, and third-party plugins so known isolation fixes are available.
2. Make representative workflows Configuration Cache compatible first.
3. Address parent property/method lookup deprecations before broad rollout; consider `enableFeaturePreview("NO_IMPLICIT_LOOKUP_IN_PARENT_PROJECTS")` in settings to align Isolated Projects and non-Isolated behavior.
4. Run `help` in diagnostics mode and fix local build-logic violations before chasing workflow-specific lazy violations.
5. Report third-party plugin violations with owner evidence.
6. Exercise IDE sync and representative task workflows separately because they can touch different lazy build logic.

## Refactoring Choices

- Replace `allprojects` and `subprojects` cross-project mutation with convention plugins applied by each project that needs the behavior.
- Share artifacts through project dependencies, consumable variants, reports, or publications rather than another project's task, extension, or configuration state.
- For pure task ordering, a `dependsOn(":other:task")` task path can stay isolated-projects-compatible; do not dereference another project's task object such as `rootProject.tasks.foo`, and use variants or providers when files or artifacts are the real contract.
- Use `gradle.lifecycle.beforeProject` or `afterProject` state-isolating callbacks only when settings/init/settings-plugin lifecycle wiring is the real owner; `beforeProject` can add extensions before build scripts evaluate, while `afterProject` is for post-evaluation checks.
- Gradle recreates each `IsolatedAction` through Configuration Cache serialization per target project; captured values must be isolatable, and build services or shared mutable state are not supported inside the action.
- Use `project.isolated` or `rootProject.isolated` when another project's safe identity data is genuinely needed; the view is limited to identity/root/directory data, not a back door to `group`, `version`, `layout`, tasks, extensions, or configurations.
- Register shared build services with `registerIfAbsent` and mutate parameters only inside the registration action. Do not inspect `gradle.sharedServices.registrations`.
- Keep included builds as separate build owners; communicate through plugin management, coordinates, substitutions, or duplicated settings policy.

## Symptom Map

- Violation names another project: replace cross-project model access with a convention plugin, dependency, variant, publication, or isolated identity read.
- Violation appears only in IDE sync: model building exercised a path ordinary task runs did not; reproduce with IDE properties and inspect Tooling API/model builders.
- Diagnostics mode is clean but normal mode fails: investigate lazy task configuration, workflow-specific plugins, and parallel configuration ordering.
- Performance does not improve: check configuration-time share, `org.gradle.workers.max`, IDE model parallelism, tooling model cache status, work graph discovery, and whether Configuration Cache already hits.
- Parent property lookup changed: enable and migrate toward `NO_IMPLICIT_LOOKUP_IN_PARENT_PROJECTS`; under Isolated Projects, `properties` reports omit inherited parent properties and `Project.getProperties()` remains a violation.
