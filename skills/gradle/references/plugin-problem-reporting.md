# Gradle Plugin Problem Reporting

Read this when: Problems API, structured plugin warnings, rich plugin failures, problem IDs/groups, CLI problem rendering, Tooling API problem events, or problems HTML reports owns the change.

## Scope Boundary

- This file owns plugin-authored structured diagnostics through the public Problems API.
- Use [task-types-and-validation.md](task-types-and-validation.md) for built-in task validation annotations and validation problem repairs.
- Use [plugins-services-and-diagnostics.md](plugins-services-and-diagnostics.md) for broader plugin design and public task surface choices.
- Use [commands-and-evidence.md](commands-and-evidence.md) when the main work is preserving failure output, report paths, or command evidence.

## Problems API Model

- Use the Problems API when a plugin owns diagnostics that should be structured for CLI, IDEs, Build Scan, and Tooling API clients.
- Inject the public `Problems` service into plugin-owned task or plugin types; avoid internal problem-reporting APIs.
- Treat the public Problems API as incubating and minimum-Gradle-version-sensitive; isolate calls behind small plugin-owned helpers when supporting a Gradle version range.
- Treat problem rendering as Gradle UI/service infrastructure; plugin code should provide stable public metadata, not console-specific formatting.
- Create stable `ProblemGroup` and `ProblemId` values so duplicate problems can be summarized and clients can correlate them.
- In current public API, create IDs with `ProblemGroup.create(...)` and `ProblemId.create(...)`, then pass the `ProblemId` to `ProblemReporter`; do not configure IDs through internal `ProblemSpecInternal` APIs.
- Use kebab-case names for problem groups and IDs; uniqueness comes from the full group hierarchy plus the problem ID name, while display names are UI text.
- Keep problem IDs and groups low-cardinality: put task paths, file paths, dependency coordinates, user values, and other dynamic context in labels, details, solutions, or additional data instead.
- Treat the `ProblemId` display name as the stable problem headline in CLI output; use `contextualLabel`, `details`, locations, and solutions for the specific occurrence and fix.
- Keep `contextualLabel` as a short single-line occurrence label; put longer explanation in `details(...)` and concrete next steps in one or more `solution(...)` entries.
- Use `create(...)` when a plugin needs to collect problems before deciding whether to report or fail; use collection overloads when one failure should carry multiple structured problems.
- Use `report(...)` for recoverable problems when the build should continue.
- Use `throwing(...)` with an explicit exception for fatal problems that should fail the build with rich failure details; write `throw reporter.throwing(...)` at the call site so local control flow stays obvious.
- Do not set `ProblemSpec.severity()` for new code; severity follows the reporting method: `report(...)` is warning-like and `throwing(...)` is error-like.
- Set a useful `contextualLabel` for fatal problems; CLI failure output falls back to the supplied exception message when no contextual label is present.
- Use `withException(...)` to preserve a causal exception when it helps diagnostics, but keep the user-facing label, details, and solutions understandable without reading a stack trace.
- When a problem points at user-authored content, set `fileLocation`, `lineInFileLocation`, or `offsetInFileLocation` instead of burying paths in text; line and column locations are one-indexed, while global offsets are zero-indexed.
- Use `stackLocation()` only when the reporting call stack is the actual problem location; explicit file locations are better for scripts, catalog files, generated inputs, or external configuration.
- Put required user action in labels, details, `documentedAt(...)` links, locations, and solutions. Use stable documentation URLs for reusable explanations, and additional data for tool clients rather than the only human-readable fix.
- Keep `AdditionalData` to simple values, collections, and Provider API property types; do not attach live Gradle model objects as machine-only context.

## Reporting Boundaries

- Do not replace ordinary task validation annotations with ad hoc Problems API text.
- Do not use Problems API to hide Gradle deprecations, dependency resolution failures, or validation failures owned by Gradle.
- Treat `org.gradle.api.problems.internal.*` and other Problems internals as incompatible with modern Gradle; update the plugin or pin Gradle rather than binding to removed internals.
- If a build fails because a plugin injects removed `InternalProblems`, treat it as a plugin compatibility defect and upgrade or replace the plugin; do not migrate the build to another Problems internal package.
- Prefer stable plugin-owned problem IDs over text matching in tests.
- When a plugin reports many repeated instances, expect Gradle to show early instances and summarize later duplicates.
- Tooling API clients can receive problem events and failure-attached problems; keep IDs and groups stable across plugin releases.

## Verification

- Use `--warning-mode=all` when verifying console rendering for recoverable plugin-reported problems.
- Preserve the console problem text, problem ID/group when visible, and the exact HTML report path Gradle prints when diagnosing.
- The HTML problems report is generated only when problems are reported; generation is enabled by default and can be disabled with `--no-problems-report` or `org.gradle.problems.report=false`.
- `AdditionalData` is for client integration and is not rendered in CLI or HTML problem output.
- For Tooling API checks, use root-operation problem progress events for reported and summarized problems; use `withDetailedFailure()` or `FailureResult`/`GradleConnectionException.getFailures()` when verifying problems attached to fatal failures.
- Test fatal and recoverable paths separately because `throwing(...)` changes task/build outcome.
- For duplicate problems, assert representative `Problem` events plus `ProblemSummariesEvent` behavior; each `ProblemSummary.count` is the follow-up occurrence count beyond Gradle's event threshold, not the total number of matching problems.

## Failure Map

- User cannot act on the problem: add a label, details, and solution before adding machine-only extra data.
- Explicit severity has no effect: choose `report(...)` for recoverable diagnostics and `throwing(...)` for fatal failures.
- Duplicate warnings spam output: check whether problem IDs/groups are stable enough for summarization.
- IDE or Tooling API cannot correlate diagnostics: avoid changing IDs and groups for the same logical problem.
- Problems report missing: confirm a problem was actually reported and that `--no-problems-report` was not used.
- Recoverable problem absent from `GradleConnectionException.getFailures()`: the operation did not fail; listen for root-operation problem progress events instead.
- Test asserts console text only: prefer checking task outcome plus stable problem metadata or report evidence when accessible.

## Source Calibration

Primary upstream pages: Reporting Plugin Problems with the Problems API, Problems HTML Report, Tooling API problem events. Primary APIs: Problems, ProblemReporter, ProblemSpec, ProblemId, ProblemGroup, AdditionalData, LongRunningOperation.
