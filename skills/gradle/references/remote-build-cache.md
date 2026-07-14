# Gradle Remote Build Cache

Read this when: remote build-cache enablement, push/pull policy, composite-build cache ownership, HTTP transport, credentials, redirects, or remote-cache failures own the work.

## Ownership And Ordering

- Enable task output caching globally with `--build-cache` or `org.gradle.caching=true`; configure local and remote services in `settings.gradle(.kts)`. Treat this invocation-level switch as policy instead of mutating `gradle.startParameter.buildCacheEnabled` from build logic.
- `enabled` controls whether a configured service participates at all. `push` controls writes only after that service is enabled; it does not create a write-only cache.
- The built-in local cache is enabled and push-capable by default. A remote cache must be configured, and remote push defaults to false.
- Gradle loads local first, then remote. Gradle unpacks and restores a remote hit before attempting to backfill the downloaded entry when the local cache can store; a successful backfill lets later requests avoid the network.
- `--offline` disables the remote service for that invocation while leaving an enabled local cache available. Use this to separate transport dependency from task cacheability without turning all caching off.
- Since Gradle 4.5, one composite-build invocation shares the root build's build-cache configuration with included builds and their `buildSrc` builds. Do not expect an included build's cache block to select a different backend inside that invocation.
- A separate nested Gradle invocation, such as `GradleBuild`, owns and finalizes its own cache configuration. Distinguish it from an included build before diagnosing an unexpected backend.

## Trust And Rollout

- Developer and untrusted pull-request jobs usually pull only; allow remote push only from clean, trusted producers after representative cacheability and stale-output tests pass.
- Use separate cache namespaces or credentials for mainline, release, and experimental producers when their trust or retention policy differs.
- A shared cache reuses executable build products, not merely dependency downloads. Disable remote reuse or require provenance evidence for release and audit workflows whose outputs must be attributable to the producing build.
- Keep Gradle User Home CI caching separate from remote task-output policy. A CI archive of dependency and wrapper caches is not a remote build cache and has different trust, concurrency, and retention risks.
- Validate rollout in stages: prove up-to-date behavior, local clean-build reuse, relocatability across checkout paths, then remote pull, and only then trusted remote push.
- Pair remote rollout with task validation warnings, deterministic outputs, and representative clean/warm builds; a fast remote service cannot repair an incorrect cache key.

## HTTP Contract

- The built-in HTTP cache loads `GET <base>/<cache-key>` and stores `PUT <base>/<cache-key>`. Follow the public server contract: return `200` with the cache-entry body for a load hit, `404` for a load miss, and any `2xx` for a successful store; diagnose other statuses as server, proxy, authentication, or protocol evidence rather than task-input misses.
- HTTP Basic credentials are sent preemptively. Supply them from user/CI secrets, keep them out of the URL and repository files, and require HTTPS so the first request does not expose them in transit.
- On Gradle 7.2+, redirects are followed; for uploads, only `307` and `308` preserve `PUT` and its body, while other redirect codes are followed as `GET`. Use the final cache URL instead of relying on redirects when supporting older wrappers.
- `useExpectContinue` is available since Gradle 7.2. Enable it only when the server and proxies support it and rejected or redirected uploads justify the extra successful-request round trip.
- Prefer a trusted certificate and HTTPS. On Gradle 4.2+, `allowUntrustedServer` disables server-identity verification; on Gradle 6.0+, `allowInsecureProtocol` permits plaintext HTTP. Both are explicit security exceptions, not cache-miss fixes.

## Failure Isolation

- Build-cache implementations must report non-fatal load or store failures as `BuildCacheException`; the public SPI treats other failures as fatal. In Gradle 9.6.1, the current remote-service handle also logs and suppresses ordinary `Exception`s and, with default error disabling, disables that remote service for the remainder of the build, but custom services must not rely on this implementation detail. Gradle can continue by executing work and, when enabled, using the local cache; the next invocation tries the configured remote service again.
- A service-side integrity or checksum check that rejects an entry with `BuildCacheException` before `BuildCacheEntryReader.readFrom(...)` completes leaves no entry to unpack and stays in the documented fail-open path. Once `readFrom(...)` completes, Gradle marks the entry loaded; an exception thrown afterward does not clear that state, so the current service handle can still attempt to unpack the supplied bytes. Subsequent GZIP/TAR unpacking and archive-format validation run outside the service boundary and can fail the build, so remove or quarantine the corrupt remote entry before retrying instead of expecting Gradle to execute the task automatically.
- On Gradle 7.2+, transmission failures after a TCP connection is established, such as dropped connections and read/write timeouts, are retried up to three times before the operation fails. Do not assume HTTP error statuses or initial connection failures receive the same retry path.
- If only the first cache request appears in server logs, look for the warning that disabled the remote service before diagnosing later tasks as independent misses.
- If `--offline` reports the remote cache disabled, do not debug TLS, credentials, redirects, or server availability until online access is intentionally restored.
- Separate transport failures from cache-key failures: transport evidence includes timeouts, connection resets, TLS, authentication, redirects, and HTTP statuses; cache-key evidence includes different normalized inputs, task implementations, tool versions, and output property names.
- Use `--info` to distinguish cache reuse from execution and inspect the configured services; it does not identify whether a hit came from local or remote cache. Use policy-approved Build Scan cache-performance data for origin, transfer time, and remote health, and do not infer remote health merely from `FROM-CACHE` because a remote hit can be backfilled when the local cache can store.
