# Gradle Dependency Repositories

Read this when: repository declarations, plugin repositories, metadata sources, content filters, repository cache behavior, dynamic versions, or changing modules own dependency behavior.

## Repository Ownership

- Plugin repositories belong in `pluginManagement { repositories { ... } }`.
- Dependency repositories usually belong in `dependencyResolutionManagement { repositories { ... } }` when central governance is desired.
- Project-level repositories should be intentional exceptions, not hidden fallbacks.
- Repository mode is owner policy: default `PREFER_PROJECT` lets project repositories override settings repositories, `PREFER_SETTINGS` ignores project repositories after a warning, and `FAIL_ON_PROJECT_REPOS` turns project repositories into build errors.
- Use content filters or `exclusiveContent` when an internal repository owns a coordinate namespace.
- Avoid `mavenLocal()` in normal resolution unless local publication is part of the workflow.
- Avoid `flatDir` for real dependencies because it has no transitive metadata.
- Configure repositories with typed action blocks; map overloads such as `flatDir(Map)` and `mavenCentral(Map)` are deprecated in Gradle 9.6+.
- Gradle ignores repositories declared inside consumed Maven POM metadata; repository trust remains owned by the build's declared repositories.
- On Gradle 9+, `jcenter()` is removed; replace it deliberately with `mavenCentral()` or an internal mirror plus content filters instead of adding broad fallback repositories.

## Content Filters

- Repository order matters; filters reduce search, leakage, and incorrect artifact risk.
- During a fresh resolve, the repository that supplies module metadata is also where Gradle tries to download that module's artifacts; later repositories are not per-artifact fallbacks.
- Include filters exclude everything not included; exclude filters include everything not excluded; with both, only explicitly included and not excluded modules remain.
- A normal include filter does not make a coordinate exclusive. Other repositories can still provide it unless every repository is filtered.
- Content filters affect dynamic version listing as well as metadata and artifact lookup; if a dynamic selector cannot see a version, check the repository filter before changing metadata sources.
- Configure repository content filters before any dependency resolution; once a repository has been used, Gradle rejects content-filter mutation.
- Use `exclusiveContent` when exactly one repository owns a group, module, or version range.
- When using exclusive content in `pluginManagement`, declare all plugin and buildscript repositories in that layer; later `buildscript.repositories` additions can become illegal.
- For Maven repositories that physically or politically split release and snapshot artifacts, use `mavenContent { releasesOnly() }` or `mavenContent { snapshotsOnly() }`.
- Avoid Maven `artifactUrls`; it splits POM and artifact lookup across URLs, has no Maven equivalent, and is deprecated without a direct replacement.
- Treat unfiltered fallback repositories as a security decision, not a convenience default; they can silently satisfy coordinates that were intended for filtered repositories.
- When setting exclusive content, also decide where transitive dependencies of those modules are allowed to resolve.
- Use context filters by configuration or attributes only when the repository really differs by resolution context; otherwise simple group/module filters are easier to audit.

## Metadata Sources

- Prefer Gradle Module Metadata when available because it preserves variants, capabilities, constraints, and rich versions.
- Maven POM and Ivy metadata may need [dependency-metadata-rules.md](dependency-metadata-rules.md) when variants, dependencies, capabilities, or status are incomplete.
- Artifact-only metadata is a last-resort interop mode for legacy repositories without descriptors.
- `metadataSources` selects which metadata formats are allowed; Gradle still probes enabled sources in its predefined order, so changing sources changes the graph Gradle can see, not just download performance or DSL precedence.
- `artifact()` metadata sources can find files without descriptors, but they cannot recover dependencies, variants, capabilities, or status; do not use them to mask missing publication metadata.
- Add `artifact()` as a fallback after descriptor sources only when descriptorless modules are expected; artifact-first policies make transitive dependencies invisible.
- `flatDir` synthesizes ad hoc metadata from files and cannot override a module that another declared repository provides with real metadata.
- Do not fix metadata-source problems by adding broad repositories.
- For Ivy repositories, verify `layout`, descriptor patterns, artifact patterns, and `m2compatible` before treating a coordinate as absent.
- If all modules in a repository are published with Gradle Module Metadata, a metadata-source policy can reduce network probes.
- Maven POM or Ivy descriptors can contain a marker that redirects Gradle to matching Gradle Module Metadata; use `ignoreGradleMetadataRedirection()` only for a known broken repository or producer because it can force legacy metadata and lose variant semantics.
- Enable Ivy dynamic resolve mode only for Ivy repositories where `revConstraint` should override `rev`; it is not a Maven or custom resolver feature.
- Repository-level `ComponentMetadataSupplier` provides initial component metadata instead of parsing a remote descriptor; its builder can set status, status scheme, and attributes, then component metadata rules still run for dependency, variant, capability, and file repairs.
- Repository-level `ComponentMetadataVersionLister` is dynamic-selector infrastructure: it lists available module versions and can use repository resources, but fixed versions do not call it and version policy still belongs in constraints, platforms, locks, or status rules.
- If `1.+`, version ranges, or `latest.*` fail before fixed-version metadata lookup, inspect content filters, Maven/Ivy version-listing metadata, artifact-directory fallback, or a custom version lister before changing constraints or metadata rules.

