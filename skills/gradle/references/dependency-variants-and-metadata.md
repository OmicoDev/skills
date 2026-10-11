# Gradle Dependency Variants And Metadata

Read this when: variant-aware resolution, attributes, capabilities, or published variant metadata owns the issue.

## Scope Boundary

- This file owns component variants, attributes, capabilities, and matching diagnostics before artifact selection.
- Read [dependency-metadata-rules.md](dependency-metadata-rules.md) when the fix is a component metadata rule, Maven/Ivy metadata repair, virtual platform alignment, or status scheme change.
- Read [dependency-artifact-selection.md](dependency-artifact-selection.md) for artifact views, artifact-only notation, classifier artifact selection, and variant-aware project artifact sharing.
- Read [dependency-artifact-transforms.md](dependency-artifact-transforms.md) when a transform should derive requested artifact attributes from an existing variant.

## Variant Model

- A component exposes variants. A variant has attributes, capabilities, artifacts, dependencies, and metadata.
- Consumers request attributes; Gradle filters compatible candidates, then disambiguates when more than one compatible candidate remains.
- Matching is not strict equality: compatibility rules can keep non-equal candidates, disambiguation rules choose among compatible candidates, and candidates with unnecessary extra attributes may lose.
- A strict superset of matching requested attributes can win before custom disambiguation rules run; unrequested extra attributes can later make a candidate less preferred when competing candidates do not carry them.
- A candidate missing a requested attribute can remain in the compatible set and lose later during disambiguation; do not treat every missing-attribute diagnostic as proof that the producer has no usable variant.
- Variant names are mainly diagnostics surface; ordinary variant matching uses attributes, not names.
- `No matching variant` means the consumer and producer attributes/capabilities do not describe a compatible variant.
- For custom configurations intended for variant-aware matching, give consumable producer configurations meaningful attributes and give resolvable consumer configurations aligned requested attributes; role flags declare configuration roles, not an attribute-matching contract.
- A project consumable configuration without attributes is excluded from attribute matching; attributes are not strictly required on every resolvable configuration, but omitting them leaves no requested variant contract and makes resolution fragile. In Gradle 9.7.1, `outgoingVariants` hides attribute-less configurations by default; `resolvableConfigurations` still shows non-legacy resolvable configurations without attributes.
- In Gradle 9.7.1, attributed consumable configurations that are non-resolvable and not named `default` must have unique attribute sets when their complete capability sets are identical. Fix duplicate identity with a real discriminating attribute/capability or remove the duplicate; merely sharing one capability does not make two capability sets identical.
- In Gradle 9.7.1, absence of attribute-matching variants can trigger legacy `default` configuration selection; it still fails if no consumable default exists. Explicit named configuration selection skips candidate matching but still checks attribute compatibility when both sides have attributes. Neither path repairs an incompatible producer contract.
- Secondary variants are artifact sets on an existing variant, not separate components; verification-only variants carry test or coverage results and should not be added to publishable components.
- Component-level metadata can influence version selection before Gradle selects variants. Variant-level metadata influences artifact and dependency selection after a component version is chosen; repair external metadata through [dependency-metadata-rules.md](dependency-metadata-rules.md).
- Maven POM and Ivy metadata are mapped into Gradle's variant model; Gradle Module Metadata already carries explicit variants, attributes, and capabilities.
- Dependency and constraint declarations can add edge-specific attributes that merge with, and can override, configuration attributes for that module; when diagnostics mention dependency or constraint attributes, fix the edge owner before changing producer variants.

## Attribute Rules

