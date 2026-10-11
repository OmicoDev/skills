# Gradle Tooling API

Read this when: an IDE or external client embeds Gradle, requests public or custom models, runs build actions, tests, or tasks, or coordinates model-building parallelism.

## Client And Runtime Boundary

- Tools that use Gradle should usually be modeled by plugins and tasks; tools that execute Gradle should usually use the Tooling API.
- Tooling API clients are version-independent, wrapper-aware, daemon-backed external clients with their own JVM and compatibility surface. The final 9.8.1 Tooling API library runs on Java 8+, independently of the target Gradle daemon JVM requirements.
- The Tooling API always uses a Gradle daemon. IDE or embedded-client failures should inspect daemon selection and daemon logs even when ordinary CLI reproduction uses different daemon flags.
- Separate Tooling API compatibility into four axes: Tooling API library/client JVM, target Gradle distribution, daemon JVM, and serialized `BuildAction` or custom-model bytecode.
- Let Tooling API connections use the target build distribution by default; overriding the Gradle version or distribution makes the client own that compatibility risk.
- If the target build has no wrapper or configured distribution, the Tooling API falls back to the client library's Gradle version; embedded tools should make that choice visible instead of treating it as project-owned.
- Treat Tooling API library upgrades as integration compatibility work: the client supports running target builds from the last five Gradle major releases plus current/next-major forward compatibility, and individual launcher/model/test methods can still require newer target Gradle versions.
- Recreate a Tooling API connection after connector inputs such as `gradle.properties`, daemon JVM policy, distribution choice, or Gradle user home change. In the verified 9.7.1 and 9.8.1 clients, a connector retains its resolved distribution after closing a connection; after a Wrapper change use a new connector or call `useBuildDistribution()` before reconnecting.

## Operations And Concurrency

- Use Tooling API launchers, stdout/stderr capture, progress listeners, cancellation tokens, and public models before scraping command-line output from an embedded Gradle invocation.
- `withArguments(...)` supports build-execution options modeled by `StartParameter`; do not pass CLI-only commands such as `-?`, `-v`, or daemon toggles through Tooling API launchers.
- `setEnvironmentVariables(...)` is available from Tooling API 3.5 and replaces the operation environment for supporting targets; copy the current environment first when adding overrides, especially on Windows.
- Close `ProjectConnection` instances when finished; `close()` waits for pending operations and stops subsequent notifications, so do not use it as immediate cancellation. `ProjectConnection` is thread-safe and long-lived, while `GradleConnector` instances are not thread-safe.
- `BuildLauncher` and `ModelBuilder` are explicitly not thread-safe. Treat `TestLauncher` as per-operation too because its public contract does not promise thread safety, even though the owning `ProjectConnection` can be shared.
- Progress notifications from one `ProjectConnection` are serialized, but the delivery thread may change; keep listeners thread-safe and marshal UI updates explicitly.
- Treat Tooling API `BuildAction` classes as serialized code sent into the build; compile them to the lowest Java level supported by the target Gradle range.
- Both the client-side Tooling API library and target Gradle distribution must be 9.3+ to call incubating `BuildController.fetch(...)`, but default resilient daemon-side model fetching requires target Gradle 9.4+. Always inspect `FetchModelResult.getFailures()` and the nullable model before treating missing data as an unsupported or absent model.
- With target Gradle 9.7+, build or model-construction failures captured by resilient model fetching still fail the Tooling API operation. Use a phased build action and consume partial models through `IntermediateResultHandler`; a single action loses its return value when the operation fails.
- Tooling API 9.8+ exposes incubating `Failure.getOwnDescription()` for traversing failure trees without repeating cause text. In the verified 9.8.1 client, target 9.7+ protocol failures supply per-node text; targets before 9.7 return `null`. Treat the value as nullable even on newer targets; when absent, read `getDescription()` once at the root instead of repeating full subtree descriptions at every node.

## Parallel Model Building

- Separate task parallelism from model-building parallelism. Target Gradle 9.4+ provides `org.gradle.tooling.parallel` so IDE sync or custom model fetching can use a different policy from `org.gradle.parallel`.
- In the verified target Gradle 9.4 through 9.8.1 Vintage-build behavior, an explicit `org.gradle.tooling.parallel` value wins; when it and the transitional opt-out are absent, model building inherits `org.gradle.parallel` or `--parallel`. Set the tooling property explicitly when the two workloads need different stability or performance tradeoffs.
- In the verified 9.7.1 and 9.8.1 Vintage mode, `org.gradle.tooling.parallel=true` also enables the internal project-task parallelism flag for a model-producing invocation, including one that schedules tasks; a separate task-only invocation still follows `org.gradle.parallel`. Combine `org.gradle.parallel=true` with `org.gradle.tooling.parallel=false` to keep model building serial.
- Do not adopt `org.gradle.tooling.parallel.ignore-legacy-default` as durable build policy. It is a transitional system property for Tooling API clients that suppresses the legacy inheritance; use the public Gradle property for project-owned policy.
- Isolated Projects owns a different mode boundary. In the verified Gradle 9.6.1 through 9.7.1 behavior outside diagnostics mode, it automatically allows Gradle-side parallel model building and ignores `org.gradle.tooling.parallel=false` for that internal decision; diagnostics mode deliberately keeps model building serial. The IDE or client must still issue model requests in a parallel-capable shape.
- Use Tooling API 6.8+ `BuildController.run(actions)` for Gradle-managed nested model queries; targets through 6.7 execute these actions sequentially, and `getCanQueryProjectModelInParallel(...)` reports whether parallel queries are available. In target 9.8.1, a controller rejects model queries from client-created executor threads; keep queries on Gradle-managed action threads.
- Parallel model fetching without Isolated Projects lacks isolation validation. If sync fails only with tooling parallelism enabled, inspect custom model builders and configuration logic for shared cross-project mutable state before changing task parallelism.

## Models And IDE Sync

- IDE import and sync consume Gradle models; task execution behavior may differ from sync behavior.
- Use public models or custom tooling models when external consumers need structured information.
- Register custom tooling model builders through the injectable `ToolingModelBuilderRegistry` in a plugin; do not scrape task output or CLI text to fabricate IDE models.
- Custom tooling models belong in plugins and should be versioned like public integration contracts.
- Kotlin DSL script editor models are Tooling API root-project models, not project-source Kotlin compilation: request `KotlinDslScriptsModel` with `prepareKotlinBuildScriptModel` and classpath or strict-classpath provider mode, use `org.gradle.tooling.model.kotlin.dsl.scripts` only for explicit script files, and when Isolated Projects is enabled diagnose discovery through the isolated model builder because explicit script lists are rejected.
- With target Gradle 6.8+, Tooling API task paths and prior test descriptors can target included builds, but class/method selectors without task targets apply only to the root build; use task-scoped test selectors for included-build tests.
- Use Tooling API 6.1+ `notifyDaemonsAboutChangedPaths(...)` to notify Gradle daemons about files changed by the external tool itself with absolute canonical paths; targets before 6.1 do not retain VFS state and treat this as a no-op within the supported target range. The call is synchronous and does not start a daemon; for renames send both old and new paths, and do not replay changes discovered by another watcher because Gradle already watches the file system.