## Local Repositories

- File-backed Maven/Ivy repositories bypass Gradle's dependency cache because their contents can change between executions.
- Local repositories weaken reproducibility and can hide missing publication or repository configuration.
- `mavenLocal()` is acceptable for local producer/consumer testing; prefer composite builds for source-level replacement.
- If `mavenLocal()` is unavoidable, restrict it with content filters and place it only where local artifacts should genuinely override remote artifacts.
- Document any committed `mavenLocal()` or file repository use with the workflow that requires it.
- Gradle can reuse matching artifacts from the local Maven cache when a remote checksum verifies them; that reuse does not require declaring `mavenLocal()`.
- When debugging `mavenLocal()` misses, confirm the actual local Maven path; user `~/.m2/settings.xml` can override the default `~/.m2/repository`.

## Credentials And Protocols

- Keep repository credentials out of build scripts; declare the credential type on the repository and supply values through Gradle properties, command-line properties, or environment-backed properties.
- Credential lookup property names are derived from the repository name. Treat repository renames as credential key changes and update CI secrets at the same time.
- Gradle normally waits for an HTTP authentication challenge before sending credentials. If a private repository returns 404 or another non-401 response for unauthenticated requests, explicitly configure the authentication scheme such as `BasicAuthentication`.
- Use header credentials for token/OAuth-style repositories instead of encoding tokens as usernames or passwords.

## Cache Behavior

- Gradle caches module metadata, artifact metadata, downloaded files, dynamic version results, changing-module results, and negative lookups.
- Repository metadata caches are independent by repository URL, type, and layout; a miss cached for one repository does not prove the module is absent everywhere.
- Resolved modules and artifacts are sticky to the repository that supplied them. If a required artifact is missing from that repository later, Gradle fails instead of silently falling through to another repository.
- Repository stickiness can explain CI/local differences when repository lists, mirrors, credentials, content filters, or init scripts differ.
- Artifacts are stored by checksum, so the cache can hold different bytes for the same coordinates from different repositories without overwriting.
- Dynamic versions and changing modules default to a 24-hour cache; shorten or disable the TTL only as an explicit reproducibility and repository-traffic policy.
- Use `--refresh-dependencies` only to test or refresh stale dependency cache state. It refreshes metadata/dynamic/changing decisions and may use HEAD/checksum checks; it is not a guaranteed redownload and mainly matters for dynamic or changing dependencies.
- Use `--offline` only to verify whether the local cache already contains required artifacts; it does not refresh expired dynamic/changing decisions and fails on missing modules.
- Gradle dependency-cache locking assumes cooperating Gradle processes. Containerized builds usually should not share one mutable Gradle user home concurrently.
- For ephemeral CI, prefer deliberate dependency-cache seeding or a `GRADLE_RO_DEP_CACHE` read-only dependency cache over sharing mutable Gradle user homes across unrelated builds.
- A `GRADLE_RO_DEP_CACHE` cache supplements the build's writable Gradle user home; seed it from a copied dependency cache and do not point it at a live cache that another build may mutate.
- When copying dependency caches, preserve the `modules-2` structure and avoid copying lock or garbage-collection files.
- Treat dependency cache retention as an optimization, not artifact storage; Gradle can clean unused cached files, so hermetic CI still needs declared repositories, verification, locks, or an explicit seed step.

## Diagnostics

- If a module is missing, check repository ownership, content filters, coordinates, credentials, and metadata sources before adding a repository.
- If an Ivy module is missing or artifacts are missing after metadata resolves, compare the configured Ivy layout and patterns with the repository's real descriptor and artifact paths.
- If CI resolves a different artifact, compare repository order, mirrors, credentials, Gradle user home cache, and init scripts.
- If an internal repository shadows public coordinates, repair content filters before trusting the downloaded artifact.
- If plugin resolution fails, fix plugin repositories rather than dependency repositories.
- If a project repository is ignored or forbidden, inspect `repositoriesMode` and project repositories added by plugins before changing repository URLs or content filters.
- If resolution is slow, inspect repository count/order, dynamic selectors, changing modules, [dependency-metadata-rules.md](dependency-metadata-rules.md), and network/cache behavior.
- If `--refresh-dependencies` appears to do nothing, check whether the dependency is static and unchanged, whether remote checksums match, and whether a changing dependency was declared correctly.
