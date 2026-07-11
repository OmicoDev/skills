# Gradle Continuous Builds

Read this when: `--continuous`/`-t`, watch-loop triggering, quiet-period tuning, continuous-build cancellation, missed rebuilds, or repeated build cycles owns the work.

## Execution Model

- Use `./gradlew <task> --continuous` for an interactive development loop, not as a general CI retry mechanism.
- Gradle runs the requested task graph, records file inputs observed by scheduled work, and reruns after a relevant watched input changes. Unrelated files and build logic that is not part of those inputs do not trigger model recomputation; restart the session after settings, build scripts, convention plugins, or other model-shaping changes.
- The loop remains one Gradle build session even though it executes multiple builds. Session-scoped services and the configured model can therefore outlive one execution; do not assume each rebuild starts a fresh daemon or reloads build logic.
- Changes detected during execution are retained and can trigger the next build after the current one finishes. If execution fails early, inputs belonging only to tasks that were never reached may not have been observed and may not trigger a retry.
- Continuous build exits when Gradle detects no file-system inputs or cannot watch any file-system location. Treat either message as task-model or runtime evidence before changing polling or retry policy.

## Runtime Requirements

- Continuous build requires daemon execution and active file-system watching; it does not work with `--no-daemon`, `--no-watch-fs`, or a runtime/file system that cannot keep a watched location.
- Read [runtime-and-structure.md](runtime-and-structure.md) for VFS support, lost-state, symlink, network-file-system, custom project-cache, and inotify diagnosis.
- The watch set follows task inputs, not arbitrary repository changes. Untracked tasks, tasks with no outputs, inputs outside project directories, missing input directories, and empty filtered file trees can all produce missed rebuilds.
- A task that mutates its own inputs can create a permanent loop. Fix the task model by separating inputs from outputs or removing the mutation; increasing the quiet period only delays the cycle.

## Triggering And Quiet Period

- Gradle waits for a quiet period after the most recent relevant event before starting the next build, coalescing bursts of changes rather than rebuilding once per event.
- On Gradle 7.5+, set `org.gradle.continuous.quietperiod=<milliseconds>` only when editors, generators, or synchronization tools emit related changes farther apart than the default window. Keep the smallest value that groups one logical save without making feedback feel stalled.
- A watcher error triggers a rebuild so Gradle can recover state. If the error repeats, stop the loop and diagnose the watcher rather than trusting repeated rebuilds as application changes.
- Gradle reports only a small sample of changed paths before `and some more changes`; preserve the displayed paths, then use task input declarations and VFS logging when the omitted event owns the diagnosis.

## Cancellation

- In an interactive terminal, end the loop with end-of-input: `Ctrl-D`, followed by Enter on Windows. Other typed input does not stop the build.
- In a non-interactive script, terminate the process explicitly. Through the Tooling API, use its cancellation mechanism rather than relying on terminal input.
- Cancellation ends the continuous session; a normal failing build does not. Fix-or-change workflows can therefore continue after a task failure as long as a watched input for reached work changes.

## Evidence And Triage

1. Record the exact task paths, wrapper version, whether the first build succeeded, and every `new`, `modified`, or `deleted` path Gradle displayed.
2. Confirm the changed file is an input of a task Gradle reached in the last build, lies inside a watched project hierarchy, and is not accessed only through a symlink or unsupported file system.
3. Run once with `-Dorg.gradle.vfs.verbose=true`; if Gradle retains no watched locations or drops VFS state, route to runtime diagnosis.
4. For a missing input directory or empty filtered tree, stop the loop, create the directory or first matching file, then restart. Keep the precise filter unless the task genuinely consumes a broader root.
5. For a build cycle, identify which task changed the reported input and move its generated files to a distinct task-owned output directory.

## Avoid

- Using continuous build as a substitute for declared inputs/outputs, incremental tasks, or the build cache.
- Expecting build-script, settings, plugin-classpath, or included-build logic changes to be reloaded without restarting the loop.
- Persisting verbose VFS logging or a large quiet period without evidence from a representative edit workflow.
