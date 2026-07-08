# Gradle Configuration Cache

Read this when: enabling, diagnosing, repairing, or rolling out Gradle configuration cache.

## Model

- Configuration cache stores the configured task graph and build-logic state for a requested task set.
- Cache entries are invalidated by relevant build configuration inputs: scripts, settings, init scripts, system properties, environment, files read during configuration, Gradle version, and build logic.
- With configuration cache enabled, Gradle stores and then loads an entry even on a miss before executing tasks; later compatible runs reuse the loaded task graph and skip project configuration.
- The feature is not enabled by default; treat adoption as a compatibility rollout, not a formatting change.
- IDE task execution support and IDE sync/import behavior are separate boundaries.
- Isolated Projects builds on configuration-cache infrastructure, but project isolation violations and cache reuse failures are different symptoms; read [isolated-projects.md](isolated-projects.md) when cross-project mutable access or IDE model caching owns the issue.
- Cache entries are local project state under `.gradle/configuration-cache`, reusable by local hot and cold daemons but not shared across developers or CI machines; deleting the directory removes evidence and is not a durable repair.
- Report silence is not proof that reuse should happen; check the status page for not-yet-implemented features such as source dependencies or TestKit builds with Java agents.
- Configuration-cache store can precompute task state and force dependency graph/artifact resolution that would normally happen during execution; apparent resolution timing changes usually belong to task input wiring or resolved dependency-result modeling, not repository policy.

## Enablement

- Test representative commands before making it default.
- Use `--configuration-cache` for focused trials.
- Use `--dry-run` with configuration cache to expose configuration-time problems before task actions add noise.
- Use `org.gradle.configuration-cache=true` only after representative local/CI workflows pass.
- Treat warning mode and max-problems settings as migration aids, not release defaults; warning mode can store and reuse entries with reported problems and fails at 512 problems by default unless `org.gradle.configuration-cache.max-problems` changes the limit.
- Prefer `Task.notCompatibleWithConfigurationCache("because")` over persistent warning mode when one task cannot yet be repaired; if that task executes, Gradle discards configuration state at the end of the build.
- Do not copy Gradle-internal graceful-degradation services into external build logic; use public task incompatibility APIs and treat internal degradation as context for Gradle-owned tasks and features.
- Task-scoped incompatibility only matters when the task is in the requested graph; a task that is merely configured, hidden behind `-x`, or registered during execution should not by itself prevent storing a configuration-cache entry.
- Use read-only configuration cache only for ephemeral CI or probe jobs where misses cannot be reused; disable read-only mode when the build must write entries.
- Treat parallel configuration-cache load/store as incubating; `ConcurrentModificationException` during configuration is a compatibility signal, not a reason to ignore cache problems.
- Treat `STABLE_CONFIGURATION_CACHE` as a version-sensitive early opt-in. Verify current Gradle behavior before using it as a rollout gate, and do not rely on it to surface undeclared build-service usage because that check moved behind internal test-only coverage.
- Inject `BuildFeatures` when plugin code must react to configuration cache status; use `requested` for reporting and `active` for behavior changes instead of ad hoc command-line parsing.
- `BuildFeature.requested` is tri-state: explicit true, explicit false, or absent. Do not treat absence as false; `active` can differ because another feature enables configuration cache or another option disables it, and neither value proves a cache hit or miss.
- Track third-party plugin blockers separately from local build-logic repairs.

## Input Boundaries

- Gradle tracks many configuration inputs automatically, but build logic still needs supported APIs.
- Prefer wiring file contents to task properties with `providers.fileContents(...)`; files read directly and file system checks such as `File.exists()` during configuration can both invalidate cache entries.
- Treat unsafe input-ignore properties as temporary third-party-plugin workarounds, not repairs.
- Read environment variables and system properties through providers when they affect configuration; query concrete names or provider-backed prefixes because enumerating all values, including `.values()`, makes the whole set a configuration-cache input.
- Use provider-backed process APIs for simple configuration-time process output and `ValueSource` when input selection or parsing is more complex.
- Treat init scripts as first-class configuration-cache owners: command-line and Gradle user home init scripts are tracked by content and order, and direct external process starts from them are reported as init-script problems before project build logic is involved.
- `ValueSource` tracks the returned value, not every environment variable, file, process, or network read inside `obtain()`; do not use `BuildService` providers, or providers derived with `map`/`flatMap`, as configuration-time parameters to invalidate the cache.
- Do not implement `ValueSource.getParameters()` yourself; use `ValueSourceParameters.None` when no parameters are needed, and inject only supported services such as `ExecOperations`.
- `ValueSource` should return an effectively immutable value, and `obtain()` must stay fast because configuration-time queries run on every build to decide cache reuse; move slow, networked, or mutating work into task execution.
- Secrets used as configuration inputs can be serialized under `.gradle/configuration-cache`; prefer `GRADLE_USER_HOME/gradle.properties` with restricted access because Gradle fingerprints that file instead of storing its contents.

## Report-Driven Repair

