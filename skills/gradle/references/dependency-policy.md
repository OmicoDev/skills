# Gradle Dependency Policy

Read this when: dependency declarations, configuration roles, version ownership, platforms, catalogs, resolution escalation, or selected versions are the main surface.

## First Choice

- Read [dependency-repositories.md](dependency-repositories.md) for repositories, metadata sources, content filters, dynamic/changing modules, and cache behavior.
- Read [dependency-locking.md](dependency-locking.md) for dependency lockfiles, `--write-locks`, `--update-locks`, lock modes, and reproducible selected versions.
- Read [dependency-variants-and-metadata.md](dependency-variants-and-metadata.md) for variants, capabilities, attributes, artifact transforms, component metadata rules, and project output sharing.
- Read [dependency-verification.md](dependency-verification.md) for `verification-metadata.xml`, checksums, signatures, bootstrapping, and verification failures.
- Read [publications-and-signing.md](publications-and-signing.md) when dependency metadata is produced by Maven/Ivy publishing or plugin publication.

## Scope Boundary

- This file owns what the build asks for and why a selected version is acceptable.
- Repositories own where Gradle may search and how cached metadata behaves.
- Locking owns freezing selected versions after resolution.
- Variants own which artifact or outgoing variant matches a consumer.
- Verification owns whether downloaded bytes and signatures are accepted.

## Configuration Roles

- Declarable configurations receive dependencies, such as `implementation`, `api`, `compileOnly`, `runtimeOnly`, and test buckets.
- Resolvable configurations produce files or metadata, such as compile/runtime classpaths.
- Consumable configurations expose outgoing variants and artifacts to other projects or external consumers.
- Do not declare dependencies on resolvable/consumable-only configurations. Do not resolve declaration buckets directly.
- Avoid custom configurations that are declarable, resolvable, and consumable at the same time.
- For custom configurations, use one intended role only: dependency scope, resolvable classpath/data, or consumable outgoing variant.
- Prefer role-specific factory APIs when available; otherwise set role flags directly.
- `extendsFrom` inherits dependencies, constraints, excludes, artifacts, and capabilities, but not attributes or role flags.
- Resolving another project's configuration directly is unsafe. Use project dependencies, variants, or publications to cross project boundaries.

## Declaration Rules

- Add a dependency to the project that directly uses it.
- Use `api` only when dependency types are part of the public ABI; otherwise prefer `implementation`.
- Do not add a direct dependency only to override a transitive version.
- Prefer version catalogs for shared coordinates and aliases; catalogs centralize coordinates but do not enforce selected versions.
- Use platforms/BOMs for coordinated version recommendations; use `enforcedPlatform` only when downstream override is intentionally blocked.
- Prefer constraints, rich versions, platforms, locks, or metadata rules over broad `force`.
- Apply exclusions narrowly and verify that the excluded module is not required by another dependency path.
- Avoid resolving configurations during configuration; wire files or providers into tasks so resolution happens at the owning consumer.

## Version Owner Selection

- Use a version catalog to name coordinates and share aliases.
- Use a platform or BOM to align families of modules.
- Use constraints to express a version reason for a module already in the graph.
- Use rich versions when the acceptable version range matters.
- Use strict versions only when violating the version is unsafe.
- Use dependency locking to freeze selected versions for reproducibility.
- Use component metadata rules when published metadata is wrong.
- Use substitution or composite builds for local replacement.
- Use `force` only as a last-resort resolution rule with a clear removal path.
- Consistent resolution can align selected versions across related classpaths; use it for real compile/runtime or test/runtime drift.
- For published libraries, prefer ranges plus a preferred version over pinning a single strict version unless consumers must fail on other versions.

## Rich Version Semantics

- `strictly` is strongest. It can downgrade, reject incompatible candidates, and fail consumers when another strict or required version disagrees.
- `require` is the normal direct dependency floor and can still be upgraded by conflict resolution.
- `prefer` is soft and applies only when no stronger opinion exists.
- `reject` blocks known-bad candidates and can fail a graph if Gradle would otherwise select one.
- Locks behave like strict constraints during resolution. Update lock state when selected versions intentionally change.

## Catalog Rules

- Catalogs centralize coordinates and requested versions; they do not enforce the version Gradle finally selects.
- Use constraints, platforms, locks, or strict versions when selection must be constrained.
- Catalog TOML entries do not directly express classifiers, artifact types, excludes, or capabilities. Put those at the declaration, variant, or metadata-rule owner.
- Keep aliases stable and avoid subgroup accessor traps. Prefer camelCase when a nested accessor would add noise.
- Avoid reserved alias roots such as `bundles`, `versions`, and `plugins`.
- `buildSrc` and included build logic do not automatically inherit the main catalog; import catalogs explicitly when build logic needs them.
- Plugin aliases belong in `plugins {}`; library aliases belong in `dependencies {}`.
- Use multiple catalogs only for real boundaries such as shipped artifacts vs test tooling, independent build-logic dependencies, or organization-wide published catalogs.
- `from(...)` may be called once per catalog. Add or override entries programmatically after `from(...)` when layering is intentional.
- When passing catalog entries to Gradle APIs, prefer the provider accessor when the API accepts it; avoid `.get()` unless required.

## Diagnostics

```bash
./gradlew dependencies --configuration <configuration>
./gradlew dependencyInsight --dependency <module> --configuration <configuration>
./gradlew outgoingVariants
./gradlew resolvableConfigurations
```

## Symptom Map

- `Could not find`: start with repositories, content filters, coordinates, or plugin repositories.
- `Could not resolve`: preserve the cause chain; it can be repository, metadata, conflict, verification, or variant selection.
- `No matching variant`: compare requested and candidate attributes in [dependency-variants-and-metadata.md](dependency-variants-and-metadata.md).
- Capability conflict: multiple providers claim the same feature; choose or add metadata.
- Catalog accessor error: inspect alias naming, reserved words, and plugin-vs-library context.
- Declaration version changed but selected version did not: inspect conflict resolution, platform, constraint, or lock owners.

## Source Calibration

Primary upstream pages: Declaring Dependencies, Dependency Configurations, Version Catalogs, Declaring Versions and Ranges, Platforms, Viewing and Debugging Dependencies, Dependency Resolution Consistency.
