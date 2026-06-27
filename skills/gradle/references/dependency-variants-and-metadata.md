# Gradle Dependency Variants And Metadata

Read this when: variant-aware resolution, attributes, capabilities, or published variant metadata owns the issue.

## Scope Boundary

- This file owns component variants, attributes, capabilities, and matching diagnostics before artifact selection.
- Read [dependency-metadata-rules.md](dependency-metadata-rules.md) when the fix is a component metadata rule, Maven/Ivy metadata repair, virtual platform alignment, or status scheme change.
- Read [dependency-artifacts-and-transforms.md](dependency-artifacts-and-transforms.md) for artifact views, artifact-only notation, classifier artifact selection, and variant-aware project artifact sharing.
- Read [dependency-artifact-transforms.md](dependency-artifact-transforms.md) when a transform should derive requested artifact attributes from an existing variant.

## Variant Model

- A component exposes variants. A variant has attributes, capabilities, artifacts, dependencies, and metadata.
- Consumers request attributes; Gradle filters compatible candidates, then disambiguates when more than one compatible candidate remains.
- Matching is not strict equality: compatibility rules can keep non-equal candidates, disambiguation rules choose among compatible candidates, and candidates with unnecessary extra attributes may lose.
- A candidate missing a requested attribute can remain in the compatible set and lose later during disambiguation; do not treat every missing-attribute diagnostic as proof that the producer has no usable variant.
- Variant names are mainly diagnostics surface; ordinary variant matching uses attributes, not names.
- `No matching variant` means the consumer and producer attributes/capabilities do not describe a compatible variant.
- Variants/configurations without attributes cannot participate in variant-aware resolution; reports may hide them unless `--all` is used.
- A producer with no variants falls back to a default artifact, and explicitly selecting a configuration by name bypasses normal variant matching; treat both as interop or migration paths, not the preferred model.
- Secondary variants are artifact sets on an existing variant, not separate components; verification-only variants carry test or coverage results and should not be added to publishable components.
- Component-level metadata can influence version selection before Gradle selects variants. Variant-level metadata influences artifact and dependency selection after a component version is chosen; repair external metadata through [dependency-metadata-rules.md](dependency-metadata-rules.md).
- Maven POM and Ivy metadata are mapped into Gradle's variant model; Gradle Module Metadata already carries explicit variants, attributes, and capabilities.

## Attribute Rules

- Standard attributes usually explain most mismatches: usage, category, library elements, bundling, documentation type, verification type, target JVM version/environment, test suite name, native OS/architecture, and Gradle plugin API version.
- Custom attributes are a compatibility contract; published consumers need the plugin or schema that registers compatible and preferred values.
- Attribute precedence and disambiguation belong to the ecosystem/schema owner; local one-off rules can make published variants hard for consumers to interpret.
- Add compatibility rules when a producer value can satisfy a requested value. Add disambiguation rules when several compatible candidates remain.
- Register custom attributes and their compatibility/disambiguation rules in `dependencies.attributesSchema`; rules do not help consumers that never load the schema.
- For custom attributes typed as `Named`, create values through `ObjectFactory.named(...)` so producer and consumer values have the same typed identity.
- For JVM variants, `org.gradle.jvm.version` prefers the highest compatible target; do not patch this like an arbitrary string attribute.

## Matching Repair Order

1. Inspect requested attributes and candidate variants.
2. Check whether the producer exposes the right attributed variant and whether the consumer asks for the right usage, category, JVM version, platform, or custom attribute.
3. If Gradle lists compatible candidates, debug ambiguity or disambiguation before assuming no producer variant exists.
4. Prefer fixing producer metadata over weakening consumer attributes.
5. Add compatibility or disambiguation rules only when the attribute model is custom and reusable.
6. When external Maven/Ivy or incomplete metadata is the defect, switch to [dependency-metadata-rules.md](dependency-metadata-rules.md) instead of selecting variants by configuration name or resolving classifier paths manually.

## Diagnostics

```bash
./gradlew outgoingVariants [--variant <variantName>|--all]
./gradlew resolvableConfigurations [--configuration <configuration>|--all]
./gradlew dependencyInsight --dependency <module> --configuration <configuration>
```

Use reports to compare requested attributes with producer attributes before editing rules. `outgoingVariants` can show invalid duplicate attributes/capabilities leniently; `resolvableConfigurations` shows extended configurations and rule-affected attributes. Add `--all` when legacy or attributeless entries may be hidden or marked non-selectable.

## Capabilities

- Capabilities model mutually exclusive providers of the same feature.
- Every component has an implicit capability from its coordinates. If a producer declares any explicit capability, declare the implicit one too when it should remain available.
- Declare local producer capabilities on consumable outgoing configurations; resolvable and dependency-scope configurations do not publish a selectable capability contract.
- Published capabilities require Gradle Module Metadata. Maven POM and Ivy consumers cannot see the full capability contract.
- Capabilities are versioned, but "highest capability version" is not always the correct conflict policy.
- Adding a missing capability exposes a conflict; it does not choose a provider automatically.
- Use capability conflict resolution when Gradle sees competing providers and the build needs to choose.
- Capability conflict resolution is configuration-scoped; test, runtime, and production classpaths may intentionally select different providers.
- Use `requireCapability` when a dependency or substitution intentionally requests a capability-bearing feature variant, such as test fixtures; do not confuse it with choosing among already-conflicting providers.
- Add missing capabilities with [dependency-metadata-rules.md](dependency-metadata-rules.md) when external metadata fails to declare a real conflict.
- Do not use excludes for replacement when capabilities or module replacement express the domain better.
- Capability conflict resolution can only select a provider that is present among the current conflict candidates; it cannot add a desired module to the graph.
- If a capability has multiple unresolved conflict sets, every set needs a valid selection policy or the build still fails.

## Feature Variants

- Feature variants are Java-library variant contracts for optional or mutually exclusive library features; use them instead of Maven optional dependencies when Gradle consumers need precise dependency and capability metadata.
- The feature-variant DSL is Java plugin support on top of the general variant/capability model; other ecosystems need their own variant-producing plugin conventions.
- Give each feature its own source set and feature-specific dependency buckets. Do not register a feature on the `main` source set.
- Consumers request a feature by declaring the dependency and requiring the feature capability; multiple distinct capabilities from one component can coexist, but variants that share a capability are mutually exclusive.
- Follow the default capability naming convention of main artifact name plus the kebab-case feature name unless the domain needs a custom capability.
- Publishing feature variants requires `maven-publish` or `ivy-publish`; Gradle Module Metadata preserves the feature contract, while Maven represents it through optional dependencies and classifiers.
- Consumers can require published feature capabilities reliably only from project dependencies, Gradle Module Metadata, or explicit Ivy configurations; Maven POM metadata is lossy and should not be treated as preserving feature selection semantics.
- Use shared capabilities to model mutually exclusive implementations so resolution fails with an explicit choice instead of silently combining incompatible runtime features.

## Source Calibration

Primary upstream pages: Variant Selection and Attribute Matching, Variant Attributes, Capabilities, Feature Variants, Create Feature Variants for a Library.