- Open the generated configuration-cache HTML report and fix the first local build-logic owner named by the object graph; each problem links back to the relevant requirement or not-yet-implemented feature.
- Use both report views: grouped by message to find repeated API misuse and grouped by task to find the owning task or plugin.
- Separate problem severity from visibility: deferred, interrupting, incompatible-task-suppressed, and silently suppressed problems can all be present in the report, while only some fail the build or appear in the console summary.
- Classify detected configuration inputs before accepting a miss: system properties, environment variables, files, file-system checks, and value suppliers can all force a new configuration phase even when they do not affect the requested tasks; fix local eager reads or update/report plugins before using unsafe ignore properties as temporary relief.
- Gradle property sources can invalidate configuration cache entries even when the specific source is not listed in the report.
- Fix store-time problems first, then load-time problems.
- Treat "entry discarded" as evidence that reuse was prevented for this run. Fix the owner or declare a temporary incompatible task.
- When post-build output says configuration cache was disabled but the console summary has no problems, open the HTML report anyway; incompatible task or feature reasons can be suppressed from console output while still preventing storage.
- Keep secrets out of shared configuration-cache entries unless the environment supplies equivalent protection; when `GRADLE_USER_HOME` is shared across machines, provide a valid and stable `GRADLE_ENCRYPTION_KEY` across intended reuse boundaries.

## Task State Rules

- Task fields and task actions, including `doFirst` and `doLast`, must not reference live JVM state such as threads, sockets, classloaders, streams, or synchronization primitives.
- If Gradle 9.6+ reports a `java.util.concurrent` or `java.util.concurrent.locks` type such as `ReentrantLock`, `CountDownLatch`, or `SynchronousQueue` during configuration-cache storage, remove it from task state; use a shared build service for cross-task coordination instead of serializing synchronization primitives.
- Task actions must not use Gradle model objects such as `Project`, `Settings`, `Gradle`, `SourceSet`, `Configuration`, publications, or dependency results; Gradle 9.6+ also flags task dependency relationship getters, `Task.getExtensions()`, and injected `Project` or `Gradle` services at execution time.
- Replace `Configuration` task inputs with `FileCollection` or provider-backed resolution results that defer dependency resolution to the owning consumer.
- Replace `SourceDirectorySet` task inputs with `FileTree` or file properties when only files are needed.
- Replace resolved dependency result objects with provider-backed results such as `ResolutionResult.getRootComponent()` or `ArtifactCollection.getResolvedArtifacts()` when the task truly needs resolution metadata.
- Tasks must not inspect or mutate another task instance during execution; wire task outputs, inputs, or providers instead.
- Do not rely on reference identity for shared mutable standard collections after cache reload. Use task properties or shared build services.
- Task extensions, conventions, and extra properties must be read during configuration and copied into task properties, not accessed at execution time.
- Do not call build-script top-level methods or variables from task actions; move reusable execution logic into typed task classes or static helpers and wire data through task properties.
- Avoid custom Java serialization protocols in task state; configuration cache understands only some Java serialization hooks, they add cost, and broken protocols can surface later as misleading load failures.

## Common Repairs

- Replace execution-time `project.file(...)` with file properties wired during configuration.
- Replace task-action `project.files`, `project.fileTree`, `project.zipTree`, `project.tarTree`, `project.copy`, `project.sync`, `project.delete`, `project.exec`, and `project.javaexec` with task/file properties plus injected `ObjectFactory`, `ArchiveOperations`, `FileSystemOperations`, or `ExecOperations` as appropriate.
- If the warning names reading an injected `Project`, `Gradle`, or other disallowed service at execution time, remove the broad model service from the task action path; copy required scalar/provider values during configuration or inject a narrower execution service such as `ExecOperations` or `FileSystemOperations`.
- Replace `System.getenv(...)` or `System.getProperty(...)` reads during configuration with provider-backed reads.
- Replace simple external process reads during configuration with `providers.exec` or `providers.javaexec`; use `ValueSource` when the input selection is more complex.
- Treat configuration-time `providers.exec`, `providers.javaexec`, and `ValueSource` queries as cache-reuse checks, not memoized process results; keep them fast because they run on every build that evaluates cache validity.
- Replace `BuildListener`, `TaskExecutionListener`, `buildFinished`, and broad lifecycle callbacks with build services registered through `BuildEventsListenerRegistry` or Flow actions; task-completion listeners must use providers returned directly by `registerIfAbsent` or `getService`. Route details to [build-services-and-lifecycle.md](build-services-and-lifecycle.md).
- Replace task-to-task instance references with declared inputs, outputs, or provider values.
- Move complex ad hoc `doLast` closures into typed task classes when they need injection or validation.
- Isolate third-party plugin blockers from local build logic blockers so rollout can proceed per workflow.

## Testing

- Add TestKit coverage for plugin behavior that should support configuration cache; pass `--configuration-cache`, run the same scenario twice, and assert both store and reuse behavior.
- Use warning mode and max-problems limits only to explore blockers; remove them from release workflows.
- Use `-Dorg.gradle.configuration-cache.integrity-check=true` only for targeted serialization/cache-entry debugging; it can slow cache operations and cannot diagnose entries written before it was enabled.

## Rollout Checks

- Start rollout with `help`, then test ordinary verification, publishing dry-runs, and custom task workflows separately.
- Check IDE task execution separately from IDE sync/import.
- Keep a known opt-out command while migration is active, then remove it from release workflows once blockers are fixed.
