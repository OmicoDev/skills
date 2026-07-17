# Gradle Dependency Policy

Read this when: dependency declarations, configuration roles, version ownership, platforms, catalogs, resolution escalation, or selected versions are the main surface.

## First Choice

- Read [dependency-repositories.md](dependency-repositories.md) for repositories, metadata sources, content filters, dynamic/changing modules, and cache behavior.
- Read [dependency-version-governance.md](dependency-version-governance.md) for catalogs, platforms/BOMs, constraints, rich versions, and consistent resolution.
- Read [dependency-locking.md](dependency-locking.md) for dependency lockfiles, `--write-locks`, `--update-locks`, lock modes, and reproducible selected versions.
- Read [dependency-variants-and-metadata.md](dependency-variants-and-metadata.md) for variants, capabilities, attributes, and matching diagnostics.
- Read [dependency-metadata-rules.md](dependency-metadata-rules.md) for component metadata rules, Maven/Ivy metadata repair, missing capabilities, virtual-platform alignment, and status schemes.
- Read [dependency-resolution-rules.md](dependency-resolution-rules.md) for `resolutionStrategy`, substitution, local forks, module replacement, `force`, component selection, excludes, and disabled transitivity.
- Read [dependency-artifact-selection.md](dependency-artifact-selection.md) for artifact views, artifact-only notation, classifier artifacts, and project artifact sharing.
- Read [dependency-artifact-transforms.md](dependency-artifact-transforms.md) for reusable artifact transform implementation, registration, caching, and diagnostics.
- Read [dependency-verification.md](dependency-verification.md) for `verification-metadata.xml`, checksums, signatures, bootstrapping, and verification failures.
- Read [publications-and-signing.md](publications-and-signing.md) when dependency metadata is produced by Maven/Ivy publishing or plugin publication.
- Read [source-control-dependencies.md](source-control-dependencies.md) when `sourceControl` or `vcsMappings` replaces a module with a Git-backed source dependency.

## Scope Boundary

- This file owns what the build asks for and why a selected version is acceptable.
- Repositories own where Gradle may search and how cached metadata behaves.
- Version governance owns catalogs, platforms, constraints, rich versions, and consistent resolution.
- Locking owns freezing selected versions after resolution.
- Variants own which component metadata matches a consumer; metadata rules own external metadata repair; artifact selection owns the concrete files produced from that match.
- Resolution rules own last-mile engine interventions such as substitution, force, component selection, module replacement, excludes, and disabled transitivity.
- Verification owns whether downloaded bytes and signatures are accepted.

## Configuration Roles

- Declarable configurations receive dependencies, such as `implementation`, `api`, `compileOnly`, `runtimeOnly`, and test buckets.
- Resolvable configurations produce files or metadata, such as compile/runtime classpaths.
- Consumable configurations expose outgoing variants and artifacts to other projects or external consumers.
- Do not declare dependencies on resolvable/consumable-only configurations. Do not resolve declaration buckets directly.
- For custom configurations, use one intended role only: dependency scope, resolvable classpath/data, or consumable outgoing variant. Prefer role-specific factory APIs when available; otherwise set role flags directly.
- Configuration names must not contain `/`, `\`, `:`, `<`, `>`, `"`, `?`, `*`, or `|`; use plain stable names because they become dependency DSL, reports, and diagnostic surface.
- When using legacy configuration creation APIs, set `canBeDeclared`, `canBeResolved`, and `canBeConsumed` intentionally; historical defaults can otherwise create legacy all-role configurations.
- Consumable configurations from bundled plugins may be initialized lazily on Gradle 9.2+; do not put required side effects in `configurations.named("apiElements").configure { ... }` unless realization is guaranteed.
- `extendsFrom` inherits dependencies, constraints, excludes, artifacts, and capabilities, but not attributes or role flags.
- If an old build adds a `Configuration` as a dependency, decide whether the real relationship is inherited declarations (`extendsFrom`), resolved files (`files(configuration)` as a task input), or a proper project/module dependency; do not preserve configuration-as-dependency migration glue.
- Resolving another project's configuration directly from a script, task action, task input, or settings file is unsafe. Use project dependencies, variants, or publications to cross project boundaries.

## Declaration Rules

