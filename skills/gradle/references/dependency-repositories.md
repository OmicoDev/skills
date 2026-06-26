# Gradle Dependency Repositories

Read this when: repository declarations, plugin repositories, metadata sources, content filters, repository cache behavior, dynamic versions, or changing modules own dependency behavior.

## Repository Ownership

- Plugin repositories belong in `pluginManagement { repositories { ... } }`.
- Dependency repositories usually belong in `dependencyResolutionManagement { repositories { ... } }` when central governance is desired.
- Project-level repositories should be intentional exceptions, not hidden fallbacks.
- `PREFER_PROJECT` is the default repository mode: project repositories override settings repositories.
- Use `PREFER_SETTINGS` when settings repositories should win but project repositories should only warn.
- Use `FAIL_ON_PROJECT_REPOS` when settings must be the only dependency repository policy.
- Use content filters or `exclusiveContent` when an internal repository owns a coordinate namespace.
- Avoid `mavenLocal()` in normal resolution unless local publication is part of the workflow.
- Avoid `flatDir` for real dependencies because it has no transitive metadata.

## Content Filters

- Repository order matters; filters reduce search, leakage, and incorrect artifact risk.
- A normal include filter does not make a coordinate exclusive. Other repositories can still provide it unless every repository is filtered.
- Use `exclusiveContent` when exactly one repository owns a group, module, or version range.
- When using exclusive content in `pluginManagement`, declare all plugin and buildscript repositories in that layer; later `buildscript.repositories` additions can become illegal.
- Split snapshots and releases when repository policy or performance needs it.
- Treat public fallback repositories as a security decision, not a convenience default.
- When setting exclusive content, also decide where transitive dependencies of those modules are allowed to resolve.
- Use context filters by configuration or attributes only when the repository really differs by resolution context; otherwise simple group/module filters are easier to audit.

## Metadata Sources

- Prefer Gradle Module Metadata when available because it preserves variants, capabilities, constraints, and rich versions.
- Maven POM and Ivy metadata may need component metadata rules when variants, dependencies, capabilities, or status are incomplete.
- Artifact-only metadata is a last-resort interop mode for legacy repositories without descriptors.
- Do not fix metadata-source problems by adding broad repositories.
- If all modules in a repository are published with Gradle Module Metadata, a metadata-source policy can reduce network probes.
- Use `ignoreGradleMetadataRedirection()` only for a known broken repository or producer, not as a general compatibility toggle.

## Local Repositories

- File-backed Maven/Ivy repositories bypass Gradle's dependency cache because their contents can change between executions.
- Local repositories weaken reproducibility and can hide missing publication or repository configuration.
- `mavenLocal()` is acceptable for local producer/consumer testing; prefer composite builds for source-level replacement.
- Document any committed `mavenLocal()` or file repository use with the workflow that requires it.

## Cache Behavior

- Gradle caches module metadata, artifacts, dynamic version results, and changing-module results.
- Repository caches are independent by repository URL, type, and layout. Gradle also caches the absence of a module or artifact in a repository.
- Resolved modules and artifacts are sticky to the repository that supplied them. If the same coordinates later exist elsewhere, Gradle avoids silently switching sources.
- Repository stickiness can explain CI/local differences when repository lists, mirrors, credentials, content filters, or init scripts differ.
- Artifacts are stored by checksum, so the cache can hold different bytes for the same coordinates from different repositories without overwriting.
- Dynamic version and changing-module TTLs affect repository traffic and reproducibility; change them only as policy.
- Use `--refresh-dependencies` only to test or refresh stale dependency cache state. It refreshes metadata/dynamic/changing decisions and may use HEAD/checksum checks; it is not a guaranteed redownload and mainly matters for dynamic or changing dependencies.
- Use `--offline` only to verify whether the local cache already contains required artifacts.
- Gradle dependency-cache locking assumes cooperating Gradle processes. Containerized builds usually should not share one mutable Gradle user home concurrently.
- For ephemeral CI, prefer deliberate dependency-cache seeding or a read-only dependency cache over sharing mutable Gradle user homes across unrelated builds.
- When copying dependency caches, preserve the `modules-2` structure and avoid copying lock or garbage-collection files.

## Diagnostics

- If a module is missing, check repository ownership, content filters, coordinates, credentials, and metadata sources before adding a repository.
- If CI resolves a different artifact, compare repository order, mirrors, credentials, Gradle user home cache, and init scripts.
- If an internal repository shadows public coordinates, repair content filters before trusting the downloaded artifact.
- If plugin resolution fails, fix plugin repositories rather than dependency repositories.
- If resolution is slow, inspect repository count/order, dynamic selectors, changing modules, metadata rules, and network/cache behavior.
- If `--refresh-dependencies` appears to do nothing, check whether the dependency is static and unchanged, whether remote checksums match, and whether a changing dependency was declared correctly.

## Source Calibration

Primary upstream pages: Declaring Repositories, Centralizing Repositories, Filtering Repository Content, Supported Metadata Formats, Dependency Caching.
