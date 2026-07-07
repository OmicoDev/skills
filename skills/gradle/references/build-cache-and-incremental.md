# Gradle Build Cache And Incremental Work

Read this when: task output caching, up-to-date checks, build-cache reuse, artifact transform caching, remote cache policy, or cache misses owns the work.

## Model

- Up-to-date checks reuse local outputs when inputs and outputs are unchanged.
- Build cache reuses task or artifact-transform outputs from local or remote cache storage.
- Dependency caches store module metadata, artifacts, dynamic-version results, and changing-module decisions; read [dependency-repositories.md](dependency-repositories.md) for `--refresh-dependencies`, `--offline`, repository stickiness, and Gradle user home cache behavior.
- Incremental task implementation belongs in [task-types-and-validation.md](task-types-and-validation.md); use this file only for reuse evidence such as up-to-date status, cache hits/misses, and non-incremental execution symptoms.
- Up-to-date and cache reuse require declared outputs; a pure side-effect task should be explicitly untracked instead of faking outputs only to satisfy the model.
- Cacheability requires declared inputs/outputs plus deterministic and relocatable outputs for the intended cache.
- Build cache keys include task type/classpath, task action implementations, output property names, input names/values, relevant build script content, Gradle distribution classpath, `buildSrc`, and plugin classpaths.
- Task names and project paths do not by themselves make outputs different; equivalent tasks can reuse outputs across paths.

## Adoption

- Start with built-in cacheable tasks and local cache evidence.
- Use remote cache in CI with clear `enabled`/`push` policy: Gradle loads from local cache first, then remote cache, and stores remote hits back into the local cache.
- Avoid pushing untrusted or developer-local outputs to shared remote cache.
- Remember the defaults: local cache push is enabled, remote cache push is disabled. Enable remote push only on trusted producers such as clean CI agents.
- Combine local and remote caches intentionally: developer local cache helps branch switching and `git bisect`, while CI local cache can mirror remote entries and reduce network transfer.
- Treat `buildSrc` and included builds as separate builds with their own cache behavior.
- Keep CI cache of Gradle user home separate from Gradle build cache policy.
- Do not mark custom task types cacheable by default. Add `@CacheableTask` only when outputs are worth reusing and correctness is tested; use `@DisableCachingByDefault` with a reason otherwise.

## Miss Triage

- First ask whether the task is cacheable at all.
- Locate the first executed cacheable task in a miss chain; later misses may be consequences of that earlier task.
- Then compare task input fingerprints, output property names, Gradle version, Java/tool versions, environment inputs, and normalized paths.
- When Gradle says caching is disabled, route by reason: no `cacheIf` or `@DisableCachingByDefault` is task-type policy; no outputs, file-tree outputs, untracked state, validation failures, non-cacheable inputs, and overlap are task modeling defects; unmet `cacheIf`/`doNotCacheIf` is instance policy.
- Cross-machine misses often come from absolute paths, generated metadata, timestamps, locale/time zone, line endings, or tool installation paths.
- Overlapping outputs disable reliable cache/up-to-date reasoning. Give each task a distinct output location unless a built-in task type models sharing.
- Pre-existing unmanaged files inside a declared output location count as output overlap evidence; move the task output to an empty task-owned location or model the external producer before expecting cache storage.
- Incorrect hits are more serious than misses; disable caching until undeclared inputs or non-deterministic outputs are fixed.
- Annotation processors and code generators need special care because they often read files or classpaths not obvious from compile task inputs; declare processor config/resources as `JavaCompile` inputs when they affect generated sources or compiler behavior.
- For Java compilation, an annotation processor on the compile classpath makes the processor path default to the full compile classpath and reduces compile-avoidance benefits; declare a narrow annotation processor path or disable processing when unused.

## Task Requirements

- Declare all inputs, outputs, local state, destroyables, and service references.
- Normalize file paths and classpaths appropriately.
- Avoid absolute paths, timestamps, random data, host-specific outputs, and untracked environment reads in outputs.
- For custom incremental task implementation, read [task-types-and-validation.md](task-types-and-validation.md); here, only check whether changed inputs, removed outputs, or non-incremental execution explain reuse behavior.
- If a task handles removed inputs incorrectly or always falls back to non-incremental execution, treat that as task implementation evidence before changing cache policy.
- Mark non-cacheable tasks explicitly when work is not safely reusable.
- Use `Task.doNotTrackState("...")` or `@UntrackedTask` only when a task must always run or its state cannot be represented as files/properties, such as updating an external service.
- Untracked tasks are always out of date, cannot use incremental `InputChanges`, and are not stored in or loaded from the build cache.
- Untracked tasks also do not clean stale files from declared output locations; if output cleanup matters, model the state instead of opting out of tracking.
- Use `@LocalState` for non-relocatable analysis or task-local caches only; Gradle removes local state when loading task outputs from the build cache, so required outputs must be declared as outputs.
- Prefer `@CacheableTask` or `@DisableCachingByDefault` when cacheability is stable for a task type; use `outputs.cacheIf("...", spec)` or `outputs.doNotCacheIf("...", spec)` only when cacheability genuinely varies by task instance or execution context.
- Prefer no cache for cheap copy/archive tasks unless their work is expensive enough and their inputs/outputs are modeled carefully.
- Prefer artifact transforms for cacheable dependency artifact conversions; read [dependency-artifact-transforms.md](dependency-artifact-transforms.md) before modeling one as a task.