- Standard attributes usually explain most mismatches: usage, category, library elements, bundling, documentation type, verification type, target JVM version/environment, test suite name, native OS/architecture, and Gradle plugin API version.
- Use modern JVM `Usage` plus `LibraryElements` values directly. In Gradle 9.7.1, writing legacy values such as `java-api-jars` or `java-runtime-classes` in build logic is deprecated, with a warning of planned failure in Gradle 10; the released migration contract preserves translation of legacy values in already-published Gradle Module Metadata.
- Custom attributes are a compatibility contract; published consumers need the plugin or schema that registers compatible and preferred values.
- Attribute precedence and disambiguation belong to the ecosystem/schema owner; local one-off rules can make published variants hard for consumers to interpret.
- Add compatibility rules when a producer value can satisfy a requested value. Add disambiguation rules when several compatible candidates remain.
- Register custom attributes and their compatibility/disambiguation rules in `dependencies.attributesSchema`; rules do not help consumers that never load the schema.
- For custom attributes typed as `Named`, create values through `ObjectFactory.named(...)` so producer and consumer values have the same typed identity.
- For JVM variants, `org.gradle.jvm.version` prefers the highest compatible target; do not patch this like an arbitrary string attribute.
- Treat `java.disableAutoTargetJvm()` (Gradle 5.3+) as a consumer-side escape hatch for dependency selection, not a producer metadata repair. It stops Gradle from constraining non-consumable Java configurations to the module's target compatibility, but the producer variant still publishes its own `org.gradle.jvm.version` and lower-JVM consumers can still fail.

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
./gradlew resolvableConfigurations [--configuration <configuration>|--all|--recursive]
./gradlew dependencyInsight --dependency <module> --configuration <configuration>
```

Use `resolvableConfigurations` on Gradle 7.5+; use reports to compare requested attributes with producer attributes before editing rules. `outgoingVariants` shows the producer's consumable variants, capabilities, artifacts, and secondary variants; `resolvableConfigurations` shows the consumer's attributes, extended configurations, compatibility rules, disambiguation rules, and attribute precedence. Add `--all` for hidden legacy entries or attribute-less outgoing configurations. Use `--recursive` to include transitively extended configurations; `extendsFrom` does not inherit attributes, so set the contract on the actual resolvable or consumable configuration. `dependencyInsight` can show when dynamic-version candidates were rejected because their variants did not match requested attributes.

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
- Capability conflict resolution can only select a provider present among the current conflict candidates; it cannot add a desired module to the graph, and `select(null)` is an error, not a way to leave the conflict unresolved.
- If a capability has multiple unresolved conflict sets, every set needs a valid selection policy or the build still fails.
- Gradle can select multiple variants of the same component only when their capabilities differ and their attributes are mutually compatible; same capability or incompatible attributes still fail.

## Feature Variants

- Feature variants are Java-library variant contracts for optional or mutually exclusive library features; use them instead of Maven optional dependencies when Gradle consumers need precise dependency and capability metadata.
- The feature-variant DSL (`registerFeature`, Gradle 5.3+) is Java plugin support on top of the general variant/capability model; apply `java`, `java-library`, or another JVM plugin that provides the Java component before calling `registerFeature`.
- Give each feature its own source set and feature-specific dependency buckets. Do not register a feature on the `main` source set.
- Consumers request a feature by declaring the dependency and requiring the feature capability; multiple distinct capabilities from one component can coexist, but variants that share a capability are mutually exclusive.
- Follow the default capability naming convention of main artifact name plus the kebab-case feature name unless the domain needs a custom capability.
- The first `FeatureSpec.capability(...)` call suppresses the default feature capability; subsequent calls add capabilities, so re-declare the default feature capability when adding an extra shared or alternate capability.
- Use `disablePublication()` (Gradle 6.7+) for local-only feature variants that should participate in project dependency resolution without becoming published API.
- Publishing feature variants requires `maven-publish` or `ivy-publish`; Gradle Module Metadata preserves the feature contract, while Maven represents it through optional dependencies and classifiers.
- Consumers can require feature capabilities from project dependencies or Gradle Module Metadata. With Ivy metadata alone, explicitly select the feature configuration by name; Ivy does not preserve capabilities. Maven POM optional dependencies and classifiers likewise do not preserve capability-based feature selection.
- Use shared capabilities to model mutually exclusive implementations so resolution fails with an explicit choice instead of silently combining incompatible runtime features.
