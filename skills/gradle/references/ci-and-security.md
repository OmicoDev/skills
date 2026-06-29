# Gradle CI And Security

Read this when: CI execution, credentials, repository hardening, dependency trust, dependency verification, wrapper security, or release gates own the work.

## First Choice

- Read [publications-and-signing.md](publications-and-signing.md) for Maven/Ivy publications, Gradle Module Metadata, signing, Plugin Portal publishing, and dry runs.
- Read [dependency-verification.md](dependency-verification.md) for dependency checksums, signatures, trusted keys, bootstrapping, and failure handling.
- Read [runtime-and-structure.md](runtime-and-structure.md) for wrapper distribution checksums and wrapper JAR validation.
- Read [dependency-repositories.md](dependency-repositories.md) for repository hardening, content filters, and cache behavior.
- Read [dependency-locking.md](dependency-locking.md) for lock diffs and reproducible selected versions.

## CI Baseline

- Use wrapper commands in CI, not globally installed Gradle.
- In containers, a plain pinned JDK image plus the checked-in wrapper usually beats a Gradle image with a preinstalled Gradle version; use the Gradle image mainly when the source tree has no wrapper or the workflow intentionally provisions Gradle outside the repo.
- Pin the JDK that runs Gradle and keep it distinct from Java toolchains used by project tasks.
- Choose daemon policy by runner lifecycle: persistent agents can benefit from the daemon, while one-build short-lived containers may use `--no-daemon` to avoid startup and teardown noise.
- Cache Gradle user home deliberately; avoid caching project `build/` directories unless the workflow is designed for it.
- Keep release and publishing tasks behind explicit gates.
- Run publishing dry-runs or local publication checks before real remote publishing.
- Validate wrapper JARs in pull requests when CI ecosystem supports it.
- When wrapper `distributionUrl` or `distributionSha256Sum` changes, include one CI/review lane with a clean or controlled Gradle user home so an already-downloaded distribution cannot mask checksum verification.
- On GitHub Actions, prefer the maintained `gradle/actions/setup-gradle` action over the deprecated `gradle/gradle-build-action`; it handles Gradle User Home caching, wrapper validation, and Build Scan summaries.
- Use standalone `gradle/actions/wrapper-validation` only when a workflow does not otherwise use `setup-gradle`.
- Use `gradle/actions/dependency-submission` when GitHub's dependency graph and Dependabot alerts are part of the supply-chain signal; it needs `contents: write` and the repository dependency graph features enabled.
- Treat `dependency-submission` as a dedicated graph-generation workflow; for missing or noisy graph entries, tune build root, project/configuration filters, dependency-resolution task, and extra Gradle arguments before changing release or verification tasks.

## CI Cache Hygiene

- Cache wrapper distributions and dependency caches separately from task outputs.
- Invalidate caches when wrapper, verification metadata, repository policy, or major plugin versions change.
- Avoid sharing Gradle user home caches between unrelated repositories.
- Let only trusted branches, jobs, or one primary matrix leg write shared Gradle user home caches; feature branches and secondary matrix legs should usually read existing cache entries without updating them.
- On GitHub Actions, model that policy with `setup-gradle` cache modes: read-only for feature branches or non-primary matrix legs, write-only only for deliberate cache seeding, and disabled when cache contents are not trusted.
- Prefer dependency-cache seeding or read-only dependency caches for ephemeral containers instead of sharing one mutable Gradle user home concurrently.
- On archive-upload cache systems, prefer wrapper-only or read-only dependency caches on shared ephemeral runners; reserve full Gradle User Home caches for dedicated/self-hosted runners or persistent volumes where upload/download cost is lower than reuse.
- When a CI cache can only save workspace paths, relocate `GRADLE_USER_HOME` under the checked-out workspace deliberately and exclude secrets, project `build/` outputs, and mutable publications from that cache.
- Cache configuration-cache entries across CI jobs only when the build's secret model is understood and the CI cache integration provides an encryption key or equivalent protection.
- For GitHub Actions configuration-cache reuse, provide `cache-encryption-key`; otherwise keep configuration-cache entries out of shared CI caches.
- Do not cache secrets, local Maven publications, or temporary signing material.
- Prefer deterministic CI entrypoints over IDE-generated or developer-local commands.

