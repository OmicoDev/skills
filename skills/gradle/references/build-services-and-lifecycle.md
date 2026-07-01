# Gradle Build Services And Lifecycle Work

Read this when: shared build services, `BuildService`, `BuildServiceParameters`, `BuildEventsListenerRegistry`, Flow actions, or lifecycle-result work owns the change.

## Scope Boundary

- This file owns build-scoped shared state, service concurrency, task execution event listeners, and lifecycle-result work.
- Use [plugins-services-and-diagnostics.md](plugins-services-and-diagnostics.md) for plugin form, public task surface, and overall plugin design.
- Use [task-types-and-validation.md](task-types-and-validation.md) for task property annotations and task input/output contracts.
- Use [worker-api-and-processes.md](worker-api-and-processes.md) when the service is passed into Worker API work or process isolation owns the problem.

## Build Service Model

- A build service is build-scoped, registered lazily, created on demand, and shared by tasks across projects in the build; it is not a durable daemon singleton or a project extension substitute.
- Implement services as abstract `BuildService<P>` types. Use `BuildServiceParameters.None` when no parameters are needed.
- Service and parameter types are Gradle custom types; model parameters with managed properties.
- Build service implementations must be thread-safe because multiple tasks may use the same service concurrently.
- Implement `AutoCloseable` only when there is real cleanup; Gradle calls `close()` after the last user completes and before the build ends.
- `close()` only runs for a service instance that was actually created. Do not use build-service cleanup as a general `buildFinished` replacement when no task, action, transform, listener, or configuration-time owner may use the service.
- Do not implement `getParameters()`; Gradle supplies it.
- Do not coordinate tasks through task fields, static state, `synchronized` objects, or JDK concurrency primitives such as locks, latches, semaphores, or queues; configuration cache isolates task instances, so shared state and synchronization belong in a build service.

## Registration And Consumption

- Register services with `gradle.sharedServices.registerIfAbsent(...)`.
- Registration is lazy: the service instance is not created when no task/action actually uses it in that build.
- Build services are scoped to one build, not one project. Use a stable registration name when one shared resource should coordinate tasks across projects in the same build.
- `registerIfAbsent` reuses the first same-name registration; do not expect later calls with different parameters, limits, or implementation intent to merge. Centralize registration ownership and use deliberately unique names when the services are not the same shared resource.
- Mutate parameters only inside the registration action so configuration cache and Isolated Projects see one stable service definition.
- Gradle snapshots service parameters when it first creates the service instance; values changed after the first service query do not reconfigure that instance, so put mutable runtime coordination inside the service implementation.
- Do not inspect `gradle.sharedServices.registrations` under Isolated Projects; register by stable name and keep later lookups to the returned provider.
- Prefer `@ServiceReference` for task properties that consume a service. Matching is by service type and optional service name.
- When multiple services of the same type are registered and no `@ServiceReference` name disambiguates them, assign the provider manually.
- If the task property is `@Internal`, assign the service provider to the property and call `usesService(...)`; otherwise concurrency limits and service usage tracking can be missed.
- Do not model a build service as task input, output, local state, or destroyable state. Services may be referenced only through `@ServiceReference`, `@Internal` plus `usesService(...)`, or supported action parameters.
- Avoid calling `Provider.get()` for a service during configuration unless the service truly models configuration-time state.
- Do not derive configuration-cache fingerprints or `ValueSource` parameters from build service providers; a build service is safe as a task reference, but it cannot invalidate the configuration cache.

## Service Injection

- Inject only documented public Gradle services for the current task/plugin/settings/worker scope; internal injectable types and Gradle service-scope annotations are not plugin APIs.
- Service availability is owner-scoped; check the public service table for the exact receiver before relying on injection.
- Common examples differ by owner: project plugins and project-created types can use `ProjectLayout`, `WorkerExecutor`, `DependencyFactory`, `ToolingModelBuilderRegistry`, or `TestEventReporterFactory`; settings plugins use `BuildLayout`, `ToolingModelBuilderRegistry`, and `DependencyFactory`; worker actions expose a narrower worker service set.
- Constructor injection declares service requirements up front; property getter injection defers service creation until the getter is called.
- If an ad hoc script task needs `FileSystemOperations`, `ArchiveOperations`, or `ExecOperations` through an injected interface, treat that as a signal to extract a typed task when behavior grows.

## Concurrency And Indirect Use

- Use `maxParallelUsages` when the service guards a scarce external resource, global process, lock, or rate-limited endpoint.
- Leaving `maxParallelUsages` unset means Gradle does not constrain concurrent use of that service.
- When a task uses multiple build services, the effective parallelism is constrained by every visible service usage. The narrowest shared service limit can serialize or cap tasks even when other services allow more concurrency.
- A concurrency limit coordinates only tasks associated with that service registration; separate service names for the same external resource, or indirect service use without `@ServiceReference`/`usesService(...)`, can split or bypass the limit.
- Gradle cannot infer indirect service usage through another service. Declare indirect usage explicitly through `@ServiceReference` or `usesService(...)`.
- A service passed into [artifact transforms](dependency-artifact-transforms.md), another service, or no-isolation Worker API actions must still be registered and tracked from the consuming owner.
- Build services are not supported with classloader- or process-isolated worker actions.

