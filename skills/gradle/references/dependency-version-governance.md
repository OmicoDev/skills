# Gradle Dependency Version Governance

Read this when: version catalogs, platforms, BOMs, constraints, rich versions, consistent resolution, or cross-project version alignment owns the dependency issue.

## Owner Model

- Version catalogs name requested coordinates and versions; they do not enforce the version Gradle selects.
- Version catalogs are transparent to downstream consumers. If consumers need the version policy, publish or depend on a platform instead of relying on catalog aliases.
- Platforms and BOMs enter the dependency graph and influence transitive version alignment through constraints.
- Dependency constraints express requirements for modules that may appear in the graph; they do not add those modules.
- Rich versions describe acceptable versions; locks freeze the selected result after resolution.
- Gradle conflict resolution can select a newer transitive version than the build script declared. Decide whether the owner is detection, policy, reproducibility, or classpath alignment before adding rules.
- Consistent resolution aligns selected versions across related resolvable configurations after their normal owner rules apply.

## Version Catalogs

- Use catalogs for stable aliases, shared coordinates, dependency bundles, and plugin aliases in project `plugins {}` blocks.
- Do not use catalogs for arbitrary shared strings, non-library constants, or plugin-specific configuration; model those in typed extensions or convention plugins.
- Prefer catalogs over `project.ext`, script constants, or duplicated local variables when the value is a dependency coordinate or plugin id.
- Catalog TOML has `[versions]`, `[libraries]`, `[bundles]`, and `[plugins]`; catalog versions can use rich-version members such as `require`, `strictly`, `prefer`, `reject`, and `rejectAll`.
- You cannot declare dependency constraints in catalogs. Put constraints in the consuming configuration or a platform.
- Catalog entries are ordinary requested dependency notation once used. Conflict resolution, platforms, constraints, substitutions, and locks may still select another version.
- Put classifiers, artifact types, excludes, and capabilities at the dependency declaration, variant, or metadata-rule owner; catalog TOML cannot encode them. Use `variantOf()` when a catalog alias needs a classifier, and a dependency `artifact {}` block when the use site needs a specific artifact type.
- In project `plugins {}` blocks, catalog access is limited to `alias(libs.plugins...)`; share plugin versions by using `version.ref` inside `[plugins]` entries, not by reading catalog libraries, bundles, or versions from the block. Settings files/settings plugins still cannot use catalog plugin aliases.
- `buildSrc` and included build logic do not inherit the main catalog automatically. Import catalogs explicitly in their settings, use `VersionCatalogsExtension` inside precompiled script plugin code when needed, and remember precompiled script plugin `plugins {}` blocks cannot read catalog aliases.
- Prefer one `libs.versions.toml` with naming conventions. Split catalogs only for real boundaries such as shipped artifacts, independent build-logic dependencies, organization-wide published catalogs, or unavoidable JVM accessor-size limits.
- Keep aliases descriptive and stable: prefer dash-separated segments, derive the first segment from group/artifact identity without the top-level domain, omit generic or repeated words, convert artifact-internal dashes to camel case for accessors, and suffix plugin libraries with `-plugin` when the plugin is used as a library dependency.
- Catalog TOML files are self-contained; there is no cross-file `include` or `version.ref`, and `from(...)` may be called once per catalog. Layer programmatic `version(...)`, `library(...)`, `bundle(...)`, or `plugin(...)` calls after `from(...)` when intentionally injecting shared versions or overriding imported catalogs; this changes requested notation, not conflict resolution results.
- Treat published base catalogs as versioned artifacts with their own release lifecycle. They centralize requested coordinates but still do not enforce selected versions like platforms or locks.
- Catalog library accessors return providers. When a Gradle API accepts dependency notation, prefer passing the provider instead of unwrapping with `.get()`, especially in substitution, constraints, or selector APIs that may require a different selector type.
- Catalog aliases generate accessors after normalization; avoid aliases that collide after dash/underscore/dot/camel-case normalization, create unwanted subgroup accessors, or use reserved names such as `versions`, `bundles`, `plugins`, `extensions`, or `class`. If a consumed catalog already has parent/subgroup collisions such as version aliases `jackson` and `jackson-databind`, use `asProvider()` to read the parent alias.

## Platforms And BOMs

- Use a platform when a family of modules must align across projects, transitive dependencies, or consumers.
- Create Java ecosystem platforms with `java-platform` plus dependency constraints; the platform project has no binaries and cannot also be a `java` or `java-library` project.
- In Java platforms, `api` and `runtime` scope constraints or explicit platform dependencies to compile/runtime consumers; prefer constraints, and enable `allowDependencies()` only when the platform intentionally contributes dependency edges.
- Import Maven BOMs with `platform(...)`; Gradle maps BOM dependency management entries to platform constraints.
- `platform(...)` selects platform variants and endorses strict versions by default, so strict platform opinions can control versions in the consumer's subgraph. Use `doNotEndorseStrictVersions` only when that enforcement is not policy.
- Use `enforcedPlatform(...)` cautiously for reusable components because forced versions are transitive to consumers. If consumers should be allowed to disagree, prefer normal platforms plus strict/rich versions where appropriate.
- Prefer a published BOM or platform when a module family already publishes alignment metadata. Use a virtual platform through component metadata rules only when the upstream family lacks usable alignment metadata.
- For modules you publish and version together, model alignment with a `java-platform` project and make each module depend on that platform.
- If a library is published for other Gradle builds, route platform, constraint, and rich-version semantics through Gradle Module Metadata review in [publications-and-signing.md](publications-and-signing.md).

