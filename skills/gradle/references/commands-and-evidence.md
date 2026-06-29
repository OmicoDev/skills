# Gradle Commands And Evidence

Read this when: choosing Gradle commands, flags, log levels, reports, or evidence routes from a failing run.

## Evidence To Preserve

- Exact command, working directory, start project, task path, wrapper version, Gradle user home when relevant, JVM, OS, and failure excerpt.
- Relevant files: `settings.gradle(.kts)`, target `build.gradle(.kts)`, `gradle.properties`, wrapper properties, catalogs, lockfiles, verification metadata, and CI command.
- Whether the failure happens locally, in CI, in IDE import/sync, or through the Tooling API.
- Prefer plain copied text over screenshots. Keep generated HTML report paths and attach reports when policy allows.

## Command Playbook

Use the wrapper and the smallest useful command.

- Runtime and topology: `./gradlew --version`, `./gradlew -q projects`; buildscript classpath: `./gradlew buildEnvironment`.
- Task surface: `./gradlew tasks --all`, `./gradlew tasks --provenance`, `./gradlew help --task <task>`, `./gradlew <task> --dry-run`, Gradle 9.1+: `./gradlew <task> --task-graph`.
- Dependency evidence: `./gradlew dependencies --configuration <configuration>`, `./gradlew dependencyInsight --dependency <module> --configuration <configuration>`, `./gradlew outgoingVariants`, `./gradlew resolvableConfigurations`.
- File-backed project reports: `dependencyReport`, `htmlDependencyReport`, `propertyReport`, `taskReport`, and `projectReport` require the `project-report` plugin and mirror command-line report content into files.
- Migration and performance: `./gradlew help --warning-mode=all`, `./gradlew <task> --configuration-cache --configuration-cache-problems=warn`, `./gradlew <task> --scan`, `./gradlew <task> --profile`. Use `--scan` only when project policy permits uploading build metadata; otherwise use local reports.

## Flag Selection

- Add `--stacktrace` for exception ownership; use `--full-stacktrace` only when truncated output hides relevant Gradle or plugin frames.
- Add `--info` only when ordinary output lacks owner evidence. Use `--debug` only in trusted log destinations; it can expose environment variables, repository credentials, build cache credentials, Develocity credentials, and publishing credentials.
- Add `--configuration-cache` to reproduce configuration-cache behavior.
- Add `--configuration-cache-problems=warn` only to inventory blockers during migration; remove it from release gates.
- Add `--continuous` only for interactive command-line watch loops. It depends on file system watching, does not work with `--no-daemon`, and must be restarted after build logic or model changes.
- Add `--rerun` after one task when only that task should ignore up-to-date checks; add `--rerun-tasks` when the selected tasks and their dependencies should all rerun without deleting outputs like `clean` would.
- Add `--refresh-dependencies` only to test cache/repository hypotheses and `--offline` only to prove whether the cache already contains required modules; do not leave either as a fix.
- Add `--write-locks`, `--update-locks`, or dependency verification flags only for deliberate lock/verification workflows; `--update-locks` implies `--write-locks`, and durable verification policy belongs in [dependency-verification.md](dependency-verification.md).
- Add `--include-build <path>` only to reproduce a composite substitution or local replacement; route durable topology changes to [project-topology-and-build-logic.md](project-topology-and-build-logic.md).
- Add `--project-dir <path>` only to reproduce a start-directory difference; otherwise record and run from the repository root.
- Use `--warning-mode=all` before Gradle upgrades or deprecation cleanup.
- Use `--console=plain` when CI logs or copied output should not contain rich-console control sequences.
- Use `--non-interactive` for CI, scripts, and agent runs where Gradle must not prompt.
- Use `--task-graph` on Gradle 9.1+ when `--dry-run` is too weak and task dependency shape matters.
- Leave the default Problems API HTML report enabled unless the artifact is unsafe for the environment; record the printed report path when problems appear.
- Put task-specific options immediately after the task that owns them. If a task option conflicts with a Gradle built-in option, use the `--` delimiter before the task path.

## Evidence Patterns

