# Gradle Task Types And Validation

Read this when: custom task implementation, inputs/outputs, cacheability, validation annotations, Worker API, task options, or task relationships owns the change.

## Task Type Defaults

- Extend `DefaultTask` or a suitable Gradle task base type.
- Use abstract task classes when exposing managed properties.
- For Gradle mutable types such as `Property<T>` and `ConfigurableFileCollection`, expose abstract/final getters and remove setters so Gradle can track value origin.
- Do not do expensive work in constructors.
- Expose inputs and outputs as Gradle properties, file properties, or file collections.
- Put work in `@TaskAction` methods.
- Do not use `Project`, `SourceSet`, `Configuration`, extension objects, or mutable Gradle model objects in task actions.
- Model external tools, environment, command-line options, local state, and destroyed paths as tracked inputs or services.
- Do not store live JVM state such as classloaders, threads, sockets, process handles, or synchronization primitives in task fields or action closures.

## Inputs, Outputs, And Cacheability

- Declare every behavior-affecting input and output.
- Use path sensitivity and normalization for file inputs.
- Use `@Classpath` or runtime classpath normalization for classpaths where appropriate.
- Use `@Internal` only when the value truly does not affect outputs.
- Mark tasks cacheable only after outputs are deterministic and relocatable enough for the intended cache.
- Prefer built-in task types (`Copy`, `Sync`, `Zip`, `JavaExec`, `Test`, `JacocoReport`) when they already model the work.
- Use unique output directories or files per task; shared outputs break up-to-date and cache reasoning.

## Annotation Choices

- Use `@Input` for scalar values affecting work.
- Use `@InputFile`, `@InputDirectory`, or `@InputFiles` for file inputs.
- Use `@OutputFile` or `@OutputDirectory` for produced files.
- Use `@Classpath` for JVM classpaths where order and ABI matter.
- Use `@CompileClasspath` for Java compilation classpaths when appropriate.
- Use `@LocalState` for task-owned state that should not be cached.
- Use `@Destroys` for destructive tasks.
- Use `@ServiceReference` when a shared build service is part of task behavior.
- Do not mark a build service as an input. Use `@ServiceReference`, or `@Internal` plus explicit `usesService` when automatic reference matching does not fit.

## Incremental Work

- Use incremental inputs when processing changed files is materially cheaper.
- Keep incremental logic correct for added, modified, and removed files.
- Fall back to full processing when Gradle cannot provide incremental changes.
- Do not confuse incremental execution with build-cache correctness.
- Test clean, up-to-date, cache-hit, and changed-input paths separately.

## Task Relationships

- Use provider wiring and task outputs to imply dependencies when one task consumes another task's output.
- Use `dependsOn` for required work, `finalizedBy` for cleanup/finalization, and `mustRunAfter`/`shouldRunAfter` for ordering only.
- Do not use ordering rules to compensate for missing declared inputs and outputs.
- Avoid broad task graph callbacks for ordinary wiring.
- If Gradle reports implicit dependencies, replace raw `File` or path wiring with task providers, output properties, or the producing task as an input.

## Worker API And Processes

- Use Worker API for isolated, parallelizable units of task work.
- Choose `noIsolation()` for fastest work with shared classloader risk.
- Choose `classLoaderIsolation()` when work needs an isolated classpath.
- Choose `processIsolation()` when work needs a separate JVM or process-level state; expect higher startup cost and worker-daemon reuse within the build.
- Pass serializable parameters to work actions, not `Project` or task instances.
- Use injected `ExecOperations` or `JavaLauncher`/tool providers for process execution.
- Capture outputs and exit behavior deliberately; avoid shell-specific assumptions unless the task is explicitly shell-owned.
- Check build-service compatibility before passing services into isolated worker modes.

## Validation Problem Map

- Missing normalization: add path sensitivity, classpath annotation, or line ending normalization that matches the input semantics.
- Required value missing: set a convention, require user input, or make the property optional only when absent values are valid.
- File type mismatch: use `@InputFile` for regular files and `@InputDirectory` for directories; do not hide a directory behind scalar `@Input`.
- Missing input file: wire the producer task output or use a non-failing file collection only when the file is genuinely optional.
- Properties without annotations: annotate every behavior-affecting property or mark it `@Internal` with intent.
- `@Optional` is only a modifier on an input/output property. Use `@Internal` when a property should not participate in validation or up-to-date checks.
- Missing reason for not caching: use `@CacheableTask` only when safe, otherwise add `@DisableCachingByDefault(because = "...")`.
- Unsupported value type: map Gradle resolution results, URLs, nested maps, and nested objects to stable supported input types before exposing them to tasks.
- Disallowed Gradle model object in task action: extract the needed scalar, file collection, provider, or service during configuration and expose it as a task property.
- Direct access to another task instance: replace it with declared inputs, outputs, `TaskProvider`, or provider values.

## Common Failures

- Hidden eager task realization through Groovy DSL task blocks.
- Calling `Provider.get()` during configuration to pass values to provider-aware APIs.
- Resolving configurations during configuration.
- Writing into shared directories.
- Producing generated files without modeled outputs.
- Using global singletons for shared state instead of build services.
- Relying on reference identity for mutable collections after configuration cache reload.

## Source Calibration

Primary upstream pages: Implementing Custom Tasks, Dealing with Validation Problems, Worker API, Custom Tasks, Incremental Build, Controlling Task Execution, Task Configuration Avoidance, Configuration Cache Requirements.
