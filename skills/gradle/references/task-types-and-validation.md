# Gradle Task Types And Validation

Read this when: custom task implementation, inputs/outputs, cacheability, validation annotations, or incremental input processing owns the change.

## Scope Boundary

- This file owns typed task contracts: task properties, annotations, validation problems, cacheability, and incremental inputs.
- Read [task-execution-and-options.md](task-execution-and-options.md) when task dependencies, ordering, finalizers, skipping, timeouts, or command-line task options own the change.
- Read [worker-api-and-processes.md](worker-api-and-processes.md) when task work needs Worker API isolation, worker daemon behavior, process-level isolation, or cancellation design.

## Task Type Defaults

- Extend `DefaultTask` or a suitable Gradle task base type; use abstract task classes when exposing managed properties.
- For Gradle mutable types such as `Property<T>` and `ConfigurableFileCollection`, expose abstract/final getters and remove setters so Gradle can track value origin.
- Do not do expensive work in constructors or store live JVM state such as classloaders, threads, sockets, process handles, or synchronization primitives in task fields or action closures.
- Expose inputs and outputs as annotated Gradle properties, file properties, or file collections; reserve the runtime `inputs`/`outputs` API for ad-hoc tasks or task types you cannot change because it lacks nested, classpath, local-state, internal, and replaced-by equivalents.
- Task outputs must be files or directories; scalar task results belong in generated files, reports, or console output.
- Put work in `@TaskAction` methods.
- Do not use `Project`, `SourceSet`, `Configuration`, extension objects, or mutable Gradle model objects in task actions.
- Model external tools, environment, command-line options, local state, and destroyed paths as tracked inputs or services.

## Inputs, Outputs, And Cacheability

- Declare every behavior-affecting input and output.
- Use path sensitivity and normalization for file inputs. If file location is not part of task behavior, use `@PathSensitive(NONE)` for individual file inputs and `@PathSensitive(RELATIVE)` for directory/tree inputs; missing path sensitivity defaults toward absolute paths and hurts relocatability.
- Use `@Classpath` or runtime classpath normalization for classpaths where appropriate.
- Use `@Internal` only when the value truly does not affect outputs.
- Mark tasks cacheable only after outputs are deterministic and relocatable enough for the intended cache.
- Prefer built-in task types (`Copy`, `Sync`, `Zip`, `JavaExec`, `Test`, `JacocoReport`) when they already model the work; read [file-operations-and-archives.md](file-operations-and-archives.md) for copy/archive/delete specifics.
- Wire provider-backed values with `map` or `flatMap` instead of `get()` during configuration so Gradle keeps value provenance and implicit task dependencies.
- Use unique output directories or files per task; shared outputs break up-to-date and cache reasoning.

## Annotation Choices

- Use `@Input` for scalar values affecting work, `@InputFile`/`@InputDirectory`/`@InputFiles` for file inputs, and `@OutputFile`/`@OutputDirectory` for produced files.
- Use `@OutputFiles` or `@OutputDirectories` only when the task really owns a collection of outputs; avoid `FileTree` outputs because they disable caching, and prefer one file/directory property for a single product.
- Use `@Classpath` for JVM classpaths where order and ABI matter.
- Use `@CompileClasspath` for Java compilation classpaths when appropriate.
- Use `@LocalState` for task-owned state that should not be cached, `@Destroys` for destructive tasks, and `@Nested` for nested beans that expose their own annotated properties.
- Use `@SkipWhenEmpty` or `@Incremental` on file inputs whose changes will be queried through `InputChanges`.
- Use `@IgnoreEmptyDirectories` when directory entries themselves do not affect the output.
- Use `@NormalizeLineEndings` for text inputs where CRLF/LF differences should not invalidate up-to-date or cache keys.
- Use `@Console` only for values that affect console output but not outputs, and `@ReplacedBy` only for migration bridges that should not affect up-to-date checks.
- For Gradle's `WriteProperties` task on Gradle 9+, use `destinationFile`; the old `outputFile` property is removed.
- Use `@ServiceReference` when a shared build service is part of task behavior.
- Do not mark a build service as an input. Use `@ServiceReference`, or `@Internal` plus explicit `usesService` when automatic reference matching does not fit.

