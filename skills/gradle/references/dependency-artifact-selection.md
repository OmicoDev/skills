# Gradle Dependency Artifact Selection

Read this when: artifact views, artifact-only notation, classifier artifacts, variant-aware project artifact sharing, or concrete artifact files from a resolved graph owns the issue.

## Scope Boundary

- This file owns how a resolved dependency graph produces concrete artifact files.
- Use [dependency-variants-and-metadata.md](dependency-variants-and-metadata.md) when the issue is component attributes, capabilities, or variant matching before artifact selection.
- Use [dependency-metadata-rules.md](dependency-metadata-rules.md) when external metadata repair is needed before artifact selection.
- Use [dependency-artifact-transforms.md](dependency-artifact-transforms.md) when the issue is transform implementation, registration, caching, chaining, scheduling, or transform diagnostics.
- Use [file-operations-and-archives.md](file-operations-and-archives.md) when the issue is copying, unpacking, archiving, permissions, or reproducible local file work after artifacts are selected.
- Use [build-cache-and-incremental.md](build-cache-and-incremental.md) when the main question is cache hit or miss behavior after the artifact or transform owner is known.

## Artifact Selection Choices

- Prefer published variants or variant-aware project sharing when the producer can model the artifact contract.
- Artifact selection happens node by node after graph selection; each selected variant contributes at most one matching artifact set unless an artifact view reselects a parallel variant.
- Use an artifact view when the resolved graph is correct but the consumer needs a different artifact set, lenient artifact resolution, or per-component filtering.
- Use `incoming.resolutionResult` when diagnostics need graph structure without artifact downloads; use `incoming.files`, `incoming.artifacts.artifactFiles`, or `artifactView.files` when the task only needs files.
- Wire a resolvable `Configuration` or `artifactView.files` directly into task file inputs when a task only needs files; avoid materializing `getFiles()` during configuration, and use an artifact view instead of mutating shared configuration attributes for one consumer's artifact shape.
- Use [dependency-artifact-transforms.md](dependency-artifact-transforms.md) when a reusable conversion can derive the requested artifact attributes from existing artifacts.
- Use artifact-only notation such as `group:name:version@zip` only for module dependencies that truly bypass metadata. It skips variant-aware resolution, capabilities, and transitive dependencies, and does not apply to project or file dependencies.
- If the build still needs metadata-backed variant selection but wants a different file, use an artifact view, variant reselection, or metadata repair instead of `@extension`.
- If direct artifact-only retrieval fails or starts needing metadata behavior, remove `@extension` and repair metadata or variants; do not expect component metadata rules to restore variant-aware semantics to an artifact-only declaration.
- Use classifier notation for a specific legacy Maven/Ivy artifact only when the classifier is not a real variant contract. If the classifier represents JVM, native, platform, or feature semantics, model it with [dependency-metadata-rules.md](dependency-metadata-rules.md) or variants.

## Artifact Views

