# Gradle Task Types And Validation

Read this when: custom task implementation, inputs/outputs, cacheability, validation annotations, or incremental input processing owns the change.

## Scope Boundary

- This file owns typed task contracts: task properties, annotations, validation problems, cacheability, and incremental inputs.
- Read [task-execution-and-options.md](task-execution-and-options.md) when task dependencies, ordering, finalizers, skipping, timeouts, or command-line task options own the change.
- Read [worker-api-and-processes.md](worker-api-and-processes.md) when task work needs Worker API isolation, worker daemon behavior, or work-action cancellation design.
- Read [external-processes.md](external-processes.md) when task work launches an external tool or needs process cancellation and cleanup design.

## Task Type Defaults

- Extend `DefaultTask` or a suitable Gradle task base type; use abstract task classes when exposing managed properties.
- For Gradle mutable types such as `Property<T>` and `ConfigurableFileCollection`, expose abstract/final getters and remove setters so Gradle can track value origin.
- Do not do expensive work in constructors or store live JVM state such as classloaders, threads, sockets, process handles, or synchronization primitives in task fields or action closures.
- Prefer annotated properties for task types you own; use runtime declarations for ad-hoc tasks or extra inputs/outputs on existing types. On Gradle 4.3+, `inputs.files(...).withNormalizer(ClasspathNormalizer::class.java)` or `CompileClasspathNormalizer` supplies classpath normalization, and `localState.register(...)` supplies local state. Nested bean traversal still requires `@Nested`; declare individual scalar inputs when using the runtime API.
- Task outputs must be files or directories; scalar task results belong in generated files, reports, or console output.
- Put work in `@TaskAction` methods.
- Do not use `Project`, `SourceSet`, `Configuration`, extension objects, or mutable Gradle model objects in task actions.
- Model behavior-affecting tools, environment, and command-line options as inputs; use services for shared resources, local-state declarations for disposable analysis, and destroyable declarations for paths removed by cleanup tasks.

## Inputs, Outputs, And Cacheability

- Declare every behavior-affecting input and output.
- Use path sensitivity and normalization for file inputs. If file location is not part of task behavior, use `@PathSensitive(NONE)` for individual file inputs and `@PathSensitive(RELATIVE)` for directory/tree inputs; missing path sensitivity defaults toward absolute paths and hurts relocatability.
- Use `@Internal` only when the value truly does not affect outputs.
- Mark tasks cacheable only after outputs are deterministic and relocatable enough for the intended cache. On Gradle 9.8.1, `@CacheableTask` is not inherited by task subclasses; annotate each concrete type whose outputs meet the contract.
- On Gradle 7.3+, use `@UntrackedTask(because = "...")` or `Task.doNotTrackState(...)` when Gradle cannot safely snapshot task state, such as remote state, unreadable files, or an external tool that owns up-to-date checks; untracked tasks are never up-to-date, never cached, and cannot use `InputChanges`.
- Prefer built-in task types (`Copy`, `Sync`, `Zip`, `JavaExec`, `Test`, `JacocoReport`) when they already model the work; read [file-operations-and-archives.md](file-operations-and-archives.md) for copy/archive/delete specifics.
- Wire provider-backed values with `map` or `flatMap` instead of `get()` during configuration so Gradle keeps value provenance and implicit task dependencies.
- Use unique output directories or files per task; shared outputs break up-to-date and cache reasoning.

## Annotation Choices

