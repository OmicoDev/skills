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
- Read [configuration-cache.md](configuration-cache.md) when task/plugin code captures unsupported model state.

## Scope Boundary

- This file owns plugin shape, public task surface, plugin-owned DSL choices, and routing to deeper plugin implementation owners.
- Custom task implementation details belong in [task-types-and-validation.md](task-types-and-validation.md); task execution surface belongs in [task-execution-and-options.md](task-execution-and-options.md); Worker API and process-isolation choices belong in [worker-api-and-processes.md](worker-api-and-processes.md).
- Extension/property model design belongs in [providers-and-properties.md](providers-and-properties.md).
- Build services and lifecycle-result work belong in [build-services-and-lifecycle.md](build-services-and-lifecycle.md).
- Structured plugin diagnostics belong in [plugin-problem-reporting.md](plugin-problem-reporting.md).
- Plugin test design and TestKit fixtures belong in [plugin-testing.md](plugin-testing.md).
- Publication metadata and signing belong in [publications-and-signing.md](publications-and-signing.md).

## Plugin Form

- Script plugins fit tiny local reuse but have limited typed accessors and testing.
- Precompiled script plugins fit project conventions with statically compiled DSL.
- Precompiled script plugin IDs come from the script file name plus an optional Kotlin package; `.settings.gradle(.kts)` targets `Settings`, `.init.gradle(.kts)` targets `Gradle`, and plain `.gradle(.kts)` targets `Project`.
- External plugins used inside precompiled script plugins must be on the plugin project's implementation classpath; `version "..."` and `apply false` are not valid inside the precompiled script plugin's own `plugins {}` block.
- Convention plugins encode build policy applied by participating projects.
- Binary plugins fit reusable behavior, extensions, custom tasks, services, diagnostics, custom dependency blocks, variants, and publishing.
- Keep capabilities separate from conventions: a plugin can expose behavior without forcing every convention.

## Plugin Design Checks

- Expose user intent through extensions and containers.
- Register tasks lazily and wire extension properties to task properties.
- React to other plugins with `plugins.withId(...)`.
- Use the Build Features API when plugin behavior should adapt to requested or active Gradle features such as configuration cache.
- Keep plugin IDs stable and namespace them by ownership.
- Avoid internal Gradle APIs; prefer public services and model APIs.
- Keep external dependencies in plugins minimal to reduce classpath conflicts.
- Validate behavior with TestKit before publishing or applying broadly.
- Use `java-gradle-plugin` for plugin projects instead of hand-maintaining descriptors, `gradleApi()` wiring, marker publications, and TestKit classpath metadata.
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
- Keep variant implementation classes, descriptors, capabilities, and `gradleApi()` wiring consistent across variants.

## Source Calibration

Primary upstream pages: Introduction to Plugins, Binary Plugins, Precompiled Script Plugins, Convention Plugins, Java Gradle Plugin Development Plugin.
