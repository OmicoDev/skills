# Gradle Worker API And Worker Daemons

Read this when: Worker API, `WorkAction`, work isolation, worker daemons, or cancellation of parallel task work owns the change.

## Scope Boundary

- This file owns how a task divides execution work into isolated or parallel units.
- Use [external-processes.md](external-processes.md) when `ExecOperations`, `JavaExec`, `providers.exec/javaexec`, external-process cancellation, or subprocess cleanup owns the work.
- Use [task-types-and-validation.md](task-types-and-validation.md) for the task type's inputs, outputs, cacheability, validation annotations, and task relationships.
- Use [build-services-and-lifecycle.md](build-services-and-lifecycle.md) for build service lifecycle, service parameters, and task execution event listeners.
- Use [runtime-and-structure.md](runtime-and-structure.md) when the failing process is the Gradle client, daemon, or a daemon-owned worker JVM at runtime startup.

## When To Use Worker API

- Use Worker API when one task action has independent units of work that can run concurrently or need isolation from the Gradle runtime.
- Keep ordinary typed tasks when the work is single-unit, already modeled by a built-in task type, or better represented as separate task outputs.
- Do not use Worker API to hide undeclared inputs, missing outputs, or task ordering problems. The owning task still declares the full input and output contract.
- Treat Worker API as task execution parallelism, not configuration-time work; submit work after the owning task properties have been configured and finalized for execution.
- Use classloader or process isolation when a library fails because Gradle's configuration-cache Java agent modifies buildscript bytecode; if the library has a stable `main` entry point and no per-item parallelism need, a `JavaExec` task can be the simpler isolation boundary.

## Work Model

- Inject `WorkerExecutor` into the task type and submit `WorkAction<P>` items from the task action.
- Model work item parameters with `WorkParameters` and managed properties; pass serializable values, file properties, classpaths, and tool locations, not `Project`, task instances, or mutable Gradle model objects.
- Prefer Gradle-managed value carriers for worker parameters: `Property`, `ListProperty`, `SetProperty`, `MapProperty`, `RegularFileProperty`, `DirectoryProperty`, and `ConfigurableFileCollection`; use plain setters only for simple scalar or managed-object values that Gradle can isolate in every selected mode.
- Treat worker parameters as isolated at submission, even with `noIsolation()`. Do not rely on parameter object identity or later mutation to communicate between work items.
- Treat work action construction, parameter isolation, and parameter deserialization as worker-boundary failures. When errors mention value isolation, serialization, parameter creation, or action instantiation, inspect the parameter graph and isolated worker classpath before rewriting task action logic.
- Make work actions abstract, annotate constructors with `@Inject`, and use `WorkParameters.None` when no parameters are needed; do not implement `WorkAction.getParameters()` or concrete `WorkParameters` because Gradle generates and injects them.
- Obtain a `WorkQueue` from `noIsolation()`, `classLoaderIsolation(...)`, or `processIsolation(...)`; do not use old `WorkerExecutor.submit(...)` patterns.
- Keep a `WorkQueue` local to the task action; the queue has one set of worker requirements and is not a thread-safe coordination object.
- Submit Worker API work from the owning task action or another Gradle-managed execution thread. Do not create arbitrary threads just to call `WorkQueue.submit`; let Worker API own the parallelism and pass per-item inputs through `WorkParameters`.
- Work actions can inject public worker services such as `FileSystemOperations`, `ObjectFactory`, `ProviderFactory`, and `ExecOperations`; do not inject `Project`, `ProjectLayout`, or internal Gradle services. Relative paths used through `FileSystemOperations` resolve from the owning project directory.
- A work action can inject `Problems` for structured diagnostics; route problem IDs, labels, locations, additional data, and Tooling API assertions to [plugin-problem-reporting.md](plugin-problem-reporting.md), and verify each isolation mode because process-isolated workers can emit the problem without the same origin stack location as in-process workers.
- Treat each work item as concurrently executable. Avoid shared mutable state unless it is protected by a build service or another explicit concurrency boundary.
- Do not rely on work item completion order. Give each item unique outputs or add an explicit deterministic aggregation step.
- Use `WorkQueue.await()` only when the same task action must read worker results before returning; it blocks same-project task parallelism while waiting, and failures otherwise surface from the surrounding task action before completion.
- When `WorkQueue.await()` fails, inspect every nested cause; one queue can report multiple failed work items instead of stopping at the first failure.
- Waiting one `WorkQueue` reports that queue's failures but does not make other submitted queues successful; failures in another queue can still fail the surrounding task action later.
- Prefer queue-level `await()` for one queue; `WorkerExecutor.await()` waits all work associated with the current build operation and can over-block unrelated queues.
- Only no-isolation work actions can submit nested Worker API work; classloader- and process-isolated work actions cannot inject `WorkerExecutor`, so use the owning task action as the scheduler for isolated work.
- Wire all files used by workers through the owning task inputs and outputs, even when the work action receives only a subset.