- Use `@Input` for scalar values affecting work, `@InputFile`/`@InputDirectory`/`@InputFiles` for file inputs, and `@OutputFile`/`@OutputDirectory` for produced files.
- Use `@OutputFiles` or `@OutputDirectories` only when the task owns a collection of outputs; prefer one file/directory property for a single product. On Gradle 9.8.1, directory-backed `FileTree` collections disable caching, while archive-backed trees are rejected as outputs; declare the produced archive file instead.
- Use `@Classpath` for runtime classpaths: classpath entry order and semantic content, including resources, affect the fingerprint, while archive timestamps and entry order do not.
- Use `@CompileClasspath` for Java compile classpaths when only ABI-relevant class changes should invalidate work; resources and implementation-only changes are ignored.
- Use `@LocalState` for disposable task-owned analysis; Gradle removes it when loading outputs from cache, so a later execution must tolerate its absence. Use `@Destroys` for cleanup tasks and `@Nested` for nested beans. On Gradle 9.8.1, resolved destroyable paths cannot coexist with file inputs, output paths, or local-state paths; scalar input options are allowed. Split cleanup from production.
- Use `@SkipWhenEmpty` or `@Incremental` on file inputs whose changes will be queried through `InputChanges`.
- `@InputDirectory` already ignores empty directories; add `@IgnoreEmptyDirectories` to `@InputFiles`, `@SkipWhenEmpty`, or transform inputs when directory entries themselves do not affect the output.
- On Gradle 7.2+, use `@NormalizeLineEndings` for text inputs where CRLF/LF differences should not invalidate up-to-date or cache keys. It handles ASCII-compatible encodings such as UTF-8; UTF-16 and binary files retain byte-sensitive fingerprints.
- Use `@Console` only for values that affect console output but not outputs, and `@ReplacedBy` only for migration bridges that should not affect up-to-date checks.
- For Gradle's `WriteProperties` task on Gradle 9+, use `destinationFile`; the old `outputFile` property is removed.
- On Gradle 8.0+, use `@ServiceReference` on a `Property<MyBuildService>` when a shared build service is part of task behavior; it declares service use without an extra `usesService(...)` call. On Gradle 9.8.1, name the service when type lookup is ambiguous, or assign the property explicitly.
- Do not mark a build service as task input, output, local state, or destroyable state. Use `@ServiceReference`, or `@Internal` plus explicit `usesService(...)` when automatic reference matching does not fit.

## Incremental Work

- Use incremental inputs when processing changed files is materially cheaper.
- On Gradle 5.4+, a task may have only one `@TaskAction` accepting a single `InputChanges` parameter; mark the file inputs you will query with `@Incremental` or `@SkipWhenEmpty`. Ordinary actions take no parameters. On Gradle 9.8.1, annotated overloads sharing a method name are rejected even when one is non-incremental.
- Declare every produced file or directory so Gradle owns cleanup, up-to-date checks, and cache behavior. Gradle 5.4 through 5.6 permits `InputChanges` without outputs, with a warning in 5.6; Gradle 6.0+ requires an output declaration or an `outputs.upToDateWhen(...)` predicate, including verified Gradle 8.0 and 9.8.1. On 9.8.1, an inherited optional output property still counts as declared even when unset; this does not make unmodeled output files safe or cacheable.
- `@SkipWhenEmpty` implies `@Incremental` and additionally makes the annotated properties source inputs. When all such inputs are empty, Gradle skips the task actions and cleans previous owned outputs; no cleanup work reports `NO-SOURCE`, while deleting stale outputs can count as non-incremental execution. Use plain `@Incremental` when emptiness alone must not skip the action.
- Query changes from stable file property instances such as `RegularFileProperty`, `DirectoryProperty`, or `ConfigurableFileCollection`. On Gradle 9.8.1, two incremental properties with equal raw `File` values fail during property lookup setup; two distinct managed properties may point at the same file.
- Query only the exact properties marked `@Incremental` or `@SkipWhenEmpty`; asking `getFileChanges(...)` about another file input fails instead of producing a full change set.
- Keep incremental logic correct for added, modified, and removed files. A removed `FileChange.file` may no longer exist; use `fileType` for its former type and map its path to the owned output. `normalizedPath` follows the input normalization strategy; `RELATIVE` preserves directory structure, while `NONE` cannot supply an output-relative path and may report modifications as `REMOVED` plus `ADDED`.
- When `InputChanges.isIncremental()` is false, Gradle removes previous outputs owned by the task before the action and reports every current incremental input as `ADDED`; rebuild from the current inputs rather than expecting `REMOVED` events from the prior snapshot.
- Expect non-incremental execution when history is missing, the task implementation or Gradle version changes, `--rerun-tasks` is used, `upToDateWhen` returns false, non-incremental inputs change, output locations change, or outputs are edited or removed externally.
- Do not confuse incremental execution with build-cache correctness.
- Test clean, up-to-date, cache-hit, and changed-input paths separately.

## Validation Problem Map

