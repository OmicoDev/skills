# Gradle Configuration Cache

Read this when: enabling, diagnosing, repairing, or rolling out Gradle configuration cache.

## Model

- Configuration cache stores the configured task graph and build-logic state for a requested task set.
- Cache entries are invalidated by relevant build configuration inputs: scripts, settings, init scripts, system properties, environment, files read during configuration, Gradle version, and build logic.
- First run stores an entry; later compatible runs reuse it and skip much configuration work.
- The feature is not enabled by default; treat adoption as a compatibility rollout, not a formatting change.
- IDE task execution support and IDE sync/import behavior are separate boundaries.
- Isolated Projects builds on configuration-cache infrastructure, but project isolation violations and cache reuse failures are different symptoms.

## Enablement

- Test representative commands before making it default.
- Use `--configuration-cache` for focused trials.
- Use `org.gradle.configuration-cache=true` only after representative local/CI workflows pass.
- Treat warning mode and max-problems settings as migration aids, not release defaults.
- Track third-party plugin blockers separately from local build-logic repairs.

## Input Boundaries

- Gradle tracks many configuration inputs automatically, but build logic still needs supported APIs.
- Files read during configuration can invalidate cache entries.
- Environment variables and system properties should be read through providers when they affect configuration.
- External process output needed during configuration should use provider-backed process APIs or `ValueSource`.
- `ValueSource` is the escape hatch when built-in providers are too small. Gradle tracks the returned value, not every environment variable, file, process, or network read inside `obtain()`.
- `ValueSource` should return an effectively immutable value. If queried during configuration, `obtain()` runs on every build to decide whether the cache entry is still reusable.
- `ValueSource.obtain()` can run on every build to decide cache reuse, so keep it fast and deterministic.
- Avoid enumerating all environment variables or system properties during configuration. Query concrete names or provider-backed prefixes.
- Secrets need care because configuration cache can persist model state.

## Report-Driven Repair

- Open the generated configuration-cache HTML report and fix the named owner.
- Use both report views: grouped by message to find repeated API misuse and grouped by task to find the owning task or plugin.
- Review detected configuration inputs in the report before deciding whether a cache miss is expected.
- Do not use `Project`, `Gradle`, `Settings`, `SourceSet`, `Configuration`, or resolved dependency result objects in task actions.
- Replace execution-time `project.copy`, `project.exec`, logging, and layout access with injected services or task properties.
- Model environment, system properties, files, and external process results through providers or `ValueSource`.
- Move complex ad hoc `doLast` closures into typed task classes when they need injection or validation.
- Keep secrets out of serialized model state; follow Gradle's encryption-key guidance when credentials must participate.
- If shared environments provide configuration-cache encryption keys, keep `GRADLE_ENCRYPTION_KEY` stable across intended reuse boundaries.

## Task State Rules

- Task fields and task actions must not reference live JVM state such as threads, sockets, classloaders, streams, or synchronization primitives.
- Task actions must not use Gradle model objects such as `Project`, `Settings`, `Gradle`, `SourceSet`, `Configuration`, publications, or dependency results.
- Replace `Configuration` task inputs with `FileCollection` or provider-backed resolution results that defer dependency resolution to the owning consumer.
- Replace `SourceDirectorySet` task inputs with `FileTree` or file properties when only files are needed.
- Replace resolved dependency result objects with provider-backed results such as `ResolutionResult.getRootComponent()` or `ArtifactCollection.getResolvedArtifacts()` when the task truly needs resolution metadata.
- Tasks must not inspect or mutate another task instance during execution; wire task outputs, inputs, or providers instead.
- Do not rely on reference identity for shared mutable standard collections after cache reload. Use task properties or shared build services.
- Task extensions, conventions, and extra properties must be read during configuration and copied into task properties, not accessed at execution time.

## Common Repairs

- Replace execution-time `project.file(...)` with file properties wired during configuration.
- Replace `System.getenv(...)` or `System.getProperty(...)` reads during configuration with provider-backed reads.
- Replace simple external process reads during configuration with `providers.exec` or `providers.javaexec`; use `ValueSource` when the input selection is more complex.
- Replace build listeners and broad lifecycle callbacks with supported services or dataflow actions when possible.
- Replace `BuildListener`, `TaskExecutionListener`, and `buildFinished` patterns with build services registered through `BuildEventsListenerRegistry` or Flow actions tied to lifecycle event providers.
- Replace task-to-task instance references with declared inputs, outputs, or provider values.
- Isolate third-party plugin blockers from local build logic blockers so rollout can proceed per workflow.

## Testing

- Add TestKit coverage for plugin behavior that should support configuration cache.
- Run a representative task twice and confirm the second run reuses configuration.
- Use incompatible-task opt-out only while isolating a task that cannot yet be repaired.
- Use warning mode and max-problems limits only to explore blockers; remove them from release workflows.
- Do not treat deleting `.gradle/configuration-cache` as a fix.

## Rollout Checks

- Test `help`, ordinary verification, publishing dry-runs, and custom task workflows separately.
- Check IDE task execution separately from IDE sync/import.
- Keep a known opt-out command while migration is active, then remove it from release workflows once blockers are fixed.

## Source Calibration

Primary upstream pages: Configuration Cache, Configuration Cache Requirements, Debugging and Troubleshooting the Configuration Cache, Isolated Projects.
