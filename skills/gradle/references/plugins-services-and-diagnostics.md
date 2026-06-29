# Gradle Plugins, Services, And Diagnostics

Read this when: plugin implementation, plugin form, task public surface, plugin-owned DSL, service/diagnostic routing, or plugin design owns the change.

## First Choice

- Read [task-types-and-validation.md](task-types-and-validation.md) for custom task types, inputs/outputs, validation annotations, file normalization, and cacheability.
- Read [task-execution-and-options.md](task-execution-and-options.md) for task dependencies, ordering, finalizers, skipping, timeouts, and command-line task options.
- Read [worker-api-and-processes.md](worker-api-and-processes.md) for Worker API, work isolation, worker daemons, and task-owned process work.
- Read [providers-and-properties.md](providers-and-properties.md) for extension models, managed properties, provider wiring, and domain object containers.
- Read [build-services-and-lifecycle.md](build-services-and-lifecycle.md) for shared build services, task execution listeners, service concurrency, and Flow actions.
- Read [plugin-problem-reporting.md](plugin-problem-reporting.md) for Problems API diagnostics, problem IDs/groups, rich failures, and problems reports.
- Read [plugin-testing.md](plugin-testing.md) for plugin unit, integration, functional, TestKit, GradleRunner, and cross-version tests.
- Read [publications-and-signing.md](publications-and-signing.md) for Plugin Portal publishing or plugin marker artifact expectations.
- Read [ecosystem-integrations.md](ecosystem-integrations.md) for Tooling API custom models, IDE integration, and Test Event Reporting API.
- Read [configuration-cache.md](configuration-cache.md) when task/plugin code captures unsupported model state.

## Scope Boundary

- This file owns plugin shape, public task surface, plugin-owned DSL choices, and routing to deeper plugin implementation owners.
- Custom task implementation details belong in [task-types-and-validation.md](task-types-and-validation.md); task execution surface belongs in [task-execution-and-options.md](task-execution-and-options.md); Worker API and process-isolation choices belong in [worker-api-and-processes.md](worker-api-and-processes.md).
- Extension/property model design belongs in [providers-and-properties.md](providers-and-properties.md).
- Build services and lifecycle-result work belong in [build-services-and-lifecycle.md](build-services-and-lifecycle.md).
- Structured plugin diagnostics belong in [plugin-problem-reporting.md](plugin-problem-reporting.md).
- Plugin test design and TestKit fixtures belong in [plugin-testing.md](plugin-testing.md).
- Publication metadata and signing belong in [publications-and-signing.md](publications-and-signing.md).
- Tooling API custom models, IDE import, and custom test event reporting belong in [ecosystem-integrations.md](ecosystem-integrations.md).

## Plugin Form

- Script plugins fit tiny local reuse but have limited typed accessors and testing.
- Precompiled script plugins fit project conventions with statically compiled DSL.
- Precompiled script plugin IDs come from the script file name plus an optional Kotlin package; `.settings.gradle(.kts)` targets `Settings`, `.init.gradle(.kts)` targets `Gradle`, and plain `.gradle(.kts)` targets `Project`.
- External plugins used inside precompiled script plugins must be on the plugin project's implementation classpath; `version "..."` and `apply false` are not valid inside the precompiled script plugin's own `plugins {}` block.
- Convention plugins encode build policy applied by participating projects.
- Use precompiled convention plugins when Kotlin DSL static accessors for applied plugin extensions, tasks, and configurations make the convention clearer; switch to a binary plugin when behavior needs reusable implementation classes, service injection, a custom dependency DSL, or a stable public API beyond script composition.
- Let convention plugins compose other convention plugins for layered policy, but keep the leaf/project-type plugin explicitly applied by each consuming project instead of using root `allprojects` or `subprojects` mutation as the composition mechanism.
- Choose binary plugin targets by owner: `Plugin<Gradle>` for init/runtime policy, `Plugin<Settings>` for build topology and plugin/repository resolution, and `Plugin<Project>` for tasks, dependencies, extensions, source sets, and publications.
- Binary plugins fit reusable behavior, extensions, custom tasks, services, diagnostics, custom dependency blocks, variants, and publishing.
- Keep capabilities separate from conventions: a base plugin can expose extensions, tasks, and services without forcing defaults, while a convention plugin can apply the base plugin and set organization defaults.
- On Gradle 9+, the old `Convention` API is removed; replace `Project.getConvention()`, `Task.getConvention()`, and plugin convention objects with extensions or direct task configuration.

