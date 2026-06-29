# Gradle Task Execution And Options

Read this when: task dependencies, ordering, finalizers, skipping, timeouts, command-line task options, lifecycle orchestration, or task public execution behavior owns the change.

## Scope Boundary

- This file owns why selected tasks run, in what order they run, when actions are skipped, and which task-specific CLI options are exposed.
- Use [task-types-and-validation.md](task-types-and-validation.md) when the issue is a task type's inputs, outputs, validation annotations, cacheability, or incremental input processing.
- Use [commands-and-evidence.md](commands-and-evidence.md) when choosing global Gradle CLI flags, logs, task selection syntax, or report evidence.
- Use [plugins-services-and-diagnostics.md](plugins-services-and-diagnostics.md) when a plugin's overall public task surface, groups, naming, or DSL design owns the decision.

## Task Relationships

- Prefer provider wiring and task outputs to imply dependencies when one task consumes another task's output.
- Use `dependsOn` for required work, `finalizedBy` for cleanup/finalization, and `mustRunAfter`/`shouldRunAfter` for ordering only.
- `dependsOn` and `finalizedBy` are strong relationships once the owner task is selected; ordering rules only order tasks that are already in the graph.
- `mustRunAfter` does not cause the predecessor to run, and `--continue` can still allow the later task to execute after the earlier task fails.
- `shouldRunAfter` is advisory: Gradle can ignore it for ordering cycles or parallel execution when all hard dependencies are otherwise satisfied.
- With `--continue`, a task that directly `dependsOn` a failed task still depends on that task's outcome; a consumer wired through declared producer outputs may continue after a controlled `VerificationException` when the outputs remain valid.
- `VerificationException` is for controlled validation failures after useful outputs are produced; it still stops the current task's remaining actions, so only already-written valid outputs should be consumed downstream.
- Prefer `dependsOn` for lifecycle tasks without actions. Tasks with actions should usually wire the exact producer output they consume; `dependsOn` only says the producer must run and can over-constrain scheduling.
- Before adding `dependsOn` to an actionable task, ask whether the relationship is really artifact flow; if so, expose the producer output as a provider-backed input instead.
- Prefer a purpose-built lifecycle task over telling users to run `build -x test`; exclusions can remove actionable work that downstream tasks expected.
- Do not use ordering rules to compensate for missing declared inputs and outputs.
- Destroyable paths participate in scheduling: Gradle avoids parallel execution when a task's destroyables overlap another task's inputs or outputs, but explicit `dependsOn`, `mustRunAfter`, or `shouldRunAfter` relationships still define the graph/order you asked for.
- Command-line task order can protect explicitly requested workflows such as `clean build`, but task dependencies still determine the precise graph; model recurring ordering or cleanup requirements in task relationships instead of relying on how humans type tasks.
- Avoid broad task graph callbacks for ordinary wiring; prefer lazy task registration, providers, and output properties.
- If Gradle reports implicit dependencies, replace raw `File` or path wiring with task providers, output properties, or the producing task as an input.

## Finalizers, Skips, And Timeouts

- `finalizedBy` adds the finalizer task to the graph when the finalized task is scheduled.
- Finalizers run even when the finalized task fails or is up-to-date; use them for cleanup that must happen after selected work.
- Use `onlyIf("reason") { ... }` for ordinary conditional execution. The predicate runs just before task execution and `--info` can show the skip reason.
- Use `StopExecutionException` only when a predicate cannot express the condition, often when adding conditional behavior around built-in task actions.
- `StopExecutionException` skips the current task action and any following actions on that task; it does not abort the whole build.
- Use `StopActionException` only when a helper needs to skip the current task action but still let later actions on the same task run; a plain `return` is clearer inside the action body itself.
- Use `enabled = false` sparingly for hard disabling; it skips actions and reports the task as skipped.
- Task `timeout` interrupts the task execution thread, marks the task failed, still runs finalizers, and cannot stop work that ignores interruption.
- With `--continue`, tasks independent of a timed-out task may still run after the timeout failure.
- Avoid task rules for stable, discoverable workflows; rule-created task names are not concrete tasks in `tasks` output even though they can be requested or depended on.

