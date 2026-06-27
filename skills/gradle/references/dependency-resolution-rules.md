# Gradle Dependency Resolution Rules

Read this when: `resolutionStrategy`, dependency substitution, local forks, module replacement, `force`, component selection, default dependencies, exclusions, or disabled transitivity owns dependency resolution.

## Scope Boundary

- This file owns direct interventions in Gradle's dependency resolution engine.
- Read [dependency-version-governance.md](dependency-version-governance.md) first when platforms, BOMs, constraints, rich versions, catalogs, locks, or consistent resolution can express the policy as graph inputs.
- Read [dependency-metadata-rules.md](dependency-metadata-rules.md) when external metadata is wrong and should be repaired before resolution.
- Read [dependency-variants-and-metadata.md](dependency-variants-and-metadata.md) when capabilities, feature variants, or attribute matching express the domain better than substitution or excludes.
- Read [project-topology-and-build-logic.md](project-topology-and-build-logic.md) when an included build or composite-build boundary is the real owner.

## Escalation Model

- Treat resolution rules as last-mile controls. They can hide newly introduced dependencies or metadata defects because they mutate or filter resolution directly.
- Scope rules to the narrowest resolvable configuration that owns the classpath; avoid broad `configurations.all` policy unless a convention plugin deliberately owns it.
- For libraries you publish, prefer constraints, capabilities, or corrected Gradle Module Metadata over consumer-local resolution rules because consumers do not inherit most local resolution strategy behavior.
- Add `because(...)` or equivalent rationale for substitutions, replacements, forced versions, and rejects so future dependency reports explain the intent.

## Force And Failure Gates

- Use `force` only as a temporary or emergency override with a removal path. Prefer constraints, platforms, rich versions, metadata repair, or locks for durable version policy.
- `failOnVersionConflict()`, `failOnDynamicVersions()`, `failOnChangingVersions()`, and `failOnNonReproducibleResolution()` are detection or policy gates; they do not choose the correct version.
- Use `preferProjectModules()` only when a resolved conflict should prefer a project component over a binary component; it does not include missing projects, rewrite coordinates, or replace an external module by itself.
- Use component selection rules when a configuration must reject candidate versions during selection, especially dynamic selectors or metadata-based rejects.
- Component selection starts from the highest matching candidate; a candidate is accepted unless a rule rejects it. Target rules to `group:module` when possible and handle optional metadata defensively.
- Use rich-version `reject` when the build should express unacceptable versions as version intent; use dependency resolve rules only when a rejected request should be rewritten to a known replacement.

## Substitution And Local Forks

- Prefer a composite build with `includeBuild` for a Gradle-built local fork that should replace an external module during development.
- Keep the consuming dependency declaration on the external coordinates when using a local fork; default composite substitution matches the included project's `group` and `name`, while version alignment is still useful evidence that the fork represents the requested release.
- Use explicit dependency substitution for module-to-project, project-to-module, module-to-module, variant, capability, classifier, or version-divergent fork substitution when the replacement is a local resolution policy.
- For variant or capability substitution, match the requested attributes or required capability deliberately; composite-build substitution is broader and implicitly replaces all variants of the external module with equivalent variants from the included build.
- Use classifier substitution as a local repair when conflict resolution selects a version whose classified artifact does not exist. If the classifier encodes a reusable platform, JVM, native, or feature variant, prefer [dependency-metadata-rules.md](dependency-metadata-rules.md) so attributes, files, capabilities, and dependencies stay together.
- Substituted projects must already be included in the build; substituting a project with a module still leaves the project in the build but avoids building it for that resolved classpath.
- A dependency substitution rule can force configuration resolution during task graph construction so Gradle can discover substituted project dependencies. Do not add it casually to configurations that are mutated late or depend on artifacts produced during task execution.
- Module replacement declares that one module supersedes another, but it only resolves a conflict when both old and new modules appear. It does not proactively add the replacement if only the old module is present.
- Prefer capabilities over module replacement when modules are mutually exclusive providers of the same feature and Gradle can model the conflict explicitly.

## Exclusions And Transitivity

- Before excluding, use `dependencies` or `dependencyInsight` to identify the exact path that brings the unwanted module.
- Prefer dependency-level excludes over configuration-level excludes; configuration excludes apply to every declaration in that configuration.
- Gradle applies an exclusion only when all paths to the module agree. If another dependency still brings the module without the exclusion, the module remains in the graph.
- Exclude only when the application or library is proven not to need the removed dependency on relevant runtime paths.
- If the metadata declares an unnecessary dependency, repair it with a component metadata rule instead of hiding it with broad excludes.
- If the problem is version choice, use constraints or rich versions. If the problem is mutually exclusive implementations, use capabilities.
- Disabling transitivity shifts responsibility to the build author to declare every needed runtime dependency manually; use it only for intentionally curated classpaths.

## Plugin-Owned Defaults

- Use default dependencies for plugin-owned configurations when the plugin needs a tool or library only if the user has not declared one.
- Expose an override path for every default dependency, normally through the configuration itself or a typed version property.
- Use lazy dependency additions such as provider-backed additions when the decision depends on values that should not be read during configuration.
- Prefer a constraint with `prefer(...)` when plugin build logic wants to supply a default version for a user-declared dependency without adding a dependency itself; use `dependencies.addLater(...)` when the plugin may conditionally add the dependency.

## Diagnostics

```bash
./gradlew dependencies --configuration <configuration>
./gradlew dependencyInsight --dependency <module> --configuration <configuration>
./gradlew resolvableConfigurations [--configuration <configuration>]
```

## Symptom Map

- `force` fixes one build but consumers still see another version: move durable policy to constraints, platforms, or published metadata.
- Local fork ignored: check `includeBuild`, included project `group` and `name`, root/project naming, and whether explicit substitutions are needed because publication coordinates or artifacts differ.
- Configuration resolves earlier than expected: inspect dependency substitution rules that may require task-graph-time resolution.
- Excluded module still appears: find every path to the module and confirm all paths agree on the exclusion.
- Old and replacement modules coexist: add capabilities or module replacement metadata, then choose a provider or replacement policy.
- Runtime `ClassNotFoundException` after excluding or disabling transitivity: restore the dependency or add the missing runtime dependency explicitly.

## Source Calibration

Primary upstream pages: Using Resolution Rules, Composite Builds, How to Use a Local Fork of a Module Dependency with Gradle, How to Exclude Transitive Dependencies in Gradle, ResolutionStrategy API.