- For task failures, keep task outcome, task provenance, full task path, and task type from `help --task`, `tasks --provenance`, or the failure message; verification failures such as tests can omit provenance from the failure text.
- For task selection surprises, keep the start directory, exact task token, whether it was a full path or selector, and any name-abbreviation expansion shown with `--info`.
- For task graph surprises, prefer Gradle 9.1+ `--task-graph` when included-build edges, repeated subtrees, task types, or exact dependency parents matter more than the flat `--dry-run` execution list.
- For dependency selection, keep the configuration name. `runtimeClasspath` and `compileClasspath` can explain different selected versions.
- Use `dependencies` for software configurations in the selected project and `buildEnvironment` for buildscript/plugin classpath dependencies.
- In dependency reports, `(*)` marks a repeated transitive subtree, `(c)` marks a dependency constraint, and `(n)` marks a non-resolvable dependency or configuration.
- `dependencyInsight` explains one dependency in one configuration; preserve selection reasons such as `By conflict resolution`, `By constraint`, `By ancestor`, `Selected by rule`, `Forced`, or variant `Rejection` before choosing declaration, platform/constraint, rule, enforced platform, or variant owners. Use `--all-variants` when variant data matters and `--single-path` when path noise hides the selection owner.
- For variant failures, capture the requested attributes and every candidate variant Gradle prints before changing attributes.
- For plugin resolution, capture plugin ID, version, plugin repositories, and whether the ID is applied in settings, build scripts, or convention plugins.
- For configuration-cache failures, keep the report path, grouped-message/task owner, detected configuration inputs, and the first local build logic class or script named by the object graph.
- For Problems API output, keep the console problem text, problem ID/group when visible, and the problems report path printed by Gradle.
- When build logic or external tools seem noisy or silent, identify the logging channel before changing task behavior: `println`/stdout enters Gradle at `QUIET`, stderr at `ERROR`, Gradle `Logger` honors its level, and `LoggingManager` can remap task stdout/stderr.
- For warning cleanup, capture `--warning-mode=all` output; use `--warning-mode=fail` only as a gate after the owning warnings are understood.
- For performance work, record at least two comparable runs before and after a change. Avoid comparing a warm daemon run with a cold daemon run.
- Build Scan performance data is richer; `--profile` is local but less detailed. Use the local profile report when upload policy blocks scans.
- For continuous-build misses or build cycles, record the files Gradle reported as changed. Missing input directories, untracked/no-output tasks, files outside project directories, symlinks, and tasks that mutate their own inputs can explain watch behavior.
- `buildDashboard` indexes reports from reporting tasks selected in the same invocation; it does not depend on report producers and applying the plugin disables configuration cache.
- For CI-only failures, record Gradle user home cache settings, CI JDK, wrapper version, working directory, and any init scripts injected by CI.
- Command-line flags outrank properties and environment. When reproducing a CI issue, compare flags, `gradle.properties`, system properties, and environment in that order.

## Symptom Routing

- Task not found or unexpected task path: read [project-topology-and-build-logic.md](project-topology-and-build-logic.md) and [plugins-services-and-diagnostics.md](plugins-services-and-diagnostics.md).
- Unexpected task graph, ordering, finalizer, skip, timeout, or task-specific CLI option behavior: read [task-execution-and-options.md](task-execution-and-options.md).
- Plugin not found: inspect `pluginManagement` repositories and plugin versions in settings.
- Dependency not found or wrong version: read [dependency-policy.md](dependency-policy.md).
- `No matching variant`, capability conflict, or attributes mismatch: read [dependency-variants-and-metadata.md](dependency-variants-and-metadata.md).
- Configuration cache report names build logic: read [configuration-cache.md](configuration-cache.md).
- Slow configuration or many realized tasks: read [performance-strategy.md](performance-strategy.md).
- Wrapper or JVM mismatch: read [runtime-and-structure.md](runtime-and-structure.md) and [jvm-and-tests.md](jvm-and-tests.md).
- New project scaffold or Maven conversion: read [project-topology-and-build-logic.md](project-topology-and-build-logic.md) before accepting generated files.

## Command Safety

- Prefer `help`, reports, and single task paths for diagnosis.
- Prefer explicit task paths such as `:subproject:test` for reproducible diagnosis. Bare task names are selectors and may run matching tasks in multiple projects depending on the start directory; reporting selectors such as `help` or `dependencies` stay scoped to the selected project.
- Avoid `clean build` as a first command; it hides reuse behavior and costs time.
- Use `--dry-run` or Gradle 9.1+ `--task-graph` to inspect task graph shape, not task action correctness; both disable task actions.
- Use `--continue` only to collect multiple independent failures; Gradle still skips tasks whose dependencies failed, and test failures can prevent downstream coverage or reporting tasks from running.
- Treat `--exclude-task` as a local diagnostic or workflow choice, not a model fix for bad dependencies.
- Treat `--no-rebuild` as a narrow `buildSrc`/included-build diagnostic; it can produce wrong results when project dependencies need rebuilding.
- Use task and project name abbreviations only in local diagnosis; keep committed scripts, docs, and reproduced commands explicit.
- Do not rely on command-line task order as the build model; order safety depends on tasks declaring what they consume, produce, or destroy.
- Treat `init` and `wrapper --gradle-version` as mutating owner commands; read runtime or upgrade guidance before running them.

## Avoid

- Treating `clean`, `--refresh-dependencies`, `--rerun`, `--rerun-tasks`, disabled verification, or warning suppression as permanent repairs.
- Running `./gradlew build` before a narrower task can identify the owner.
- Changing repositories, plugin versions, or global properties before inspecting settings and wrapper evidence.
