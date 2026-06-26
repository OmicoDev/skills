# Gradle Build Cache And Incremental Work

Read this when: task output caching, up-to-date checks, incremental inputs, artifact transform caching, remote cache policy, or cache misses owns the work.

## Model

- Up-to-date checks reuse local outputs when inputs and outputs are unchanged.
- Build cache reuses task or artifact-transform outputs from local or remote cache storage.
- Incremental tasks receive changed input information and can process only affected files.
- Cacheability requires declared inputs/outputs plus deterministic and relocatable outputs for the intended cache.
- Build cache keys include task type/classpath, task action implementations, output property names, input names/values, relevant build script content, Gradle distribution classpath, `buildSrc`, and plugin classpaths.
- Task names and project paths do not by themselves make outputs different; equivalent tasks can reuse outputs across paths.

## Adoption

- Start with built-in cacheable tasks and local cache evidence.
- Use remote cache in CI with clear push/pull policy. Commonly CI pushes and developer machines pull.
- Avoid pushing untrusted or developer-local outputs to shared remote cache.
- Treat `buildSrc` and included builds as separate builds with their own cache behavior.
- Keep CI cache of Gradle user home separate from Gradle build cache policy.
- Do not mark custom task types cacheable by default. Add `@CacheableTask` only when outputs are worth reusing and correctness is tested; use `@DisableCachingByDefault` with a reason otherwise.

## Miss Triage

- First ask whether the task is cacheable at all.
- Locate the first executed cacheable task in a miss chain; later misses may be consequences of that earlier task.
- Then compare task input fingerprints, output property names, Gradle version, Java/tool versions, environment inputs, and normalized paths.
- Cross-machine misses often come from absolute paths, generated metadata, timestamps, locale/time zone, line endings, or tool installation paths.
- Overlapping outputs disable reliable cache/up-to-date reasoning. Give each task a distinct output location unless a built-in task type models sharing.
- Incorrect hits are more serious than misses; disable caching until undeclared inputs or non-deterministic outputs are fixed.
- Annotation processors and code generators need special care because they often read files or classpaths not obvious from compile task inputs.
- For Java compilation, an annotation processor on the compile classpath makes the processor path default to the full compile classpath and reduces compile-avoidance benefits; declare a narrow annotation processor path or disable processing when unused.

## Task Requirements

- Declare all inputs, outputs, local state, destroyables, and service references.
- Normalize file paths and classpaths appropriately.
- Avoid absolute paths, timestamps, random data, host-specific outputs, and untracked environment reads in outputs.
- Mark non-cacheable tasks explicitly when work is not safely reusable.
- Prefer no cache for cheap copy/archive tasks unless their work is expensive enough and their inputs/outputs are modeled carefully.
- Prefer artifact transforms for cacheable artifact conversions.

## Diagnostics

- Use Build Scan cache performance views when policy permits.
- Use `--info` to inspect up-to-date and cache reasons.
- Use `-Dorg.gradle.caching.debug=true` for targeted cache-key and input fingerprint diagnostics, not as a default CI flag.
- Validate in order: repeated build without cache should become up-to-date; clean repeated build with local cache should load cacheable work; equivalent checkouts in different directories should prove relocatability before remote rollout.
- Start cache-miss diagnosis at the first executed cacheable task in the chain; later misses may only reflect changed upstream outputs.
- Compare local and CI input properties when cross-machine misses occur.
- Separate "task ran because input changed" from "task is not cacheable" from "cache key differs".
- Test relocatability by comparing equivalent checkouts in different directories before trusting cross-machine reuse.
- For cross-platform cache reuse, check file encoding, line endings, symlinks, Java vendor/implementation inputs, and generated archive reproducibility before blaming remote cache transport.

## Cacheability Pitfalls

- Conditional `doFirst`/`doLast` actions on cacheable tasks change task action implementation fingerprints; prefer separate typed tasks or unconditional wiring.
- Do not base build logic on whether a task executed. `FROM-CACHE`, up-to-date, and executed outputs must be modeled through inputs and outputs.
- If volatile data is only needed for publishing or auditing, split expensive cacheable work from cheap volatile stamping.
- Re-released non-changing dependencies, snapshots, changing modules, and volatile web resources create unexplained cross-machine misses; prefer fixed inputs, locks, or composite builds.

## Remote Cache Policy

- Developer machines usually pull; CI may push after trusted verification.
- Do not let untrusted pull requests populate a shared remote cache.
- Use separate cache namespaces or credentials for release, mainline, and experimental workflows when trust differs.
- Pair remote cache rollout with task validation warnings and representative clean/warm builds.

## Source Calibration

Primary upstream pages: Build Cache, Build Cache Concepts, Build Cache Debugging, Common Caching Problems, Incremental Build.
