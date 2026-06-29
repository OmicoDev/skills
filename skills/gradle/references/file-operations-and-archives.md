# Gradle File Operations And Archives

Read this when: file paths, `FileCollection`, `FileTree`, `CopySpec`, `Copy`, `Sync`, `Delete`, archive tasks, unpacking archives, permissions, or reproducible archive output owns the change.

## Path And Collection Ownership

- Prefer task outputs, task properties, and layout providers over hard-coded paths.
- Use `layout.projectDirectory` for project-owned input paths and `layout.buildDirectory` for generated outputs.
- Use `layout.settingsDirectory` when a path must be relative to the settings directory rather than the current project.
- Avoid `new File("relative")` in build logic; it is relative to the process current working directory, not Gradle's project model.
- Use `ProjectLayout.files(...)` or file properties to normalize accepted file notations and preserve provider wiring.
- `FileCollection` is a flat set of files; `FileTree` is a hierarchy with a shared root and relative paths.
- Do not use `FileTree` when file order is part of task behavior; it has no guaranteed stable order, so sort deliberately before order-sensitive processing.
- Combined and filtered file collections are live. Do not iterate, call `files`, `asPath`, `isEmpty`, or `size` during configuration when the collection may resolve dependencies or task outputs.
- Implicit conversion to file collections is task/API-specific. When unsure, pass an explicit `files(...)`, `fileTree(...)`, `DirectoryProperty`, or `RegularFileProperty`.
- Custom task methods that accept file inputs should append to an annotated file property rather than replace it; accepting `TaskProvider` or provider-backed file notation preserves inferred task dependencies.
- `fileTree(...)` applies Ant default excludes and Gradle cannot change those defaults during task execution. Change defaults in settings before file trees are created, or diagnose missing dotfiles and VCS metadata there first.

## Copy And Sync

- Prefer `Copy`, `Sync`, archive tasks, or plugin-provided task types before writing manual filesystem work.
- Use one root `into(...)` for filesystem copy destinations. Nested `into(...)` calls are child specs relative to that root.
- Use child `from(...)` or `into(...)` specs when filters, renames, destinations, or permissions apply only to a subset.
- Child copy specs inherit destination paths, include/exclude patterns, copy actions, renames, and filters from parent specs; place filters and renames at the narrowest spec that owns them.
- `CopySpec.with(...)` behaves like adding another `from(...)`; share complete specs only when the spec already owns at least one source.
- Directory paths passed to `from(...)` copy the directory contents, not the directory itself. Include the directory name explicitly when the destination should contain that top-level directory.
- Non-existent paths passed to `from(...)` are ignored. If absence should fail the build, model the source as a required task input or add an explicit validation step.
- Include/exclude patterns apply to the owning copy spec: no includes means everything is eligible, at least one include narrows the set, and exclusions override inclusions.
- Duplicate relative paths in a copy spec or archive fail unless `duplicatesStrategy` is set. Prefer fixing the sources or applying a narrow strategy on the child spec that owns the duplicate.
- `rename(...)` changes copied file names, not the owning directory topology; use child `into(...)` or `eachFile` when the relative path needs to move, and keep rename closures cheap because they run for each copied file.
- Treat `filter(...)` and `expand(...)` sources as text and set `filteringCharset`; otherwise the JVM default charset can make transformed outputs host-dependent.
- Use `expand(...)` only when Groovy template semantics are intended. It evaluates `${...}` expressions, so choose a narrower token filter when the input should be literal text with simple placeholders.
- `Copy` does not remove stale files already in the destination. Use `Sync` when the destination must be an exact mirror, and keep that destination task-owned or intentionally managed.
- `Sync` is a destructive copy: it removes files in the destination that were not copied. Restrict its destination to task-owned build output or an intentionally managed install directory.
- When a `Copy` task deploys a single file into an unmanaged system or application-server directory that may contain unrelated, unreadable, or pipe-like files, mark that dedicated task with `doNotTrackState("reason")` instead of letting Gradle snapshot the whole destination.
- Treat `doNotTrackState` as an explicit untracked-task tradeoff: the task is always out of date, cannot use incremental `InputChanges`, and is not stored in or loaded from the build cache.
- Use `FileSystemOperations.copy` or `sync` in typed tasks that must copy during execution. Avoid `Project.copy` and `Project.sync` in task actions because they are not configuration-cache compatible and do not infer task dependencies for action-time sources.
- If a custom task copies files internally, declare the copy sources, destination, filters, and behavior-affecting options as task inputs/outputs.

## Delete, Move, And Directories

- Prefer `Delete` tasks or `FileSystemOperations.delete` for modeled deletion; avoid ad hoc `File.delete` loops.
- In task actions, inject `FileSystemOperations.delete` instead of calling `Project.delete`; the project method is another execution-time `Project` access and breaks configuration-cache compatibility.
- Filter delete inputs with `FileCollection` or `FileTree`; copy-style include/exclude blocks are not the delete model.
- Avoid Java `File.renameTo()` for build moves because behavior is platform-specific and poorly modeled. Prefer copy/sync plus explicit cleanup when a move is build-owned.
- Let Gradle create task output directories from declared outputs. Manual `mkdir` work usually means the output owner is not modeled.

## Archives

