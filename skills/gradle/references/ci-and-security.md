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
- Pin the JDK that runs Gradle and keep it distinct from Java toolchains used by project tasks.
- Cache Gradle user home deliberately; avoid caching project `build/` directories unless the workflow is designed for it.
- Keep release and publishing tasks behind explicit gates.
- Run publishing dry-runs or local publication checks before real remote publishing.
- Validate wrapper JARs in pull requests when CI ecosystem supports it.

## CI Cache Hygiene

- Cache wrapper distributions and dependency caches separately from task outputs.
- Invalidate caches when wrapper, verification metadata, repository policy, or major plugin versions change.
- Avoid sharing Gradle user home caches between unrelated repositories.
- Prefer dependency-cache seeding or read-only dependency caches for ephemeral containers instead of sharing one mutable Gradle user home concurrently.
- Do not cache secrets, local Maven publications, or temporary signing material.
- Prefer deterministic CI entrypoints over IDE-generated or developer-local commands.

## Credentials And Secrets

- Read credentials through providers and CI secret storage.
- Do not commit credentials in wrapper distribution URLs, repository URLs, publishing repositories, or `gradle.properties`.
- Use host-scoped wrapper authentication properties for private wrapper distributions.
- Keep signing credentials and publishing credentials separate from dependency verification metadata.

## Repository Hardening

- Prefer HTTPS repositories with scoped credentials.
- Use content filters for internal repositories and mirrors.
- Avoid broad public fallback repositories unless coordinate ownership is clear.
- Keep plugin repositories and dependency repositories separately governed.
- Treat `mavenLocal()` as local development state, not trusted CI input.

## Security Boundaries

- Wrapper verification protects the Gradle runtime distribution and wrapper JAR.
- Dependency verification protects downloaded dependencies.
- Repository content filters reduce repository shadowing risk.
- Lockfiles improve reproducibility but do not prove artifact trust.
- Configuration cache may serialize configuration state; keep secrets modeled according to Gradle guidance.

## Release Gate Checks

- Run representative tests on the same Gradle runtime and JDK used for release.
- Verify publications without credentials when possible, then with release credentials in the gated job.
- Check wrapper validation, dependency verification, lock diffs, and signing configuration before remote publish.

## Source Calibration

Primary upstream pages: Securing Gradle Builds, Verifying Dependencies, Gradle Wrapper, Maven Publish Plugin, Publishing Plugins to the Gradle Plugin Portal.