- Missing normalization: add `@PathSensitive`, `@Classpath`, or `@CompileClasspath` that matches the input semantics. On Gradle 9.8.1, `@NormalizeLineEndings` is an additional modifier and does not satisfy this validation requirement by itself.
- Required value missing: set a convention, require user input, or make the property optional only when absent values are valid.
- File type mismatch: use `@InputFile` for regular files and `@InputDirectory` for directories; do not hide a directory behind scalar `@Input`.
- Missing input file: wire the producer output or use a file collection when missing paths are valid. `@Optional` permits an unset value; a configured `@InputFile` or `@InputDirectory` still has to exist and have the right type on Gradle 9.8.1.
- Cannot write output: align the output annotation and configured path shape; `@OutputFile` must point at a file path, `@OutputDirectory`/directory collections must point at directories, every parent must be a directory, and task outputs must not target Gradle-managed reserved locations.
- Properties without annotations: annotate every behavior-affecting property or mark it `@Internal` with intent.
- Prefer annotations on public property getters. On Gradle 9.8.1, a field annotation is recognized when the field has a matching getter; a getter annotation wins a same-category conflict, which is still reported. Fields without getters, private getters, setters, and non-property methods do not supply usable input/output contracts.
- In Kotlin task classes, use getter use-site targets such as `@get:InputFile`; otherwise the annotation may land somewhere Gradle does not inspect.
- Boolean properties must not expose both `getX()` and `isX()` as annotated getters; remove one or mark one `@Internal`.
- Mutable Gradle property types must not have setters that replace the property object; mutate the existing property value with `set`, `convention`, or collection mutation APIs.
- `@Optional` modifies a supported property annotation; on Gradle 9.8.1 this includes `@Nested` and `@ServiceReference` as well as inputs/outputs. An absent optional service may be read with `getOrNull()`; `get()` still fails. Use `@Internal` to exclude a property from validation and tracking; do not combine it with `@Optional`, or put `@Optional` on primitive properties.
- `@ServiceReference` on a non-build-service property: make the referenced type implement `BuildService`, or replace the annotation with `@Internal` and assign the value explicitly when it is not a shared build service.
- Implicit dependency validation usually means a consumer used a raw file path such as `archivePath` instead of a provider-backed producer output such as `archiveFile`, a task provider, or the producing task itself.
- Missing reason for not caching: use `@CacheableTask` only when safe, otherwise add `@DisableCachingByDefault(because = "...")`.
- Unsupported value or implementation type: split `ResolvedArtifactResult` into supported metadata inputs and input files, prefer `URI` over `URL`, and replace non-serializable lambdas or implementations loaded by classloaders unknown to Gradle. For `@Nested`, use a custom type whose behavior-affecting properties are annotated; Java SE types, Kotlin standard-library types, and Groovy `GString` are not nested models. Keep nested map keys to `String`, `Integer`, or enum values.
- Disallowed Gradle model object in task action: extract the needed scalar, file collection, provider, or service during configuration and expose it as a task property.
- Direct access to another task instance during execution: wire producer outputs through `TaskProvider` and providers during configuration, then read the consumer's own input properties in its action. Do not call another task's methods from the action.

## Common Failures

- `Execution optimizations have been disabled...` means task or work validation produced warnings; Gradle deduplicates and truncates those problems, reports them as deprecations, and disables optimizations for correctness, so fix the underlying property or annotation problem before investigating cache misses or up-to-date failures.
- Hidden eager task realization through Groovy DSL task blocks.
- Calling `Provider.get()` during configuration to pass values to provider-aware APIs.
- Resolving configurations during configuration.
- Calling JDK/Groovy/Kotlin collection APIs such as `isEmpty`, `size`, `toList`, `getFiles`, `asPath`, or `+` on `Configuration`/`FileCollection` during configuration because they can resolve dependencies and drop implicit task dependencies.
- Passing already-resolved collections into `Copy`, `Zip`, or other `AbstractCopyTask` inputs hides the same eager-resolution problem; pass provider-backed task outputs or file collections directly.
- Writing into shared directories or producing generated files without modeled outputs.
- Using global singletons for shared state instead of build services.
- Relying on reference identity for mutable collections after configuration cache reload.
- Marking individual task instances cacheable with `outputs.cacheIf` when the task type's cacheability is stable; prefer `@CacheableTask` or `@DisableCachingByDefault`.