## Incremental Work

- Use incremental inputs when processing changed files is materially cheaper.
- A task may have only one incremental `@TaskAction`, and that action takes a single `InputChanges` parameter.
- Query changes from stable file property instances such as `RegularFileProperty`, `DirectoryProperty`, or `ConfigurableFileCollection`.
- Keep incremental logic correct for added, modified, and removed files.
- Fall back to full processing when `InputChanges.isIncremental()` is false; Gradle reports all input files as added in that mode.
- Expect non-incremental execution when history is missing, Gradle version changes, `upToDateWhen` returns false, non-incremental inputs change, or outputs are edited externally.
- Do not confuse incremental execution with build-cache correctness.
- Test clean, up-to-date, cache-hit, and changed-input paths separately.

## Validation Problem Map

- Missing normalization: add path sensitivity, classpath annotation, or line ending normalization that matches the input semantics.
- Required value missing: set a convention, require user input, or make the property optional only when absent values are valid.
- File type mismatch: use `@InputFile` for regular files and `@InputDirectory` for directories; do not hide a directory behind scalar `@Input`.
- Missing input file: wire the producer task output or use a non-failing file collection only when the file is genuinely optional.
- Properties without annotations: annotate every behavior-affecting property or mark it `@Internal` with intent.
- Annotations on fields, private getters, or non-property methods are usually ignored; annotate public property getters instead.
- In Kotlin task classes, use getter use-site targets such as `@get:InputFile`; otherwise the annotation may land somewhere Gradle does not inspect.
- Boolean properties must not expose both `getX()` and `isX()` as annotated getters; remove one or mark one `@Internal`.
- Mutable Gradle property types must not have setters that replace the property object; mutate the existing property value with `set`, `convention`, or collection mutation APIs.
- `@Optional` is only a modifier on an input/output property. Use `@Internal` when a property should not participate in validation or up-to-date checks; do not combine `@Internal` with `@Optional`, and do not put `@Optional` on primitive properties.
- Implicit dependency validation usually means a consumer used a raw file path such as `archivePath` instead of a provider-backed producer output such as `archiveFile`, a task provider, or the producing task itself.
- Missing reason for not caching: use `@CacheableTask` only when safe, otherwise add `@DisableCachingByDefault(because = "...")`.
- Unsupported value type: map Gradle resolution results, `java.net.URL`, nested maps, lambdas, classloader-owned implementation objects, and nested objects to stable supported input types before exposing them to tasks. Prefer `URI` over `URL`; keep nested map keys to `String`, `Integer`, or enum values.
- Disallowed Gradle model object in task action: extract the needed scalar, file collection, provider, or service during configuration and expose it as a task property.
- Direct access to another task instance: replace it with declared inputs, outputs, `TaskProvider`, or provider values.

## Common Failures

- Hidden eager task realization through Groovy DSL task blocks.
- Calling `Provider.get()` during configuration to pass values to provider-aware APIs.
- Resolving configurations during configuration.
- Calling JDK/Groovy/Kotlin collection APIs such as `isEmpty`, `size`, `toList`, `getFiles`, `asPath`, or `+` on `Configuration`/`FileCollection` during configuration because they can resolve dependencies and drop implicit task dependencies.
- Passing already-resolved collections into `Copy`, `Zip`, or other `AbstractCopyTask` inputs hides the same eager-resolution problem; pass provider-backed task outputs or file collections directly.
- Writing into shared directories or producing generated files without modeled outputs.
- Using global singletons for shared state instead of build services.
- Relying on reference identity for mutable collections after configuration cache reload.
- Marking individual task instances cacheable with `outputs.cacheIf` when the task type's cacheability is stable; prefer `@CacheableTask` or `@DisableCachingByDefault`.