- Add a dependency to the project that directly uses it.
- If code imports a transitive dependency's type, add a direct dependency in the narrowest configuration; if code no longer uses a declared dependency, remove it instead of preserving historical classpath bulk.
- Use `api` only when dependency types are part of the public ABI; otherwise prefer `implementation`.
- Declare the same external module once in the narrowest correct configuration; duplicate declarations across `compileOnly`, `implementation`, runtime, and test buckets can create confusing classpaths.
- When not using a catalog alias, prefer single-string GAV notation such as `group:name:version`; Gradle 10 removes named/map-style and multi-string notation for normal module dependency declarations, so do not use `group = ..., name = ..., version = ...` as a compatibility form. Named arguments for modifiers such as `exclude` are a separate API.
- Do not pass a `Project` object as dependency or dependency-constraint notation, including wrappers such as `platform(...)` or `testFixtures(...)`; use `project(":path")` in build scripts or `DependencyFactory.createProjectDependency(...)` in plugin code.
- In JVM test-suite `dependencies {}` blocks, use `project()` for the current project and `project(":path")` for another project; avoid `project(project.path)` because `project.path` can resolve against the test-suite `Dependencies` receiver and hit the deprecated `Dependencies.getProject()`.
- Do not depend on the current project through its module coordinates; use a project dependency because Gradle 10 resolves matching GAV coordinates from repositories instead of the current project.
- Do not add a direct dependency only to override a transitive version.
- In Kotlin projects, do not declare `kotlin-stdlib` explicitly unless the Kotlin plugin default is disabled or the build owns a deliberate standard-library version policy.
- Prefer version catalogs for shared coordinates and aliases; catalogs centralize coordinates but do not enforce selected versions.
- Use [dependency-version-governance.md](dependency-version-governance.md) before changing platforms/BOMs, constraints, rich versions, catalog layering, or consistent resolution.
- Use [dependency-resolution-rules.md](dependency-resolution-rules.md) before adding `force`, dependency substitution, component selection rules, broad excludes, or disabled transitivity.
- Prefer constraints, rich versions, platforms, locks, or metadata rules over broad `force`.
- Apply exclusions on the dependency that introduces the unwanted transitive edge; prefer excluding one module over a whole group, and avoid global configuration exclusions.
- Verify that an excluded module is not required by another dependency path before treating the graph as fixed.
- Avoid resolving configurations during configuration; wire files or providers into tasks so resolution happens at the owning consumer.
- Configure configuration containers lazily with `named` and `configureEach`; `getByName` and `all` realize configurations eagerly and can erase lazy-resolution wins.

## Version Owner Selection

- Use a version catalog to name coordinates and share aliases.
- Use a platform or BOM to align families of modules.
- Use constraints to express a version reason for a module already in the graph.
- Use rich versions when the acceptable version range matters, and strict versions only when violating the version is unsafe.
- Use dependency locking to freeze selected versions for reproducibility.
- Use [dependency-metadata-rules.md](dependency-metadata-rules.md) when published metadata is wrong.
- Use [dependency-resolution-rules.md](dependency-resolution-rules.md) for substitution, composite-build local replacement, module replacement, component selection, `force`, and excludes.
- Use `force` only as a last-resort resolution rule with a clear removal path.
- Consistent resolution aligns selected versions across related resolvable configurations; use it for real compile/runtime or test/runtime drift, not as a global replacement for platforms, constraints, or locks.
- For published libraries, prefer ranges plus a preferred version over pinning a single strict version unless consumers must fail on other versions.
- When locks, dynamic versions, or rich versions affect a published library, route publication metadata through [publications-and-signing.md](publications-and-signing.md) so consumers receive the intended resolved or Gradle-specific semantics.

## Diagnostics

```bash
./gradlew dependencies --configuration <configuration>
./gradlew dependencyInsight --dependency <module> --configuration <configuration>
./gradlew outgoingVariants
./gradlew resolvableConfigurations
```

- Use dependency-analysis tooling or focused compile/runtime reports when cleaning dependencies so unused declarations, ABI leaks, and transitive-use gaps are fixed by ownership rather than by copying dependency blocks.

## Symptom Map

- `Could not find`: start with repositories, content filters, coordinates, or plugin repositories.
- `Could not resolve`: preserve the cause chain; it can be repository, metadata, conflict, verification, or variant selection.
- `No matching variant`: compare requested and candidate attributes in [dependency-variants-and-metadata.md](dependency-variants-and-metadata.md).
- Capability conflict: multiple providers claim the same feature; choose a provider or add missing metadata through [dependency-metadata-rules.md](dependency-metadata-rules.md).
- Catalog accessor error: inspect alias naming, reserved words, and plugin-vs-library context.
- Declaration version changed but selected version did not: inspect conflict resolution, platform, constraint, or lock owners.
- Compile/runtime or test/runtime classpaths disagree unexpectedly: inspect consistent resolution before adding broad forces.
