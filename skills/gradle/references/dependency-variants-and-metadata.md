# Gradle Dependency Variants And Metadata

Read this when: variant-aware resolution, attributes, capabilities, artifact transforms, component metadata rules, or custom outgoing artifacts owns the issue.

## Variant Model

- A component exposes variants. A variant has attributes, capabilities, artifacts, dependencies, and metadata.
- Consumers request attributes; Gradle filters compatible candidates, then disambiguates when more than one compatible candidate remains.
- Variant names are mainly diagnostics surface; ordinary variant matching uses attributes, not names.
- `No matching variant` means the consumer and producer attributes/capabilities do not describe a compatible variant.
- Variants/configurations without attributes cannot participate in variant-aware resolution; reports may hide them unless `--all` is used.
- Secondary variants are artifact sets on an existing variant, not separate components; verification-only variants carry test or coverage results and should not be added to publishable components.
- Component-level metadata can influence version selection before Gradle selects variants. Variant-level metadata influences artifact and dependency selection after a component version is chosen.
- Maven POM and Ivy metadata are mapped into Gradle's variant model; Gradle Module Metadata already carries explicit variants.

## Attribute Rules

- Standard attributes usually explain most mismatches: usage, category, library elements, bundling, documentation type, verification type, target JVM version/environment, test suite name, native OS/architecture, and Gradle plugin API version.
- Custom attributes are a compatibility contract. Published consumers need the plugin or schema that defines compatible and preferred values.
- Register custom attributes in the dependency attributes schema before relying on compatibility or disambiguation rules.
- Add compatibility rules when a producer value can satisfy a requested value. Add disambiguation rules when several compatible candidates remain.
- For JVM variants, `org.gradle.jvm.version` prefers the highest compatible target; do not patch this like an arbitrary string attribute.

## Matching Repair Order

1. Inspect requested attributes and candidate variants.
2. Check whether the producer exposes the right attributed variant and whether the consumer asks for the right usage, category, JVM version, platform, or custom attribute.
3. Prefer fixing producer metadata over weakening consumer attributes.
4. Add compatibility or disambiguation rules only when the attribute model is custom and reusable.
5. Repair external Maven/Ivy or incomplete metadata with component metadata rules instead of selecting variants by configuration name or resolving classifier paths manually.

## Diagnostics

```bash
./gradlew outgoingVariants
./gradlew resolvableConfigurations
./gradlew dependencyInsight --dependency <module> --configuration <configuration>
```

Use reports to compare requested attributes with producer attributes before editing rules.

## Capabilities

- Capabilities model mutually exclusive providers of the same feature.
- Every component has an implicit capability from its coordinates. If a producer declares any explicit capability, declare the implicit one too when it should remain available.
- Capabilities are versioned, but "highest capability version" is not always the correct conflict policy.
- Use capability conflict resolution when Gradle sees competing providers and the build needs to choose.
- Add missing capabilities with component metadata rules when external metadata fails to declare a real conflict.
- Do not use excludes for replacement when capabilities or module replacement express the domain better.
- Capability conflict resolution can only select a provider that is present among the conflict candidates.

## Project Output Sharing

- Expose generated outputs with consumable configurations and attributes.
- Consume custom outputs with resolvable configurations, not task paths.
- Use `outgoingVariants` and `resolvableConfigurations` to inspect both sides; keep producer artifacts under `build/` and backed by task providers.
- Do not create a project dependency only to reach into another project's files.

## Component Metadata Rules

- Use component metadata rules to repair external dependencies, classifier/version-encoded variants, capabilities, status schemes, or Ivy/Maven mappings.
- Component metadata rules run after metadata is downloaded and before Gradle uses it for resolution.
- Prefer `withModule` over broad `all` rules unless the rule is truly generic and correct for every affected module.
- Prefer isolated rule classes over inline actions. Mark rules cacheable because uncached rules can affect every resolution.
- Keep rule parameters serializable or Gradle-managed. Inject only supported services such as `ObjectFactory`.
- Rules declared in settings can govern the whole build; use settings-level rule mode to prefer, warn on, or fail project-specific overrides.
- Keep rules scoped and cacheable. Prefer settings or convention build logic over scattered project scripts.
- Use metadata rules for external metadata defects; publish proper Gradle Module Metadata when the producer is your build.
- Before writing a rule, identify whether the module was published with Gradle Module Metadata, Maven POM, or Ivy metadata. Traditional metadata is more likely to need variant enrichment.
- A good metadata rule should still be correct outside the current build. If the rule only hides a local conflict, prefer constraints, platforms, capabilities conflict selection, or a direct declaration.
- Use `allVariants`, `withVariant(name)`, and `addVariant(name, base)` deliberately. Copying a base variant also copies files and dependencies, so remove or replace copied files when modeling classifier jars.
- Use component-level `belongsTo` for real virtual-platform alignment and component-level status/status scheme only for version selection semantics.

## Maven And Ivy Mapping

- Maven modules are derived into library variants, sources/javadoc variants, and platform/enforced-platform variants from dependency management.
- Normal dependencies request library variants. `platform(...)` and `enforcedPlatform(...)` request the platform-derived variants and import constraints instead of ordinary dependencies.
- POM dependency management is not converted into constraints for ordinary library variants.
- Ivy has no single built-in variant mapping. Use component metadata rules when Ivy configurations need to become compile/runtime variants.

## Metadata Repair Choices

- Wrong transitive dependency: remove or add it on the affected variant.
- Optional feature hidden in POM metadata: model it as a feature variant and capability.
- Classifier jar represents a real variant: add variants with attributes and files instead of resolving classifier paths manually.
- Version suffixes or classifiers that encode JVM/native/platform differences often need metadata rules so Gradle can select by attributes instead of string ordering.
- Mutually exclusive modules: add missing capabilities and let capability conflict resolution choose.
- Cross-module alignment without published platform metadata: use `belongsTo` only when the modules really share a version family.

## Custom Artifacts And Transforms

- For project output sharing, publish an outgoing variant with attributes and artifacts instead of depending on another task's file path.
- Use artifact views for selecting artifacts from an existing resolved graph, and `withVariantReselection` only when a different component variant should be selected by attributes. In reselection, the artifact view's attributes drive matching.
- Use artifact transforms when a reusable, cacheable conversion is needed between artifact types.
- Artifact transforms run only when no existing variant satisfies the requested artifact attributes. They transform artifacts, not dependency metadata or transitive dependencies; model parameters as inputs and keep transforms deterministic.

## Source Calibration

Primary upstream pages: Variant Selection and Attribute Matching, Capabilities, Modifying Dependency Metadata, Artifact Views, Artifact Transforms, Multi-Project Builds.
