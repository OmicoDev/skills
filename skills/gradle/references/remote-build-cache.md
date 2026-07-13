# Gradle Remote Build Cache

Read this when: remote build-cache enablement, push/pull policy, composite-build cache ownership, HTTP transport, credentials, redirects, or remote-cache failures own the work.

## Ownership And Ordering

- Enable task output caching globally with `--build-cache` or `org.gradle.caching=true`; configure local and remote services in `settings.gradle(.kts)`. Treat this invocation-level switch as policy instead of mutating `gradle.startParameter.buildCacheEnabled` from build logic.
- `enabled` controls whether a configured service participates at all. `push` controls writes only after that service is enabled; it does not create a write-only cache.
- The built-in local cache is enabled and push-capable by default. A remote cache must be configured, and remote push defaults to false.
- Gradle loads local first, then remote. A remote hit is copied into the local cache before reuse, so later requests can avoid the network.
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

- The built-in HTTP cache loads `GET <base>/<cache-key>` and stores `PUT <base>/<cache-key>`. Treat `2xx` as success and `404` on load as a miss; diagnose other statuses as server, proxy, authentication, or protocol evidence rather than task-input misses.
- HTTP Basic credentials are sent preemptively. Supply them from user/CI secrets, keep them out of the URL and repository files, and require HTTPS so the first request does not expose them in transit.
- For upload redirects, only `307` and `308` preserve `PUT` and its body. Other redirect codes are followed as `GET`; fix the cache server or proxy redirect instead of changing Gradle task inputs.
- `useExpectContinue` is available since Gradle 7.2. Enable it only when the server and proxies support it and rejected or redirected uploads justify the extra successful-request round trip.
- Prefer a trusted certificate and HTTPS. `allowUntrustedServer` disables server-identity verification, while `allowInsecureProtocol` permits plaintext HTTP; both are explicit security exceptions, not cache-miss fixes.

## Failure Isolation

- By default, a remote load or store exception is logged and disables that remote service for the remainder of the current build; Gradle can continue by executing work and using the local cache. The next invocation tries the configured remote service again.
- On Gradle 7.2+, transmission failures after a TCP connection is established, such as dropped connections and read/write timeouts, are retried up to three times before the operation fails. Do not assume HTTP error statuses or initial connection failures receive the same retry path.
- If only the first cache request appears in server logs, look for the warning that disabled the remote service before diagnosing later tasks as independent misses.
- If `--offline` reports the remote cache disabled, do not debug TLS, credentials, redirects, or server availability until online access is intentionally restored.
- Separate transport failures from cache-key failures: transport evidence includes timeouts, connection resets, TLS, authentication, redirects, and HTTP statuses; cache-key evidence includes different normalized inputs, task implementations, tool versions, and output property names.
- Use `--info` or a policy-approved Build Scan to confirm whether a result came from local cache, remote cache, or execution. Do not infer remote health merely from `FROM-CACHE`, because a remote hit is backfilled locally.