- An artifact view operates on top of a resolved dependency graph. It changes artifact selection, not the original graph selection.
- Use `FileCollection` when task inputs need only files; use `ArtifactCollection` when diagnostics or task inputs need artifact metadata as well as files.
- `ArtifactCollection.getResolvedArtifacts()` returns a live provider that keeps producer task dependencies; use it to map `ResolvedArtifactResult` into stable task properties when metadata is needed, rather than iterating `getArtifacts()` during configuration.
- For configuration-cache-compatible tasks, split `ResolvedArtifactResult` data into stable file and metadata task properties instead of storing resolution result objects as task inputs.
- Avoid new use of legacy `ResolvedConfiguration`, `LenientConfiguration`, `ResolvedArtifact`, and `ResolvedDependency` APIs; they use default artifact attributes and are maintenance-mode surfaces.
- Replace filtered `Configuration.files(...)`, `Configuration.fileCollection(...)`, and legacy lenient filtering with `incoming.artifactView { componentFilter { ... } }`, remembering that the filter sees each selected component owner, not dependency-declaration ancestry.
- Avoid new `ArtifactResolutionQuery` use for sources or javadoc; prefer an artifact view with `withVariantReselection()` and documentation attributes.
- Without variant reselection, artifact selection must still come from the graph-selected component variant.
- Use `withVariantReselection` only when the consumer intentionally wants a parallel variant of each selected component, such as sources or javadoc. Treat it as an incubating API and provide the complete target variant attributes because the configuration's graph attributes are ignored during reselection.
- Without variant reselection, artifact view attributes are combined with the graph resolution attributes for artifact selection and may trigger transforms when no selected artifact set matches.
- Use lenient artifact views to collect available artifacts while keeping failures inspectable. Do not use lenient resolution to hide required dependencies in verification or release paths.
- Lenient artifact views can omit failed modules, unresolved conflicts, or failed artifact downloads; use the `ArtifactCollection` failure details before treating partial files as complete.
- Use `componentFilter` for per-component artifact filtering. It filters selected artifacts by component owner, not by arbitrary file path, and each artifact view has only one component filter.
- When an artifact view requests attributes that the selected artifact set does not expose, Gradle may trigger registered artifact transforms; read [dependency-artifact-transforms.md](dependency-artifact-transforms.md) before implementing or debugging one.

## Variant-Aware Project Artifact Sharing

- Treat "secondary variants" in reports as artifact sets or precomputed transforms exposed by an already-selected variant; they participate in artifact selection, not graph selection.
- Before creating a custom project artifact variant, inspect the producer's existing outgoing variant such as `runtimeElements` and copy only the attributes that describe the new artifact contract.
- If the graph variant is correct and only the files differ, add or select an artifact set before creating a new component variant.
- Expose generated project artifacts with consumable configurations, attributes, capabilities, and task-backed artifacts under `build/`.
- Consume custom project artifacts through resolvable configurations with matching attributes, not by depending on another project's task path or files.
- Use separate declarable and resolvable configurations when a consumer needs a custom artifact graph; declare dependencies on the bucket configuration and have the resolvable configuration extend it with the requested attributes.
- Keep producer and consumer responsibilities separate: the producer publishes the artifact contract, while the consumer declares a project dependency and resolves the requested attributes.
- Do not publish multiple consumable configurations with identical attributes and capabilities; Gradle cannot choose between equivalent variants.
- Use compatibility rules for deliberate fallbacks, such as accepting a regular jar when an instrumented jar is unavailable.
- Treat missing-fallback behavior as an attribute schema problem, not a reason to add direct task dependencies or copy files from another project.
- Validate producer and consumer sides together with `outgoingVariants` and `resolvableConfigurations`.

## Diagnostics

```bash
./gradlew outgoingVariants [--variant <variantName>|--all]
./gradlew resolvableConfigurations [--configuration <configuration>|--all]
```

- Use `outgoingVariants` to confirm artifact attributes, capabilities, and task-backed files on the producer.
- Use `resolvableConfigurations` to confirm the consumer asks for the intended attributes.
- On Gradle 9+, these reports hide variants and configurations without attributes by default; add `--all` when diagnosing whether an entry is missing or merely non-selectable by variant-aware resolution.
- Use [dependency-artifact-transforms.md](dependency-artifact-transforms.md) when `artifactTransforms` evidence or transform-cache behavior owns the issue.

## Failure Map

- Missing custom project artifact: check producer attributes, artifact task provider, and consumer resolvable configuration attributes before adding task dependencies.
- Ambiguous custom project artifact: remove equivalent producer variants or differentiate their attributes/capabilities before adding consumer-side selection hacks.
- Artifact-only dependency lost transitives: replace `@extension` notation with normal metadata-backed coordinates first; metadata rules can repair metadata only after the declaration stops bypassing metadata.
- Artifact-only dependency ignores metadata repair: remove `@extension` first; component metadata rules cannot help a dependency declaration that deliberately bypasses metadata.
- Sources or javadoc view returns runtime artifacts: check whether `withVariantReselection` is missing or whether the view attributes still describe the graph-selected variant.
