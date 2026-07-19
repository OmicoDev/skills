# Gradle Tooling API

Read this when: an IDE or external client embeds Gradle, requests public or custom models, runs build actions, tests, or tasks, or coordinates model-building parallelism.

## Client And Runtime Boundary

- Tools that use Gradle should usually be modeled by plugins and tasks; tools that execute Gradle should usually use the Tooling API.
- Tooling API clients are version-independent, wrapper-aware, daemon-backed external clients with their own JVM and compatibility surface.
- The Tooling API always uses a Gradle daemon. IDE or embedded-client failures should inspect daemon selection and daemon logs even when ordinary CLI reproduction uses different daemon flags.
- Separate Tooling API compatibility into four axes: Tooling API library/client JVM, target Gradle distribution, daemon JVM, and serialized `BuildAction` or custom-model bytecode.
- Let Tooling API connections use the target build distribution by default; overriding the Gradle version or distribution makes the client own that compatibility risk.
- If the target build has no wrapper or configured distribution, the Tooling API falls back to the client library's Gradle version; embedded tools should make that choice visible instead of treating it as project-owned.
- Treat Tooling API library upgrades as integration compatibility work: the client supports running target builds from the last five Gradle major releases plus current/next-major forward compatibility, and individual launcher/model/test methods can still require newer target Gradle versions.
- Recreate a Tooling API connection after connector inputs such as `gradle.properties`, daemon JVM policy, distribution choice, or Gradle user home change.

## Operations And Concurrency

- Use Tooling API launchers, stdout/stderr capture, progress listeners, cancellation tokens, and public models before scraping command-line output from an embedded Gradle invocation.
- `withArguments(...)` supports build-execution options modeled by `StartParameter`; do not pass CLI-only commands such as `-?`, `-v`, or daemon toggles through Tooling API launchers.
- `setEnvironmentVariables(...)` replaces the operation environment; copy the current environment first when adding overrides, especially on Windows.
- Close `ProjectConnection` instances when finished. `ProjectConnection` is thread-safe and long-lived, while `GradleConnector` instances are not thread-safe.
- `BuildLauncher` and `ModelBuilder` are explicitly not thread-safe. Treat `TestLauncher` as per-operation too because its public contract does not promise thread safety, even though the owning `ProjectConnection` can be shared.
- Progress notifications from one `ProjectConnection` are serialized, but the delivery thread may change; keep listeners thread-safe and marshal UI updates explicitly.
- Treat Tooling API `BuildAction` classes as serialized code sent into the build; compile them to the lowest Java level supported by the target Gradle range.
- When both the client-side Tooling API library and target Gradle distribution are 9.3+, use incubating resilient `BuildController.fetch(...)` when a Tooling API build action should continue after model-fetch failures; always inspect `FetchModelResult.getFailures()` and the nullable model before treating missing data as an unsupported or absent model.

## Parallel Model Building

- Separate task parallelism from model-building parallelism. Target Gradle 9.4+ provides `org.gradle.tooling.parallel` so IDE sync or custom model fetching can use a different policy from `org.gradle.parallel`.
- In the verified target Gradle 9.4 through 9.6.1 Vintage-build behavior, an explicit `org.gradle.tooling.parallel` value wins; when it and the transitional opt-out are absent, model building inherits `org.gradle.parallel` or `--parallel`. Set the tooling property explicitly when the two workloads need different stability or performance tradeoffs.
- In Vintage mode, use `org.gradle.tooling.parallel=true` to allow parallel model builders without parallel task execution, or combine `org.gradle.parallel=true` with `org.gradle.tooling.parallel=false` to keep model building serial.
- Do not adopt `org.gradle.tooling.parallel.ignore-legacy-default` as durable build policy. It is a transitional system property for Tooling API clients that suppresses the legacy inheritance; use the public Gradle property for project-owned policy.
- Isolated Projects owns a different mode boundary. In Gradle 9.6.1 outside diagnostics mode, it automatically allows Gradle-side parallel model building and ignores `org.gradle.tooling.parallel=false` for that internal decision; diagnostics mode deliberately keeps model building serial. The IDE or client must still issue model requests in a parallel-capable shape.
- Parallel model fetching without Isolated Projects lacks isolation validation. If sync fails only with tooling parallelism enabled, inspect custom model builders and configuration logic for shared cross-project mutable state before changing task parallelism.

## Models And IDE Sync

- IDE import and sync consume Gradle models; task execution behavior may differ from sync behavior.
- Use public models or custom tooling models when external consumers need structured information.
- Register custom tooling model builders through the injectable `ToolingModelBuilderRegistry` in a plugin; do not scrape task output or CLI text to fabricate IDE models.
- Custom tooling models belong in plugins and should be versioned like public integration contracts.
- Kotlin DSL script editor models are Tooling API root-project models, not project-source Kotlin compilation: request `KotlinDslScriptsModel` with `prepareKotlinBuildScriptModel` and classpath or strict-classpath provider mode, use `org.gradle.tooling.model.kotlin.dsl.scripts` only for explicit script files, and when Isolated Projects is enabled diagnose discovery through the isolated model builder because explicit script lists are rejected.
- In composite builds, Tooling API task paths and prior test descriptors can target included builds, but class/method selectors without task targets apply only to the root build; use task-scoped test selectors for included-build tests.
- Notify Gradle daemons about files changed by the external tool itself with absolute canonical paths; for renames send both old and new paths, and do not replay changes discovered by another watcher because Gradle already watches the file system.
