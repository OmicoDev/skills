# Gradle Dependency Metadata Rules

Read this when: component metadata rules, Maven/Ivy metadata repair, classifier or version-encoded external variants, missing capabilities, virtual platform alignment, or module status schemes own dependency resolution.

## Scope Boundary

- This file owns metadata rules that run after module metadata is downloaded and before Gradle uses it for dependency resolution.
- Use [dependency-variants-and-metadata.md](dependency-variants-and-metadata.md) first when the task is comparing requested and candidate attributes, capabilities, or `No matching variant` diagnostics.
- Use [dependency-version-governance.md](dependency-version-governance.md) when the selected version should be governed by catalogs, constraints, platforms, BOMs, rich versions, or consistent resolution.
- Use [dependency-artifact-selection.md](dependency-artifact-selection.md) when the graph is correct and only artifact selection needs to change; use [dependency-artifact-transforms.md](dependency-artifact-transforms.md) when reusable conversion owns the change.

## Use Metadata Rules For

- Published external metadata that is wrong or incomplete: dependencies, constraints, artifacts, capabilities, attributes, variants, Ivy configurations, Maven packaging, status, or virtual-platform membership.
- Legacy Maven/Ivy modules where classifiers, version suffixes, optional features, or configurations encode a real variant contract that Gradle cannot infer.
- Missing capabilities when two modules are mutually exclusive providers and the metadata does not declare the conflict.
- Cross-module alignment without a published platform only when the modules genuinely share a version family.
- Status or status-scheme changes only when `latest.<status>` version selection semantics are the real owner.

## Prefer Another Owner When

- You publish the producer: publish correct Gradle Module Metadata instead of patching your own consumer build.
- The desired version policy is yours, not a metadata defect: use constraints, platforms, BOMs, rich versions, or locks.
- A capability conflict is already visible: use capability conflict resolution before adding metadata.
- The dependency is a one-off local replacement: use substitution, composite builds, or direct declarations.
- The issue is only a task needing a different file from an already-correct graph: use [dependency-artifact-selection.md](dependency-artifact-selection.md) for artifact views or artifact selection; use [dependency-artifact-transforms.md](dependency-artifact-transforms.md) only when reusable conversion owns the change.
- Repository metadata requests or dynamic-version listing are the bottleneck: use repository `ComponentMetadataSupplier` or component version lister only when supplying initial remote metadata is the owner; metadata rules enrich metadata after Gradle has module metadata to work with.

## Rule Shape

- Declare rules in `dependencies { components { ... } }` or centrally in settings when the rule should govern the whole build.
- Prefer `withModule(group:name, Rule::class)` over broad `all(...)` rules unless the rule is correct for every affected module.
- Prefer isolated `ComponentMetadataRule` classes over inline actions; make reusable rules deterministic and `@CacheableRule` so dependency resolution does not rerun them unnecessarily.
- Treat a class rule as isolated metadata code: use `ComponentMetadataContext.details`, optional Maven/Ivy descriptors, serializable or Gradle-recognized parameters, and supported injected services such as `ObjectFactory`; do not make rule behavior depend on ambient project state.
- Put reusable rules in settings or convention build logic instead of scattering them across project build scripts.
- Settings-level rules are incubating and use `RulesMode`: `PREFER_PROJECT` is the default and ignores settings rules when a project declares rules, `PREFER_SETTINGS` ignores project rules, and `FAIL_ON_PROJECT_RULES` turns project rules into a build error.

## Metadata Surface

- Use `allVariants` for every variant, `withVariant(name)` for a named variant or Ivy configuration, and `addVariant(name)` or `addVariant(name, base)` to introduce a new variant.
- A rule may change variant attributes, capabilities, dependencies, dependency constraints, and files.
- Use `maybeAddVariant(name, base)` instead of `addVariant(name, base)` in broad `all(...)` rules when the base may not exist; use strict `addVariant` for targeted modules where a missing base should expose a bad metadata assumption.
- Treat `addVariant` file state as part of the rule contract: empty variants need files added directly, while variants derived from a base may expose inherited artifacts, so enter `withFiles` and either remove/replace copied files for classifier replacements or keep and supplement them for additive runtime artifacts.
- Maven POM metadata is derived into library variants, sources/javadoc variants, and platform/enforced-platform variants from dependency management.
- Ordinary Maven dependencies request library variants. `platform(...)` and `enforcedPlatform(...)` request the platform-derived variants and import constraints instead of ordinary dependencies.
- POM dependency management is not converted into constraints for ordinary library variants.
- Ivy has no single built-in variant derivation strategy. Use metadata rules to create compile/runtime variants from Ivy configurations when that mapping is correct for the module family.
- Component-level `belongsTo` creates virtual-platform alignment; component-level status/status scheme affects `latest.<status>` version selection before variant selection. POM metadata defaults to `integration` for snapshots and `release` otherwise, so status rules are version-policy repairs, not variant fixes.
- Maven- or Ivy-specific descriptors are available to metadata rules when the repair depends on packaging, Ivy configurations, or traditional metadata details; guard those assumptions before applying a broad rule to modules that may publish Gradle Module Metadata.

## Repair Choices

- Wrong transitive dependency: remove or add it on the affected variant rather than excluding broadly.
- Optional feature hidden in POM metadata: model it as a feature variant and capability.
- Classifier jar represents a real variant: add a variant with attributes and files instead of resolving classifier paths manually.
- When a classifier replaces the main artifact, copy the base variant and remove copied files before adding the classifier file. When a classifier supplements runtime, such as a native jar, keep the base files and add the classifier file.
- When a classifier variant has different dependencies or provides a different feature flavor, adjust the new variant dependencies or capabilities as part of the metadata rule; classifier notation can choose a file but cannot express semantic dependency differences.
- Version suffixes encode variants only awkwardly because Gradle selects a module version before variant selection; model them only when every semantic alternative is published in lockstep and the alternate files can be addressed from the selected metadata.
- Mutually exclusive modules: add missing capabilities, then let capability conflict resolution choose among present candidates.
- Cross-module alignment without published platform metadata: use `belongsTo` only when the modules really share a version family.
- Ivy compile/runtime separation: create variants from the relevant Ivy configurations; modifying attributes or capabilities on raw Ivy configurations does not make them variant-aware.

## Diagnostics And Validation

```bash
./gradlew dependencyInsight --dependency <module> --configuration <configuration>
./gradlew dependencies --configuration <configuration>
./gradlew resolvableConfigurations [--configuration <configuration>]
```

- Before writing a rule, identify whether Gradle consumed Gradle Module Metadata, a Maven POM, or Ivy metadata. Traditional metadata is more likely to need enrichment.
- Validate that the rule remains correct outside the current build. If it only hides a local conflict, choose a local dependency policy instead.
- Re-run the original dependency report after adding the rule and confirm the selected component, variant, dependencies, capabilities, or status changed for the intended reason only.
- Treat uncached or broad metadata rules as dependency-resolution performance risks; inspect slow resolution with repository order, dynamic/changing modules, and metadata-rule scope together.

## Source Calibration

Primary upstream pages: Modifying Dependency Metadata, Variant Attributes, Capabilities, Resolving Specific Artifacts, ComponentMetadataRule API, ComponentMetadataDetails API, RulesMode API, ComponentMetadataSupplier API.