## Diagnostics

- Use Build Scan cache performance views when policy permits.
- Use `--info` to inspect up-to-date and cache reasons.
- Use `-Dorg.gradle.caching.debug=true` for targeted cache-key and input fingerprint diagnostics, not as a default CI flag.
- Measure performance separately: a controlled clean local-cache repeat estimates the fully cached ceiling; cache-enabled and cache-disabled CI lanes measure real impact apart from queue, checkout, and pipeline time.
- Use Build Scan cache performance data to separate local hits, remote hits, misses, remote transfer time, and network bottlenecks.
- Validate in order: repeated build without cache becomes up-to-date; clean repeated build with local cache loads cacheable work; equivalent checkouts in different directories prove relocatability before remote rollout.
- Compare local and CI input properties when cross-machine misses occur.
- Separate "task ran because input changed" from "task is not cacheable" from "cache key differs".
- For cross-platform cache reuse, check file encoding, line endings, symlinks, Java vendor/implementation inputs, and generated archive reproducibility before blaming remote cache transport.
- When environment variables affect outputs, declare them as inputs. For path-valued environment variables, prefer tracking the pointed-to file contents, directory contents, or tool version instead of a raw absolute path when relocatability matters.
- Set Gradle daemon encoding explicitly, usually `org.gradle.jvmargs=-Dfile.encoding=UTF-8`, and configure Java tools separately when outputs depend on text encoding.

## Cacheability Pitfalls

- Conditional `doFirst`/`doLast` actions on cacheable tasks change task action implementation fingerprints; prefer separate typed tasks or unconditional wiring.
- Do not mutate task inputs or outputs inside `doFirst`/`doLast`; runtime model changes are invisible to up-to-date and cache-key calculation when the task does not execute.
- Avoid `outputs.upToDateWhen` as a repair for missing state modeling; declare the real inputs and outputs because cached or up-to-date outputs can change without task actions running.
- Unknown implementation fingerprints from non-Gradle classloaders, non-serializable Java lambdas, task actions, or nested inputs disable caching; move cacheable behavior into stable task/action classes loaded by Gradle.
- Third-party plugins can damage built-in task cacheability by adding absolute paths, volatile values, or outcome-dependent runtime inputs; inspect plugin-added inputs before changing Gradle's cache policy or built-in task settings.
- Do not base build logic on whether a task executed. `FROM-CACHE`, up-to-date, and executed outputs must be modeled through inputs and outputs.
- Runtime classpath normalization is declared by the consuming project/task and can ignore volatile classpath entries, such as audit `build-info.properties`, without changing the actual runtime classpath.
- Configure runtime classpath normalization before execution starts; after first use Gradle rejects ignore, property, and `META-INF` rule changes, so keep them in stable project or convention-plugin configuration.
- Prefer runtime classpath properties normalization when only selected keys are volatile; use resource-level ignores only when the entire file or `META-INF` area is non-semantic for the consumer.
- Non-repeatable upstream outputs become unstable inputs for downstream cacheable tasks. Prefer reproducible producer outputs or consumer input normalization before trying to cache a volatile producer just to stabilize downstream keys.
- If volatile data is only needed for publishing or auditing, split expensive cacheable work from cheap volatile stamping.
- Re-released non-changing dependencies, snapshots, changing modules, and volatile web resources create unexplained cross-machine misses; prefer fixed inputs, locks, or composite builds.

## Remote Cache Policy

- Developer machines usually pull; CI may push after trusted verification.
- Do not let untrusted pull requests populate a shared remote cache.
- Use separate cache namespaces or credentials for release, mainline, and experimental workflows when trust differs.
- Until every cacheable task has proven stale-output-safe incremental behavior, allow only clean trusted builds to upload to a shared cache.
- Treat developer uploads as high risk because source or output files can change while tasks execute; allow them only after task cacheability and workspace discipline are proven.
- Disable cache use or require provenance evidence for release or audit builds when reused outputs must be traceable to the producing build.
- Pair remote cache rollout with task validation warnings and representative clean/warm builds.
- If HTTP remote cache operations keep failing after connection, Gradle retries then disables the remote cache for the rest of that build; diagnose transport, server, proxy, or TLS trust before changing task inputs.
- Treat insecure HTTP, `allowUntrustedServer`, redirect, and Expect-Continue choices as remote-cache transport or security policy; they do not explain task input cache misses.