## Credentials And Secrets

- Read credentials through provider APIs and CI secret storage; for project-property secrets in unattended builds, inject `ORG_GRADLE_PROJECT_*` rather than committing `gradle.properties`.
- Do not commit credentials in wrapper distribution URLs, repository URLs, publishing repositories, or `gradle.properties`.
- Use host-scoped wrapper authentication properties for private wrapper distributions.
- Keep signing credentials and publishing credentials separate from dependency verification metadata.
- Name secured repositories deliberately: Gradle derives credential property prefixes from the repository name, so a rename changes expected CI/user properties.
- Let Gradle require repository credentials only when a selected task needs that repository; avoid eager environment reads that fail unrelated local or PR tasks.
- Use `HttpHeaderCredentials` for token/OAuth-style repository auth, and declare Basic authentication only when a server needs preemptive credentials rather than a normal 401 challenge.

## Repository Hardening

- Prefer HTTPS repositories with scoped credentials.
- Treat `http` repositories and `allowInsecureProtocol` as explicit exceptions; prefer failing or upgrading generated/imported repository URLs to HTTPS.
- Use content filters for internal repositories and mirrors.
- Avoid broad public fallback repositories unless coordinate ownership is clear.
- Keep plugin repositories and dependency repositories separately governed.
- Treat `mavenLocal()` as local development state, not trusted CI input.
- For S3-backed repositories in regions requiring V4 signatures, include the region-specific endpoint to avoid repeated retries and slower dependency traffic.

## Container Builds

- Prefer a plain pinned JDK image plus the checked-in Wrapper for production container builds; reserve the official `gradle` image for quick experiments, no-wrapper builds, or intentionally provisioned Gradle runtimes.
- On GitHub Actions, prefer `setup-gradle` on a normal runner over a Gradle container job when caching, wrapper validation, or Build Scan summaries matter.
- Run official Gradle containers as the non-root `gradle` user when bind-mounting the workspace so generated files are not root-owned.
- Pin Docker image tags to specific Gradle, JDK, and base-image versions; avoid `latest` or unqualified tags for reproducible CI.
- Preserve `GRADLE_USER_HOME` with a platform cache or volume in ephemeral containers, but prefer a remote build cache for task-output reuse across distributed agents.

## Security Boundaries

- Treat supply-chain hardening as three separate checks: dependency artifacts/plugins, repository source policy, and the Gradle runtime/wrapper.
- Treat Gradle plugins as executable dependencies: pin versions, resolve them from scoped plugin repositories, and review plugin upgrades with the same care as library or wrapper upgrades.
- Wrapper verification protects the Gradle runtime distribution and wrapper JAR.
- `distributionSha256Sum` protects the downloaded distribution ZIP; wrapper JAR validation protects the checked-in launcher JAR. Run both checks when wrapper files change.
- Dependency verification protects downloaded dependencies.
- Repository content filters reduce repository shadowing risk.
- Lockfiles improve reproducibility but do not prove artifact trust.
- Configuration cache may serialize configuration state; keep secrets modeled according to Gradle guidance.

## Release Gate Checks

- Run representative tests on the same Gradle runtime and JDK used for release.
- Verify publications without credentials when possible, then with release credentials in the gated job.
- Check wrapper validation, dependency verification, lock diffs, and signing configuration before remote publish.
- For CI release jobs that compute versions from VCS tags, fetch tags in the checkout and prevent tag-triggered recursion before blaming Gradle publishing or versioning behavior.
- For private wrapper distributions, prefer host-scoped wrapper credentials or `wrapperToken` in CI/user properties; a token takes precedence over username/password and should not be sent to unintended hosts.

## Source Calibration

Primary upstream pages: Gradle on CI, Gradle on GitHub Actions, Gradle on GitLab CI, Gradle Docker Images, Securing Gradle Builds, Best Practices for Security, Verifying Dependencies, Supported Repository Protocols, Gradle Wrapper, Maven Publish Plugin, Publishing Plugins to the Gradle Plugin Portal.
