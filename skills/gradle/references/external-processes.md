# Gradle External Processes

Read this when: `ExecOperations`, `JavaExec`, `providers.exec/javaexec`, external-process inputs/outputs, process cancellation, or subprocess cleanup owns the work.

## Scope Boundary

- This file owns external tools launched by task actions, work actions, provider-backed configuration inputs, or `ValueSource` implementations.
- Use [worker-api-and-processes.md](worker-api-and-processes.md) when one task divides work into isolated or parallel `WorkAction` items or worker-daemon reuse owns the problem.
- Use [task-types-and-validation.md](task-types-and-validation.md) when the task type's inputs, outputs, cacheability, or validation annotations are the primary owner.
- Use [runtime-and-structure.md](runtime-and-structure.md) when the process is the Gradle client, daemon, or a daemon-owned worker JVM rather than a tool launched by build logic.

## Execution Model

- Use `ExecOperations.exec/javaexec`, `JavaExec`, `JavaLauncher`, or tool providers when the process is task or work-action behavior; do not use `Project.exec`, `Project.javaexec`, or script-level `exec/javaexec` in Gradle 9+.
- Declare the executable, arguments, working directory, environment, inputs, and outputs on the owning task; process output that affects later work must be a modeled output or provider value, not a hidden side effect.
- Capture standard output, error output, exit handling, and environment deliberately; do not infer success solely from process startup.
- Use `providers.exec/javaexec` only for a simple provider-backed process output needed by configuration logic. If queried during configuration, the output becomes a configuration-cache input and the process runs on later builds to check cache freshness, so keep it fast.
- Use a custom `ValueSource` with injected `ExecOperations` when configuration-time process work needs parameters, exit handling, custom input streams, streaming output, or non-trivial parsing.
- Do not hide slow, networked, or mutating external tools inside `providers.exec` or `ValueSource`; model them as tasks unless the build model genuinely needs the value before task graph calculation.
- `ExecOutput` captures result, standard output, and standard error lazily and runs the process once on first provider query; handle startup failures at the provider consumer instead of assuming the command already ran.
- `providers.exec/javaexec` cannot customize process input/output streams; use `ValueSource` or a task-owned `ExecOperations` call when stdin, separated streams, or streaming output is part of the contract.

## Cancellation And Cleanup

- Design external process work with timeout, cancellation, and cleanup behavior that does not leave orphaned processes, locked files, or partially trusted outputs.
- Gradle 9.1+ terminates known descendants before the main process when cancelling a process launched through Gradle's managed process APIs. The Gradle 8 line does the same from 8.14.4 onward only when the Gradle daemon runs on Java 9+; on Java 8 it still terminates only the main process, as do Gradle 9.0 and Gradle 8.14.3 or earlier.
- On those process-tree-cleanup versions, distinguish processes launched directly by build code through raw `Runtime.exec` or custom launchers from `Runtime.exec` descendants of a Gradle-managed root process, which participate in managed cleanup. Also inspect detached modes and tools that deliberately escape the process tree when descendants survive cancellation.
- On Gradle 4.8+, cancellation does not mark an in-flight `Exec`/`JavaExec`-backed task complete or store its partial result as a new cache entry, even when `ignoreExitValue` is enabled or task code catches the process failure. The next request reevaluates the task and may still reuse an independently valid prior cache entry; otherwise it executes again.
- Cancellation hangs: inspect blocking I/O, shutdown hooks, child processes that detach or ignore termination, and cleanup code before changing daemon settings.
- Custom in-process task and work-action code still depends on cooperative thread interruption; route ignored-interrupt or worker-daemon shutdown diagnosis to [worker-api-and-processes.md](worker-api-and-processes.md).

## Failure Map

- Process starts during configuration or on every configuration-cache reuse check: find the provider query and move non-model work into a task.
- Process exit is ignored but later work consumes missing or partial output: model the output and validate the exit/result before exposing it to consumers.
- Cancellation leaves descendants alive: confirm the process was launched through Gradle's managed process APIs, then inspect detachment and subprocess-tree escape behavior.
- Repeated configuration-cache invalidation names process output: keep the command fast and deterministic or replace configuration-time process output with task-owned generated state.
