# Gradle Dependency Artifact Transforms

Read this when: artifact transform implementation, registration, chaining, scheduling, caching, incremental transform work, or `artifactTransforms` diagnostics owns dependency artifact conversion.

## Scope Boundary

- This file owns reusable artifact conversions selected during dependency resolution.
- Use [dependency-artifacts-and-transforms.md](dependency-artifacts-and-transforms.md) when the issue is artifact views, artifact-only notation, classifier artifacts, or project artifact sharing.
- Use [dependency-variants-and-metadata.md](dependency-variants-and-metadata.md) when the issue is variant matching, component attributes, or capabilities before artifact selection.
- Use [build-cache-and-incremental.md](build-cache-and-incremental.md) when a transform cache hit/miss needs broader cache-key triage after transform inputs are known.

## Transform Model

- Transforms convert artifacts during dependency resolution before task inputs consume them.
- A transform modifies artifact files and creates a virtual artifact set; it does not change dependency metadata, transitive dependencies, capabilities, or the component variant itself.
- Artifact selection is per graph node. Gradle selects one artifact set from the selected variant, then looks for a transform chain only when no artifact set matches the requested attributes.
- Gradle runs transforms only when no existing variant or artifact set can satisfy the requested attributes.
- Requested artifact attributes are the resolved configuration attributes plus artifact view attributes plus dependency-declared artifact attributes; inspect all three when a transform does not select.
- Transform selection works backward from requested attributes to existing variants, may build transform chains, prefers the shortest suitable chain, and fails when equally short chains produce different suitable results. If equally short chains produce the same result attributes, Gradle may choose either chain; do not rely on registration order.
- Treat transform attributes as a published contract. Add every requested artifact attribute to the consumable or resolvable side that needs it instead of relying on task code to discover formats later.
- Register custom artifact attributes in the attributes schema and put the default value on every produced artifact set that may be transformed; missing defaults can make a transform path unreachable.

## Implementation

- Implement transforms as `TransformAction<P>` classes with exactly one `@InputArtifact` `Provider<FileSystemLocation>` and optional `TransformParameters`.
- Use `TransformParameters.None` when no parameters are needed.
- Define transform parameters as a managed interface or abstract class implementing `TransformParameters`; use managed properties with input annotations for every behavior-affecting parameter.
- Register outputs with `TransformOutputs.file(...)` or `TransformOutputs.dir(...)`. Relative paths allocate transform workspace locations; absolute paths can point at the input artifact or locations inside an input directory.
- When a transform decides no conversion is needed for one artifact, register the unchanged input artifact as the output instead of copying it into a new workspace file.
- Do not write transform outputs to arbitrary external paths. Use relative `TransformOutputs` locations for new outputs, or absolute paths only when returning the input artifact or files already inside an input directory.
- Do not declare transform outputs with task-style `@OutputFile` or `@OutputDirectory` properties; artifact transforms own outputs only through the `TransformOutputs` parameter.
- A transform may produce zero, one, or many output artifacts; registered outputs replace the input artifacts in registration order.
- Add `@CacheableTransform` only when outputs are deterministic and relocatable. Cacheable transforms need normalization such as `@PathSensitive` on `@InputArtifact` and `@InputArtifactDependencies`, but absolute path sensitivity is invalid for artifact transforms.
- Use `@DisableCachingByDefault(because = "...")` when a transform is intentionally not cacheable; missing cacheability intent is a validation signal for transform actions just like task types.
- Inject `@InputArtifactDependencies` only when transitive dependency files genuinely affect the conversion because it expands the resolution and cache surface.
- Incremental transforms can inject `InputChanges`, but only the input artifact is incremental.
- Keep transforms parallel-safe; the same transform may run concurrently for different artifacts.

## Registration And Scheduling

- Register transforms with `dependencies.registerTransform(...)` in the project that resolves the configuration.
- Declare at least one `from` and one `to` attribute; each `to` attribute needs a corresponding `from` attribute, while extra `from` attributes may narrow applicability.
- Configure transform options through the registration `parameters {}` block.
- Transforms are triggered by artifact selection from configurations or artifact views; they are not command-line tasks.
- Project dependency transforms can often be discovered before task execution; external module transforms are usually scheduled inside the consuming task execution.
- Do not expect external module transforms to appear as separate scheduled tasks; prove them through artifact resolution output, transform cache behavior, or the consuming task's inputs.
- If a project dependency transform runs inside the consuming task, inspect whether the producer artifact is task-backed and declared as a task input/output correctly before blaming transform scheduling.
- A transform action is instantiated only when input artifacts exist. Empty input artifact sets skip that transform and any later transforms in the chain.
- If multiple resolution requests need the same cacheable transform on the same artifacts, Gradle can reuse the transform result instead of rerunning the action.

## Diagnostics

```bash
./gradlew artifactTransforms
./gradlew :subproject:artifactTransforms
```

- Use `artifactTransforms` in the project that registers or resolves transforms; the root report can be empty when subprojects own the registrations.
- The `artifactTransforms` report shows transform type, cacheable status, and `from`/`to` attributes; confirm those facts before changing cache policy or attribute wiring.
- Confirm requested artifact attributes from the resolvable configuration or artifact view before changing transform registration.
- Transform never runs: an existing artifact set already matches, the transform is registered in the wrong project, attributes do not connect, or the input variant has no artifacts.
- Chain stops after an earlier transform: confirm the previous transform produced at least one registered output artifact; empty output skips downstream transforms.
- Ambiguous transform chain: reduce overlapping transform registrations or make requested attributes more specific.
- Transform runs for external modules but not project dependencies: compare project outgoing artifact attributes with module metadata and check whether an existing project variant already satisfies the request.
- Cache misses: inspect input artifact normalization, parameters, input artifact dependencies, tool versions, and non-deterministic outputs.
- Reserved-location write failure: check for tasks or ad hoc code writing into transform workspaces; only the transform action should create files in locations returned by `TransformOutputs`.

## Source Calibration

Primary upstream pages: Artifact Transforms, Artifact Views, Validation Problems.