## Constraints And Rich Versions

- Constraints are scoped to dependency buckets such as `implementation`, `api`, `runtimeOnly`, and test buckets.
- Constraints are not strict by default; they usually act like version requirements that can still be upgraded by conflict resolution.
- A constraint is a no-op until a hard dependency path brings the constrained module into the graph; it is a version opinion, not a dependency edge.
- Constraints are transitive and are preserved for Gradle consumers through Gradle Module Metadata; Maven or Ivy consumers may lose them.
- `require` is the normal floor and may be upgraded; shorthand dependency versions are required versions.
- `strictly` is the strongest opinion, can downgrade, and can fail resolution when no acceptable version satisfies all requirements; for published libraries, prefer a strict compatible range plus `prefer` over a single strict version when consumers may safely choose another version in the range.
- Strict version control depends on graph coverage. If another path reaches the module without inheriting the strict opinion, inspect dependency paths before assuming `strictly` was ignored.
- `prefer` is soft, applies only when no stronger non-dynamic opinion exists, and does not support dynamic versions.
- `reject` blocks candidates and can fail resolution if Gradle would otherwise select a rejected version.
- When a range, dynamic selector, or reject behaves surprisingly, inspect Gradle version ordering before adding policy; separators normalize, numeric parts outrank non-numeric parts, extra numeric parts raise a version, extra non-numeric parts lower it, and special qualifiers such as `dev`, `rc`, `snapshot`, `final`, `ga`, `release`, and `sp` have Gradle-defined order.
- Gradle Module Metadata preserves rich versions. Maven/Ivy metadata conversion keeps only the strongest `strictly`/`require`/`prefer` opinion and ignores `reject`; publish resolved versions or document degraded semantics when Maven/Ivy consumers matter.
- Treat dynamic versions and changing modules as freshness policy, not reproducibility policy; pair them with dependency locking and repository cache rules when selected versions must be repeatable.
- Use `resolutionStrategy.failOnVersionConflict()` as a detection tripwire for accidental upgrades, not as lasting version policy. Once the conflict is understood, encode intent with constraints, platforms, rich versions, metadata repair, or locks.
- Use constraints to upgrade or downgrade a transitive module without adding a direct dependency just to control its version.
- Before downgrading a transitive module, first decide whether the source should instead adapt to the newer selected version; if a downgrade is still required, inspect existing platforms, catalogs, constraints, and locks that may already own the selected version.
- Use dependency locking when the requirement is reproducible selected versions across builds; use constraints or platforms when the requirement is compatibility policy.

## Consistency Decisions

- Use dependency resolution consistency for real compile/runtime or test/runtime drift across related configurations, not as a global replacement for platforms, constraints, or locks.
- `shouldResolveConsistentlyWith(...)` makes one resolvable configuration align shared dependency versions with another chosen source configuration.
- In Java projects, prefer the Java ecosystem consistency convention when all source-set runtime classpaths should align with their compile classpaths.
- `java { consistentResolution { useCompileClasspathVersions() } }` applies the Java convention; avoid it when a source set intentionally tests or runs against a different runtime graph.
- Treat consistent resolution as an incubating feature; keep the scope narrow and document which configuration is the version source of truth.
- In `dependencyInsight`, consistent resolution appears as a selection reason such as `By constraint: version resolved in configuration ':compileClasspath' by consistent resolution`; use that reason to identify the source configuration before changing constraints or rules.

## Diagnostics

```bash
./gradlew dependencies --configuration <configuration>
./gradlew dependencyInsight --dependency <module> --configuration <configuration>
./gradlew resolvableConfigurations [--configuration <configuration>]
```

## Symptom Map

- Catalog version changed but selected version did not: inspect conflict resolution, platform/BOM constraints, dependency constraints, substitutions, and locks.
- Catalog accessor or parse failure: inspect alias/accessor collisions, subgroup accessors, catalog size/accessor class limits, reserved names, undefined `version.ref` or bundle members, unfinished programmatic aliases, invalid module/plugin/version notation, unsupported or missing imported catalog files, cross-file TOML references, and repeated `from(...)` imports before changing dependency policy.
- Catalog plugin alias or accessor unavailable: check whether the use site is `settings.gradle(.kts)`, a settings plugin, a precompiled script plugin `plugins {}` block, or a project `plugins {}` block trying to read `libraries`, `bundles`, or `versions` instead of applying a `[plugins]` alias.
- Constraint appears in `dependencies` output with `(c)`: it is a version opinion, not a dependency edge; find the dependency path that actually brings in the module.
- `enforcedPlatform` leaks to consumers: replace with a normal platform or strict/rich versions unless consumer override must be blocked.
- Strict version does not control the selected module: inspect all dependency paths, platform endorsement, and competing strict versions before adding `force`.
- Newer transitive version wins over a declared version: use `failOnVersionConflict()` to expose the conflict, then choose constraint/platform/rich-version/lock ownership instead of forcing globally.
- Compile/runtime classpaths disagree: inspect selected versions first, then consider targeted consistent resolution.
