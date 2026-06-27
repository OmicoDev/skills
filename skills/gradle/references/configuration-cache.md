# Gradle Configuration Cache

Read this when: enabling, diagnosing, repairing, or rolling out Gradle configuration cache.

## Model

- Configuration cache stores the configured task graph and build-logic state for a requested task set.
- Cache entries are invalidated by relevant build configuration inputs: scripts, settings, init scripts, system properties, environment, files read during configuration, Gradle version, and build logic.
- First run stores an entry and loads from it for execution; later compatible runs reuse it and skip much configuration work.
- The feature is not enabled by default; treat adoption as a compatibility rollout, not a formatting change.
- IDE task execution support and IDE sync/import behavior are separate boundaries.
- Isolated Projects builds on configuration-cache infrastructure, but project isolation violations and cache reuse failures are different symptoms; read [isolated-projects.md](isolated-projects.md) when cross-project mutable access or IDE model caching owns the issue.
- The cache entry is local project state under `.gradle/configuration-cache`; do not treat deleting it as a durable repair.
- Configuration cache can be reused by local hot and cold daemons, but it is not a shared cache between developers or CI machines.

## Enablement

- Test representative commands before making it default.
- Use `--configuration-cache` for focused trials.
- Use `--dry-run` with configuration cache to expose configuration-time problems before task actions add noise.
- Use `org.gradle.configuration-cache=true` only after representative local/CI workflows pass.
- Treat warning mode and max-problems settings as migration aids, not release defaults; warning mode fails at 512 problems by default unless `org.gradle.configuration-cache.max-problems` changes the limit.
- Warning mode can still store and reuse entries with reported problems; manually invalidate during exploration if behavior becomes surprising.
- Prefer `Task.notCompatibleWithConfigurationCache("because")` over persistent warning mode when one task cannot yet be repaired; if that task executes, Gradle discards configuration state at the end of the build.
- Use read-only configuration cache only for ephemeral CI or probe jobs where misses cannot be reused; disable read-only mode when the build must write entries.
- Treat parallel configuration-cache load/store as incubating; `ConcurrentModificationException` during configuration is a compatibility signal, not a reason to ignore cache problems.
- Treat `STABLE_CONFIGURATION_CACHE` as a version-sensitive early opt-in. Verify current Gradle behavior before using it as a rollout gate, and do not rely on it to surface undeclared build-service usage because that check moved behind internal test-only coverage.
- Inject `BuildFeatures` when plugin code must react to configuration cache status; use `requested` for reporting and `active` for behavior changes, not ad hoc command-line parsing.
- Track third-party plugin blockers separately from local build-logic repairs.

## Input Boundaries

- Gradle tracks many configuration inputs automatically, but build logic still needs supported APIs.
- Prefer wiring file contents to task properties with `providers.fileContents(...)`; files read directly and file system checks such as `File.exists()` during configuration can both invalidate cache entries.
- Treat unsafe input-ignore properties as temporary third-party-plugin workarounds, not repairs.
- Read environment variables and system properties through providers when they affect configuration; query concrete names or provider-backed prefixes because enumerating all values makes the whole set an input.
- Use provider-backed process APIs for simple configuration-time process output and `ValueSource` when input selection or parsing is more complex.
- `ValueSource` tracks the returned value, not every environment variable, file, process, or network read inside `obtain()`.
- Do not implement `ValueSource.getParameters()` yourself; use `ValueSourceParameters.None` when no parameters are needed, and inject only supported services such as `ExecOperations`.
- `ValueSource` should return an effectively immutable value, and `obtain()` must stay fast because configuration-time queries run on every build to decide cache reuse.
- Secrets need care because configuration cache can persist model state.

## Report-Driven Repair

- Open the generated configuration-cache HTML report and fix the first local build-logic owner named by the object graph; each problem links back to the relevant requirement or not-yet-implemented feature.
- Use both report views: grouped by message to find repeated API misuse and grouped by task to find the owning task or plugin.
- Review detected configuration inputs in the report before deciding whether a cache miss is expected; system properties, environment variables, files, and value suppliers can all explain a new configuration phase.
- Gradle property sources can invalidate configuration cache entries even when the specific source is not listed in the report.
- Fix store-time problems first, then load-time problems.
- Treat "entry discarded" as evidence that reuse was prevented for this run. Fix the owner or declare a temporary incompatible task; deleting `.gradle/configuration-cache` only removes evidence.
- Keep secrets out of serialized model state; follow Gradle's encryption-key guidance when credentials must participate.
- If shared environments provide configuration-cache encryption keys, keep `GRADLE_ENCRYPTION_KEY` stable across intended reuse boundaries.

## Task State Rules

- Task fields and task actions, including `doFirst` and `doLast`, must not reference live JVM state such as threads, sockets, classloaders, streams, or synchronization primitives.
- Task actions must not use Gradle model objects such as `Project`, `Settings`, `Gradle`, `SourceSet`, `Configuration`, publications, or dependency results.
- Replace `Configuration` task inputs with `FileCollection` or provider-backed resolution results that defer dependency resolution to the owning consumer.
- Replace `SourceDirectorySet` task inputs with `FileTree` or file properties when only files are needed.
- Replace resolved dependency result objects with provider-backed results such as `ResolutionResult.getRootComponent()` or `ArtifactCollection.getResolvedArtifacts()` when the task truly needs resolution metadata.
- Tasks must not inspect or mutate another task instance during execution; wire task outputs, inputs, or providers instead.
- Do not rely on reference identity for shared mutable standard collections after cache reload. Use task properties or shared build services.
- Task extensions, conventions, and extra properties must be read during configuration and copied into task properties, not accessed at execution time.

## Common Repairs

- Replace execution-time `project.file(...)` with file properties wired during configuration.
- Replace task-action `project.files`, `project.fileTree`, `project.zipTree`, `project.tarTree`, `project.copy`, `project.sync`, `project.delete`, `project.exec`, and `project.javaexec` with task/file properties plus injected `ObjectFactory`, `ArchiveOperations`, `FileSystemOperations`, or `ExecOperations` as appropriate.
- Replace `System.getenv(...)` or `System.getProperty(...)` reads during configuration with provider-backed reads.
- Replace simple external process reads during configuration with `providers.exec` or `providers.javaexec`; use `ValueSource` when the input selection is more complex.
- Treat configuration-time `providers.exec`, `providers.javaexec`, and `ValueSource` queries as cache-reuse checks, not memoized process results; keep them fast because they run on every build that evaluates cache validity.
- Replace `BuildListener`, `TaskExecutionListener`, `buildFinished`, and broad lifecycle callbacks with build services registered through `BuildEventsListenerRegistry` or Flow actions; only pass supported `BuildService` providers to task-completion listeners. Route details to [build-services-and-lifecycle.md](build-services-and-lifecycle.md).
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

## Source Calibration

Primary upstream pages: Configuration Cache, Configuration Cache Requirements, Debugging and Troubleshooting the Configuration Cache, Isolated Projects.