## Task Execution Events

- Use a build service implementing `OperationCompletionListener` when plugin logic needs task execution events.
- Register event listeners through the injected `BuildEventsListenerRegistry`, not broad task execution callbacks.
- Task finish events are delivered concurrently with task execution and other work, soon after a task completes; listener work must not be used as a synchronization point, task dependency, or producer for downstream task inputs.
- One listener receives task events one at a time, while separate listeners and task execution can proceed concurrently. Use listener `close()` only to finalize listener-owned aggregation after queued events are handled, not to publish inputs for later tasks.
- Pass the provider returned by `registerIfAbsent(...)` or `BuildServiceRegistration.getService()` directly to build-event registration; Gradle 9 reports configuration-cache problems for mapped, flat-mapped, or ad hoc listener providers, including identity maps.
- Filter operation completion events by type, such as `TaskFinishEvent`, before reading task-specific data.
- Keep event listeners small and thread-safe; they observe execution, they should not mutate project configuration.
- For configuration-cache migration, replace `BuildListener`, `TaskExecutionListener`, and `buildFinished` patterns with build services or Flow actions when possible.
- Use build services for task-operation observation and resource cleanup; use Flow actions when the work is really about build-result data such as success or failure after task execution.

## Flow Actions

- Use ordinary tasks for source, filesystem, process, compiler, and output work.
- Use dataflow/Flow actions only for work that depends on lifecycle event providers, such as build completion results.
- Flow actions are parameterized isolated work; use `FlowParameters.None` when no parameters are needed, annotate service parameters with `@ServiceReference`, and annotate other parameters with `@Input`.
- Flow parameter types should be managed interfaces or abstract types with property-like getters; do not implement `getParameters()` or hand-create action instances.
- Wire extension values, lifecycle providers, and services into Flow parameters; do not make the action read `Project`, task, or extension objects directly from `execute(...)`.
- Flow action service injection is intentionally narrow; use documented services such as `FileSystemOperations`, `ArchiveOperations`, and `ExecOperations`, not arbitrary project/model services.
- Inject `FlowScope` and `FlowProviders` into project or settings plugins; do not instantiate `FlowAction` manually.
- Use `FlowScope.always(...)` when the action should run on every build invocation after its inputs are available; register it early enough for the failures it is meant to observe.
- Lifecycle event providers such as `buildWorkResult` can be transformed with `map` or `flatMap` while preserving the ordering guarantee for the Flow action.
- Do not query `buildWorkResult` during configuration; its value is available only after scheduled work completes or configuration fails before execution, and early reads are errors.
- Do not wire `buildWorkResult` into task properties or `ValueSource` parameters. Those values are calculated before build work completes and fail instead of delaying the task or value source until the build result exists.
- Without a lifecycle event provider input, Flow action timing is not stable.
- Treat Flow actions as incubating. If configuration fails before registration, the action cannot run.

## Failure Map

- Service concurrency limit ignored: check that competing tasks use the same service registration and that usage is visible through `@ServiceReference` or explicit `usesService(...)`, especially for `@Internal` service properties.
- Undeclared build-service usage warning: declare the exact consuming task property with `@ServiceReference` or call `usesService(...)` for the provider; do not rely on task-action `provider.get()` because Gradle cannot honor usage tracking or `maxParallelUsages` from that indirect access.
- Service provider type loaded by a different plugin classloader: prefer by-type `@ServiceReference`, or put the plugin on the root buildscript classpath with `apply false` so sibling projects share the service type.
- Service unexpectedly created during configuration: look for `provider.get()` or eager work in plugin application.
- Service create or stop failure: inspect the service constructor, parameter values, and `close()` implementation before changing task actions; creation failures surface through the consuming task, while stop failures are reported as service lifecycle failures after use.
- Service state races: make the implementation thread-safe or move shared state behind a concurrency-limited service.
- Listener breaks configuration cache: replace broad listeners with `BuildEventsListenerRegistry` and a registered build service.
- Listener stops receiving events after configuration-cache adoption: check that `onTaskCompletion(...)` received the raw build-service provider, not a mapped or wrapped provider.
- Listener side effects race with consumers: move the work into declared task inputs/outputs or a lifecycle Flow action; build-event listeners observe completion but do not order downstream work.
- Flow action does not run or runs at a surprising time: check that the plugin registered it before failure, used the intended `FlowScope`, and supplied a lifecycle event provider input.