## Plugin Design Checks

- Expose user intent through extensions and containers.
- Register tasks lazily and wire extension properties to task properties.
- Do not rely on plugin application order across scripts, projects, convention plugins, or included builds. If another plugin is mandatory, apply it inside `Plugin.apply`; if integration is optional, react with `pluginManager.withPlugin(...)`, `plugins.withId(...)`, or type-based `plugins.configureEach(...)`, which handle already-applied and later-applied plugins without `afterEvaluate` ordering assumptions.
- Use the injectable `BuildFeatures` service when plugin behavior should adapt to Gradle feature state such as configuration cache or Isolated Projects; `requested` is a possibly-absent `Provider<Boolean>` for user intent/reporting, while `active` is the effective status to gate incompatible behavior.
- Keep plugin IDs stable and namespace them by ownership.
- Avoid internal Gradle APIs; prefer public services and model APIs.
- Do not infer API stability from an importable `org.gradle` type; only documented public packages and services are stable, and `.internal.` packages, `Internal`, or `Impl` types are not plugin contracts.
- Treat `@Incubating` Gradle APIs as version-coupled plugin inputs: document the supported Gradle range, cover them with TestKit against representative Gradle versions, and avoid exposing them as your own stable extension API without a fallback plan.
- Keep external dependencies in plugins minimal to reduce classpath conflicts.
- Validate behavior with TestKit before publishing or applying broadly.
- Use `java-gradle-plugin` for plugin projects instead of hand-maintaining descriptors, `gradleApi()`/`compileOnlyApi` wiring, validation, marker publications, and TestKit classpath metadata.
- Register every public plugin in `gradlePlugin { plugins { ... } }`; treat plugin ID and `implementationClass` as release-facing API.
- Treat plugin descriptor, `implementation-class`, and task property validation warnings as blockers for publishable plugin code.
- Keep plugin classes as model coordinators: create extensions, set conventions, register tasks lazily, and wire extension properties to task properties without reading them during `apply`.

## Task Discovery And Surface

- User-facing tasks should have stable names, groups, and descriptions.
- Internal tasks can remain ungrouped.
- Use lifecycle tasks for orchestration and concrete tasks for work.
- Use [task-execution-and-options.md](task-execution-and-options.md) before adding task-specific CLI options or task graph relationships.
- Use `tasks`, `tasks --all`, and `help --task <task>` to inspect public surface.
- Prefer task providers and output wiring over eager task instances.

## Plugin-Owned Dependency Model

- Prefer typed extensions and custom dependency blocks when users should not know internal configuration names.
- Custom dependency blocks should expose meaningful dependency scopes and wire them back to underlying configurations.
- Add default dependencies when the plugin needs a tool or library at task execution time, but expose a configuration or version property so users can override it.
- Minimize external plugin implementation dependencies because Gradle plugins can share classloaders and conflict with other plugin libraries.

## Plugin Variants

- Use plugin variants only when one plugin must support different Gradle API levels or implementation dependencies.
- Set the Gradle plugin API version attribute on consumable variant configurations so plugin resolution can choose the best compatible variant.
- The selected plugin variant targets the highest Gradle API version that does not exceed the current build's Gradle version.
- Version-specific plugin variants are selected for plugin/buildscript/build-logic and plugin-development classpaths; ordinary dependency resolution prefers an unversioned plugin variant when one exists.
- Keep variant implementation classes, descriptors, capabilities, and `gradleApi()` wiring consistent across variants.