## Isolation Choices

- `noIsolation()` is fastest and runs work in the build process with a shared classloader. Use it only when static state and classpath sharing are acceptable.
- `noIsolation()` still does not make project state mutable from a work action. If a work item needs project data, pass stable values through `WorkParameters` before execution.
- `classLoaderIsolation()` isolates the implementation classpath while staying in-process. Use it when work needs a dedicated library classpath but not a separate JVM.
- For classloader or process isolation, make the worker implementation's runtime dependencies explicit; Gradle internal libraries do not leak into worker classpaths, and configured worker classpath entries are added to the work-action implementation classpath.
- If a worker library version is user-configurable, keep it off the buildscript runtime classpath and wire a provider-backed task input classpath into the isolated work queue so dependency resolution stays execution-time/lazy.
- `processIsolation()` runs work in worker daemon JVMs. Use it for incompatible libraries, system-property conflicts, process-level state, or a different Java executable.
- When process isolation needs a different JDK, derive `forkOptions.executable` from a Java toolchain launcher instead of hard-coding a local Java path, and keep the selected launcher compatible with the worker implementation bytecode.
- Do not set a process-isolated worker working directory through fork options; Gradle chooses a shared worker directory for reuse, so pass files and directories through `WorkParameters`.
- Isolation is not a replacement for input declaration. Classpaths, fork options, tool versions, and environment values that affect outputs must be modeled.
- Build services can be passed to no-isolation work by wiring the registered service provider into a `Property<ServiceType>` on `WorkParameters`; they are not supported with classloader- or process-isolated worker actions.

## Worker Daemons

- Process-isolated work uses worker daemons that can be reused only while Gradle considers them compatible and alive; do not rely on reuse across builds, daemon restarts, classpath changes, unexpected worker failure, or memory pressure, and never store correctness state in them.
- Worker processes are daemon-started runtimes with their own Java executable and service set; diagnose them separately from the Gradle client and main daemon.
- Worker daemon reuse depends on compatibility: Java executable, classpath, heap settings, JVM args, system properties, environment variables, bootstrap classpath, debug flag, assertions, and default encoding.
- Worker daemon reuse can also be broken by keep-alive scope, classloader structure changes, log-level changes, failed clients, or memory pressure; treat extra worker starts as compatibility evidence before tuning `org.gradle.workers.max`.
- Keep process-isolated worker requirements stable across submitted items when reuse matters; changing classpaths or fork options can intentionally split worker daemon pools.
- For classloader- or process-isolated classpath issues, compare the declared task input classpath with Gradle's copied/transformed worker classpath in the project cache before blaming daemon reuse.
- Worker daemon default max heap is limited, and reuse matching is stricter for executable, exact classpath, debug, assertions, and encoding than for superset-like JVM args, system properties, environment, bootstrap classpath, or higher heap.
- Process isolation has startup cost. Prefer classloader isolation when classpath isolation is enough.
- Gradle may stop worker daemons when system memory is low; do not use them as durable state stores.
- Distinguish Gradle daemon issues from worker daemon issues before changing `org.gradle.jvmargs` or Daemon JVM criteria.

## Cancellation And Timeouts

- Custom tasks and work actions should respond to thread interruption. User cancellation and task timeouts rely on cooperative interruption.
- If a task or work item does not respond to interruption promptly, Gradle may shut down the daemon to free resources.
- Daemon shutdown after cancellation or timeout is often evidence of ignored interrupts in task or work-action code, not a reason to start by changing daemon JVM policy.

## Failure Map

- Worker work is serial or slow: check `org.gradle.workers.max`, task input partitioning, shared locks, process startup cost, and whether the work is actually independent.
- Treat `--max-workers` and `org.gradle.workers.max` as global Gradle worker-pool limits, not a per-task tuning knob; lowering them can hide races, and raising them can overload CPU, memory, native toolchains, test forks, or external services.
- Class not found or library conflict: choose classloader/process isolation and model the worker classpath as a task input.
- Process-isolated worker JVM fails before running work: inspect the task-associated worker startup output and the worker fork options first, especially JVM args, executable, system properties, environment, and classpath.
- Process-isolated work starts too many JVMs: align fork options and classpaths so worker daemon reuse is possible.
- Build service unavailable in worker: verify the isolation mode; services are not supported in classloader- or process-isolated work.
- Library integrity check or agent-sensitive code fails only under Gradle: move the library work to classloader/process isolation or a dedicated `JavaExec` task and model that classpath as an input.
- Cancellation hangs: inspect interrupt handling in loops, blocking I/O, and cleanup code.
- Configuration cache failure names worker parameters: replace captured Gradle model objects with managed parameter properties or stable scalar/file values.
