# Gradle Worker API And Processes

Read this when: Worker API, `WorkAction`, work isolation, worker daemons, task-owned process work, or cancellation of parallel task work owns the change.

## Scope Boundary

- This file owns how a task divides execution work into isolated or parallel units.
- Use [task-types-and-validation.md](task-types-and-validation.md) for the task type's inputs, outputs, cacheability, validation annotations, and task relationships.
- Use [build-services-and-lifecycle.md](build-services-and-lifecycle.md) for build service lifecycle, service parameters, and task execution event listeners.
- Use [runtime-and-structure.md](runtime-and-structure.md) when the failing process is the Gradle client, daemon, or a daemon-owned worker JVM at runtime startup.

## When To Use Worker API

- Use Worker API when one task action has independent units of work that can run concurrently or need isolation from the Gradle runtime.
- Keep ordinary typed tasks when the work is single-unit, already modeled by a built-in task type, or better represented as separate task outputs.
- Do not use Worker API to hide undeclared inputs, missing outputs, or task ordering problems. The owning task still declares the full input and output contract.
- Use classloader or process isolation when a library fails because Gradle's configuration-cache Java agent modifies buildscript bytecode; if the library has a stable `main` entry point and no per-item parallelism need, a `JavaExec` task can be the simpler isolation boundary.
- Keep external process execution task-owned: inject `ExecOperations`, `JavaLauncher`, or tool providers into tasks or work actions instead of reaching through `Project`.
- Do not use `Project.exec`, `Project.javaexec`, or script-level `exec/javaexec`; in Gradle 9 they are removed. Use `ExecOperations` for task/action execution and provider-backed process APIs when a configuration value must come from a process.

## Work Model

- Inject `WorkerExecutor` into the task type and submit `WorkAction<P>` items from the task action.
- Model work item parameters with `WorkParameters` and managed properties; pass serializable values, file properties, classpaths, and tool locations, not `Project`, task instances, or mutable Gradle model objects.
- Do not implement `WorkAction.getParameters()` or concrete `WorkParameters`; Gradle generates and injects them.
- Obtain a `WorkQueue` from `noIsolation()`, `classLoaderIsolation(...)`, or `processIsolation(...)`; do not use old `WorkerExecutor.submit(...)` patterns.
- Keep a `WorkQueue` local to the task action; the queue has one set of worker requirements and is not a thread-safe coordination object.
- Treat each work item as concurrently executable. Avoid shared mutable state unless it is protected by a build service or another explicit concurrency boundary.
- Do not rely on work item completion order. Give each item unique outputs or add an explicit deterministic aggregation step.
- Use `WorkQueue.await()` only for an intentional fan-in point; it blocks the task action and failures otherwise surface from the surrounding task action before completion.
- Wire all files used by workers through the owning task inputs and outputs, even when the work action receives only a subset.
- Capture standard output, error output, exit handling, and environment deliberately for process work.

## Isolation Choices

- `noIsolation()` is fastest and runs work in the build process with a shared classloader. Use it only when static state and classpath sharing are acceptable.
- `noIsolation()` still does not make project state mutable from a work action. If a work item needs project data, pass stable values through `WorkParameters` before execution.
- `classLoaderIsolation()` isolates the implementation classpath while staying in-process. Use it when work needs a dedicated library classpath but not a separate JVM.
- If a worker library version is user-configurable, keep it off the buildscript runtime classpath and expose the worker classpath as a task input before wiring it to the isolated work queue.
- `processIsolation()` runs work in worker daemon JVMs. Use it for incompatible libraries, system-property conflicts, process-level state, or a different Java executable.
- Do not set a process-isolated worker working directory through fork options; Gradle chooses a shared worker directory for reuse, so pass files and directories through `WorkParameters`.
- Isolation is not a replacement for input declaration. Classpaths, fork options, tool versions, and environment values that affect outputs must be modeled.
- Build services can be passed to no-isolation work. They are not supported with classloader- or process-isolated worker actions.

## Worker Daemons

- Process-isolated work uses worker daemons that can be reused for compatible work in the current build session; do not treat them as durable across normal builds, except for continuous/session-specific reuse.
- Worker daemon reuse depends on compatibility: Java executable, classpath, heap settings, JVM args, system properties, environment variables, bootstrap classpath, debug flag, assertions, and default encoding.
- Worker daemon default max heap is limited, and reuse matching is stricter for executable, exact classpath, debug, assertions, and encoding than for superset-like JVM args, system properties, environment, bootstrap classpath, or higher heap.
- Process isolation has startup cost. Prefer classloader isolation when classpath isolation is enough.
- Gradle may stop worker daemons when system memory is low; do not use them as durable state stores.
- Distinguish Gradle daemon issues from worker daemon issues before changing `org.gradle.jvmargs` or Daemon JVM criteria.

## Cancellation And Timeouts

- Custom tasks and work actions should respond to thread interruption. User cancellation and task timeouts rely on cooperative interruption.
- If a task or work item does not respond to interruption promptly, Gradle may shut down the daemon to free resources.
- Daemon shutdown after cancellation or timeout is often evidence of ignored interrupts in task or work-action code, not a reason to start by changing daemon JVM policy.
- Design external process work with timeout, cancellation, and cleanup behavior that does not leave orphaned processes or locked files.

## Failure Map

- Worker work is serial or slow: check `org.gradle.workers.max`, task input partitioning, shared locks, process startup cost, and whether the work is actually independent.
- Class not found or library conflict: choose classloader/process isolation and model the worker classpath as a task input.
- Process-isolated work starts too many JVMs: align fork options and classpaths so worker daemon reuse is possible.
- Build service unavailable in worker: verify the isolation mode; services are not supported in classloader- or process-isolated work.
- Library integrity check or agent-sensitive code fails only under Gradle: move the library work to classloader/process isolation or a dedicated `JavaExec` task and model that classpath as an input.
- Cancellation hangs: inspect interrupt handling in loops, blocking I/O, external processes, and cleanup code.
- Configuration cache failure names worker parameters: replace captured Gradle model objects with managed parameter properties or stable scalar/file values.

## Source Calibration

Primary upstream pages: Worker API, Service Injection, Implementing Custom Tasks, Dealing with Validation Problems, Configuration Cache Requirements, Gradle 9 Upgrade Guide.