## Lifecycle Tasks

- Lifecycle tasks should normally have no actions; they collect actionable task targets through dependencies.
- Task names must not contain `/`, `\`, `:`, `<`, `>`, `"`, `?`, `*`, or `|`; use project paths or lifecycle tasks for hierarchy instead of encoding separators inside one task name.
- Put lifecycle and user-facing ad hoc tasks in short, existing groups and give them descriptions; ungrouped tasks are hidden from `tasks` unless `--all` is used, but they are still invokable and should not be treated as private.
- Root lifecycle tasks are useful for CI-wide orchestration; keep project-specific work in subproject tasks or convention plugins.
- Treat Java plugin `buildNeeded` and `buildDependents` as deprecated legacy graph shortcuts; request concrete project tasks, use test/report aggregation, or consume project artifacts through dependency resolution instead.
- Do not list every transitive task in a lifecycle task. Depend on the meaningful target tasks and let Gradle infer their required work.

## Command-Line Task Options

- Use `@Option` on custom task setters when a task property should be configurable immediately after the task name on the command line.
- Task options are task-specific, not global plugin or project options. The task exposing the option must be requested explicitly.
- Built-in task option `--rerun` reruns only the requested task it follows; use global `--rerun-tasks` only when every task should ignore up-to-date state.
- Task options can only be declared on custom task types through annotations; there is no project-level or programmatic task-option API.
- Put task options after the task name they configure; options on tasks reached only through dependencies are not available unless that task is explicitly requested.
- Custom task options use double-dash long option syntax such as `--output-dir`; single-dash syntax is not valid for `@Option`.
- Boolean options support `--flag` and generated `--no-flag` forms when they do not conflict with an existing option.
- Multi-value options must be repeated, such as `--id=one --id=two`; comma-separated or space-separated lists are not equivalent.
- `DirectoryProperty` and `RegularFileProperty` option values are resolved relative to the project directory that owns the property instance.
- Keep `@Option` properties to supported scalar, enum, file, list, set, or Gradle property types. Use extension properties, project properties, or build services for complex or cross-task build knobs.
- Use `@OptionValues` to document accepted values, but validate unsupported values in the task action because the annotation itself does not reject them.
- When a task option conflicts with a built-in Gradle option, use the `--` delimiter before the task name or option sequence.

## Diagnostics

```bash
./gradlew tasks --all
./gradlew help --task <task>
./gradlew <task> --dry-run
./gradlew <task> --task-graph # Gradle 9.1+
./gradlew <task> --info
./gradlew <task> -x <task-to-exclude>
./gradlew tasks --provenance
```

- Use `help --task` to confirm task-specific options, groups, descriptions, and available values.
- Use `tasks --provenance` when an unexpected task exists or a task failure names a registration source; it distinguishes plugin-registered, script-registered, and other task owners.
- Use `--dry-run` to inspect graph shape and ordering without running actions.
- Use `--task-graph` on Gradle 9.1+ when the dependency graph is better evidence than the flat dry-run execution list.
- Use `--info` when a task is skipped by `onlyIf` or when execution ordering needs more evidence.
- Interpret task outcome labels before changing wiring: no label/`EXECUTED` means actions ran, `UP-TO-DATE` reused local outputs, `FROM-CACHE` restored outputs, `SKIPPED` skipped actions, and `NO-SOURCE` skipped because expected sources were absent.
- `SKIPPED` needs a different owner depending on cause: command-line exclusion, `onlyIf`, `enabled = false`, or `StopExecutionException`; `NO-SOURCE` usually points to source/input configuration instead.
- Use `-x` or `--exclude-task` only as a local diagnostic or one-off workflow override; if the workflow is expected, model it as a lifecycle task.
