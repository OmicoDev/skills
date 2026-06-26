# Gradle Plugins, Services, And Diagnostics

Read this when: plugin implementation, shared build services, lifecycle-result work, service injection, Problems API diagnostics, TestKit, or task public surface owns the change.

## First Choice

- Read [task-types-and-validation.md](task-types-and-validation.md) for custom task types, inputs/outputs, validation annotations, file normalization, Worker API, and cacheability.
- Read [providers-and-properties.md](providers-and-properties.md) for extension models, managed properties, provider wiring, and domain object containers.
- Read [publications-and-signing.md](publications-and-signing.md) for Plugin Portal publishing or plugin marker artifact expectations.
- Read [configuration-cache.md](configuration-cache.md) when task/plugin code captures unsupported model state.

## Scope Boundary

- This file owns plugin shape, service selection, lifecycle-result hooks, public task surface, structured diagnostics, and plugin-level tests.
- Custom task implementation details belong in [task-types-and-validation.md](task-types-and-validation.md).
- Extension/property model design belongs in [providers-and-properties.md](providers-and-properties.md).
- Publication metadata and signing belong in [publications-and-signing.md](publications-and-signing.md).

## Plugin Form

- Script plugins fit tiny local reuse but have limited typed accessors and testing.
- Precompiled script plugins fit project conventions with statically compiled DSL.
- Convention plugins encode build policy applied by participating projects.
- Binary plugins fit reusable behavior, extensions, custom tasks, services, diagnostics, and publishing.
- Keep capabilities separate from conventions: a plugin can expose behavior without forcing every convention.

## Plugin Design Checks

- Expose user intent through extensions and containers.
- Register tasks lazily and wire extension properties to task properties.
- React to other plugins with `plugins.withId(...)`.
- Keep plugin IDs stable and namespace them by ownership.
- Avoid internal Gradle APIs; prefer public services and model APIs.
- Keep external dependencies in plugins minimal to reduce classpath conflicts.
- Validate behavior with TestKit before publishing or applying broadly.

## Task Discovery And Surface

- User-facing tasks should have stable names, groups, and descriptions.
- Internal tasks can remain ungrouped.
- Use lifecycle tasks for orchestration and concrete tasks for work.
- Use `tasks`, `tasks --all`, and `help --task <task>` to inspect public surface.
- Prefer task providers and output wiring over eager task instances.

## Service Selection

- Inject Gradle services such as `ObjectFactory`, `ProviderFactory`, `ProjectLayout`, `FileSystemOperations`, `ArchiveOperations`, and `ExecOperations`.
- Use `FileSystemOperations` for copy/delete/sync-style work in task actions.
- Use `ExecOperations` for external processes in tasks or workers.
- Use `ProviderFactory` for environment, system, Gradle property, and process providers.
- Use `ValueSource` for provider-backed external values that should participate in configuration-cache invalidation when built-in providers are too small.
- Use shared build services for shared clients, locks, stateful resources, task execution listeners, or concurrency limits.
- Use Problems API for structured plugin-owned warnings and failures.
- Use Flow actions only for lifecycle-result work that is not naturally a task.

## Shared Build Services

- Shared build services are build-scoped, created on demand, cleaned up by Gradle, and may be used concurrently by tasks from multiple projects.
- Build service implementations must be thread-safe. Implement `AutoCloseable` only when there is real cleanup; do not implement `getParameters()`.
- Configure `BuildServiceParameters` during `registerIfAbsent`; avoid reading project state from service actions.
- Prefer `@ServiceReference` for task properties that consume a service. Matching is by type and optional name.
- With `@Internal`, assign the provider to the task property and call `usesService`; otherwise concurrency limits and service usage tracking can be missed.
- Do not model a build service as a task input. Use `@ServiceReference`, or `@Internal` plus explicit `usesService`.
- Use `maxParallelUsages` for scarce resources. Declare indirect service usage explicitly because Gradle cannot infer services used only through another service.
- Avoid service use during configuration unless the service truly models configuration-time state.
- Build services can be passed to artifact transforms, other services, and no-isolation Worker API actions. They are not supported with classloader- or process-isolated worker actions.

## Problem Reporting

- Use the Problems API when a plugin owns diagnostics that should be structured for CLI, IDEs, Build Scan, and Tooling API clients.
- Create stable problem groups and IDs so duplicate problems can be summarized.
- Use `report` for recoverable problems and `throwing` for fatal problems that should fail the build with rich failure details.
- Add labels, details, severity, solutions, and extra data only when they help a user act.
- Do not replace ordinary task validation annotations with ad hoc Problems API text.
- Avoid Problems API internals; plugin compatibility should depend only on public Problems APIs.
- The HTML problems report is generated only when problems are reported; use `--no-problems-report` only when the report itself is unwanted.

## Lifecycle Work

- Use ordinary tasks for source, filesystem, process, compiler, and output work.
- Use build services for shared resources, concurrency limits, task execution event listeners, or shared state that must survive across task actions.
- Register services with `registerIfAbsent`; mutate parameters only inside the registration action so Isolated Projects does not see shared mutable state.
- Use dataflow/Flow actions only when work depends on lifecycle event providers such as build completion. Without a lifecycle event input, timing is not stable.
- Treat Flow actions as incubating. A configuration-time failure can prevent a Flow action from being registered.
- Prefer `GradleLifecycle` state-isolating callbacks over broad callbacks that capture shared mutable state during Isolated Projects migrations.

## Testing

- Unit test pure logic.
- Use TestKit for functional plugin behavior and Gradle-version-sensitive behavior.
- Exercise generated tasks, extensions, service wiring, diagnostics, configuration cache behavior, and representative Kotlin/Groovy DSL usage.

## Source Calibration

Primary upstream pages: Introduction to Plugins, Binary Plugins, Convention Plugins, Testing Plugins, Using Shared Build Services, Dataflow Actions, Reporting Plugin Problems, Configuration Cache Requirements, Isolated Projects.