- Archive tasks are copy specs whose destination is the archive file. Prefer plugin-provided `jar`, distribution, or publication tasks when they own the artifact.
- Archive task names do not determine archive file names. Use `archiveBaseName`, `archiveAppendix`, `archiveVersion`, `archiveClassifier`, `archiveExtension`, `archiveFileName`, and `destinationDirectory`.
- Consume archives through the `archiveFile` provider rather than reconstructing `destinationDirectory` plus `archiveFileName`; the provider preserves conventions and task dependencies.
- The Base Plugin supplies archive naming and destination conventions; configure its `base` extension when the convention should affect all archive tasks.
- Treat the Base Plugin's `archives`, `default`, and `Configuration.visible` surfaces as legacy compatibility, not new assembly or dependency APIs; wire `assemble` explicitly to artifact-producing task providers instead.
- On Gradle 9+, custom outgoing artifacts are not implicitly built by `assemble`; wire `assemble` to the artifact's task provider or `configuration.artifacts` when the artifact belongs to the lifecycle task.
- On Gradle 9+, projects that combine Java, War, and Ear packaging can build and add all related artifacts to `archives`; verify lifecycle output before relying on older package-plugin suppression behavior.
- Use `zipTree(...)` and `tarTree(...)` to treat archives as `FileTree`s for unpacking or repackaging. JAR, WAR, and EAR files are ZIPs for this purpose.
- In typed tasks or execution-time code, inject `ArchiveOperations` for `zipTree` and `tarTree`; avoid `Project.zipTree` and `Project.tarTree` from task actions.
- When remapping paths from an unpacked archive with `eachFile`, disable `includeEmptyDirs` if empty directories remain; `eachFile` cannot change empty directory destinations.
- Prefer a maintained plugin such as Shadow for fat JARs. Manual `zipTree(configurations.runtimeClasspath...)` needs duplicate handling, service file merging, signatures, and metadata review.

## Plugin-Owned Packages

- Use the Distribution plugin for application-style ZIP/TAR/install layouts instead of hand-rolled archive tasks. `distribution-base` owns the `distributions` container; `distribution` adds the conventional `main` distribution and its archive/install tasks.
- Distribution contents are `CopySpec`s rooted by convention at `src/<distributionName>/dist`. Use `distributionBaseName`, `distributionClassifier`, and child specs to change archive identity or layout deliberately.
- Treat `installDist` and named install tasks as `Sync` tasks under `build/install`; do not point them at unmanaged directories unless destructive replacement is intended.
- For JVM applications, use the Application plugin before hand-wiring `JavaExec`, scripts, and archives: `application.mainClass` owns the entry point, `applicationDefaultJvmArgs` feeds both `run` and generated start scripts, and `applicationDistribution` is the CopySpec for extra distribution content.
- Application distributions conventionally place runtime jars under `lib` and generated start scripts under `application.executableDir`; change those through the extension or distribution contents instead of editing generated scripts or archive paths after the fact.
- Use `java-library-distribution` only for legacy/simple library ZIPs that package the library jar plus runtime dependencies; prefer published variants or normal Maven/Ivy publications when consumers need dependency metadata.
- Use the War plugin when the artifact is a web application archive. It disables Java's default JAR, maps `src/main/webapp` to the archive root, and publishes the WAR through `components.web`.
- War `providedCompile` and `providedRuntime` are transitive and remove provided libraries from the WAR even when another dependency path declares them; use artifact-only notation only when the provided dependency must be non-transitive.
- Use the Ear plugin when the artifact is an enterprise application archive. `deploy` dependencies go to the EAR root and are not transitive; `earlib` dependencies go under `lib` and are transitive.
- For skinny WAR layouts, keep shared libraries in the EAR `lib` directory and model WAR-side shared dependencies as compile-only/provided rather than copying jars out of one archive into another.

## Permissions And Reproducibility

- Set `filePermissions {}` and `dirPermissions {}` on the relevant `CopySpec` or child spec when permissions are part of the artifact contract.
- On Gradle 9+, raw Unix mode APIs such as `fileMode`, `dirMode`, `FileTreeElement.getMode()`, and `FileCopyDetails.setMode(...)` are removed; use `filePermissions {}` and `dirPermissions {}` instead.
- Empty permission blocks still set explicit defaults: files `0644`, directories `0755`.
- Per-file permission overrides can disable up-to-date checks for that task; prefer broad spec-level permissions when possible.
- Gradle 9 archive tasks are reproducible by default: deterministic order, fixed timestamps, and fixed file/directory permissions.
- Preserve filesystem timestamps, order, or permissions only when the filesystem or VCS metadata is intentionally part of the output contract.
- Reproducibility escape hatches are per concern: `preserveFileTimestamps`, `reproducibleFileOrder = false`, `useFileSystemPermissions()`, or `org.gradle.archives.use-file-system-permissions=true` for all archives.
- For executable scripts in archives, prefer explicit file permissions over global filesystem-permission preservation.

## Symptom Map

- Destination contains too much or too little directory structure: inspect whether the path was part of `from(...)`, a child `into(...)`, or an include pattern.
- Files unexpectedly missing from a `FileTree` or copy: inspect Ant default excludes, include/exclude scope, and whether a `from(...)` path does not exist.
- Copy task always runs: check `Project.copy` in task actions, per-file permission overrides, undeclared inputs/outputs, and volatile filters.
- Copy task deliberately always runs: check for `doNotTrackState` and confirm the destination is unmanaged or unreadable enough to justify disabling state tracking.
- Missing task dependency for copied generated files: pass the producing task/output provider to `from(...)` or declare the source as an input.
- Reproducible archive mismatch: inspect timestamps, file order, permissions, generated metadata, duplicate entries, and host-specific content.
