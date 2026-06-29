# Gradle Publications And Signing

Read this when: Maven/Ivy publishing, Gradle Module Metadata, signing, publication identity, generated POMs, Maven Local, Plugin Portal publishing, or publishing dry-runs owns the work.

## Publication Model

- Publications define what artifacts and metadata are published.
- Repositories define where publications are published.
- Publishing tasks are generated from publication and repository combinations; task names include the publication name and repository name, with unnamed repositories becoming `Maven` or `Ivy`.
- `publish` publishes defined publications to defined publishing repositories; Maven Local is reached through the separate `publishToMavenLocal` tasks.
- Maven identity defaults to project `group`, project name, and project `version`; Ivy identity defaults to `organisation`, `module`, `revision`, and `status`. Override deliberately when published coordinates differ from project identity.
- Maven `groupId` and `artifactId` have a restricted character set; Ivy identity is looser but still rejects `/`, `\`, and control characters. Do not let project paths or directory-derived names leak into external coordinates.
- Gradle Module Metadata carries Gradle variants and should usually be published with Gradle-built libraries.
- Gradle Module Metadata is published alongside Maven POM or Ivy descriptors. The descriptor marker lets Gradle consumers prefer the `.module` file, while Maven and Ivy consumers still use their normal descriptors in degraded mode.
- Maven POM and Ivy descriptor customization should be narrow and intentional; descriptor XML hooks can create invalid external metadata.

## Metadata Checks

- Verify `group`, artifact ID, version, packaging, dependencies, variants, and capabilities before release.
- If a published project depends on another project, ensure the target project also has a publication; Gradle 10 no longer silently publishes dependency coordinates inferred from an unpublished project's `group`, name, and `version`.
- Verify source/javadoc artifacts and Gradle Module Metadata when the target repository or consumers rely on them.
- Treat Gradle Module Metadata publication warnings as consumer-compatibility evidence; suppress them only after naming the lost semantics and deciding Maven/Ivy degraded metadata is acceptable.
- Gradle Module Metadata validates unique variant names, at least one attribute per variant, no duplicate attribute/capability sets, and dependency version information across dependency-bearing variants.
- Suppress a `GenerateModuleMetadata` validation error only after naming the validation and proving the published consumer behavior still works.
- Publishing a unique build identifier in module metadata makes the metadata differ every invocation; use it only when downstream out-of-date behavior is intended.
- If Gradle-only semantics such as rich versions, transitive constraints, capabilities, feature variant dependencies, or custom component contracts matter to consumers, prefer publishing Gradle Module Metadata instead of hiding Maven/Ivy warnings.
- Publish extra consumable artifacts as component variants or an adhoc component when they have dependencies, attributes, or capabilities; direct `artifact(...)` attachments are out-of-context and usually reachable only by classifier.
- If a direct custom artifact is unavoidable, make its `classifier` and `extension` distinct within the publication; archive tasks provide those values, raw files often need explicit metadata.
- When adding variants from configurations, decide Maven/Ivy scope mapping or skip variants that cannot be represented externally; Gradle Module Metadata can represent the variant contract exactly, but Maven POMs cannot.
- Feature variants degrade in Maven to uploaded classifier artifacts plus optional dependencies, and in Ivy to uploaded artifacts without dependencies; publish GMM when the feature dependency graph matters.
- Disable Gradle Module Metadata publication only when the repository rejects it or Maven/Ivy-specific modeling truly cannot be represented safely.
- Keep relocation POMs narrow and temporary; avoid publishing duplicate coordinates that both look canonical.
- Avoid deferred or late mutation of publications; configure publications during normal configuration. Publishing tasks are created late, so configure task behavior through the task collection by task type/name.

## Maven Publishing

- Use `maven-publish` for Maven repositories.
- Prefer `from(components["java"])` or the owning component over hand-assembled artifacts.
- Set `group`, `version`, and artifact identity deliberately.
- Configure snapshot/release repositories with provider-backed credentials.
- Use `publishToMavenLocal` only for local interop; it does not require `mavenLocal()` in `publishing.repositories` and does not create checksum files. Publish to a file-backed Maven repository when checksum output must be verified before release.
- Inspect generated POM and module metadata outputs before remote release when identity, dependency versions, relocation, or warnings changed.
- Use `generatePomFileFor<PubName>Publication` and `generateMetadataFileFor<PubName>Publication` to inspect descriptors without publishing.
- Use dry-run or file-backed local repository publishing before remote release; then consume the module from a fixture when metadata, variants, relocation, or plugin markers changed.
- Use `versionMapping` when a release should publish resolved versions, especially with dynamic versions, rich versions, or dependency locking. When locking affects published dependencies, prefer publishing the locked/resolved versions deliberately.
- Do not assume `maven-publish` can deploy directly to Maven Central: since June 30, 2025, Central requires a dedicated publishing plugin/workflow instead of the legacy Maven Deploy protocol.

## Release Safety

- Keep snapshot and release repository selection explicit.
- Read credentials through providers and CI secrets.
- Make publishing tasks opt-in for PR builds unless snapshots are intentional.
- Because publishing plugins create tasks for every publication/repository combination and wire them to `publish`, use `onlyIf(...)` or custom aggregate tasks when only selected publications may go to selected repositories.
- Run publication verification tasks, local repository publication, dependency lock checks, and verification metadata checks before pushing to external repositories.
- When coordinates move, publish relocation metadata once at the old coordinates, usually for the next old-coordinate version, then remove the temporary relocation publication from build logic.
- In a relocation POM, set only changed `groupId` or `artifactId`; set relocation `version` only when the replacement artifact intentionally uses a different version, and use `message` for human migration context.
- Relocation POMs are for coordinate moves; when an artifact splits into multiple artifacts, prefer explicit migration guidance instead of pretending one canonical target exists.
- If old and new coordinates can appear together while containing the same classes, publish capabilities in Gradle Module Metadata so Gradle consumers see a conflict instead of silently combining duplicates.

## Signing

- Gradle's Signing plugin produces OpenPGP signatures.
- On Gradle 9+, generated OpenPGP signature version follows the signing key version; if a repository or downstream verifier rejects signatures, inspect key version support before assuming Gradle emits v4 signatures.
- Sign release publications when the target repository requires it; avoid signing ordinary PR builds unless CI intentionally exercises release publishing.
- Source signing keys and passwords from CI secrets or user-local properties.
- Prefer in-memory ASCII-armored keys in CI; in-memory subkeys also need `signingKeyId`, while `GnupgSignatory` delegates local signing to installed GnuPG or gpg-agent.
- Sign publications when release consumers need all artifacts and generated metadata signed; publication signing wires publish tasks to `Sign` and distributes signatures automatically. Sign task outputs or configurations only for non-publication workflows.
- Signing a publication automatically attaches the signature artifacts to that publication; signing configurations or tasks writes signature artifacts to the `signatures` configuration.
- Only archive-producing tasks are directly signable as task outputs.
- Make signing conditional on release intent or selected publish tasks so ordinary verification and PR builds do not require credentials.
- Use `required(...)` to defer whether signing credentials are mandatory, and `onlyIf(...)` on Sign tasks when signing should be skipped entirely outside release publishing.

## Plugin Portal

- Gradle plugin publishing uses plugin metadata and marker artifacts.
- A publishable plugin needs plugin ID, implementation class, `group`, and `version`; the `gradlePlugin.plugins` block name is local build identity, while `id` and generated marker coordinates are consumer-facing.
- The plugin marker module is what lets consumers resolve `plugins { id("...") }`; if a plugin was published without marker artifacts, consumers need `pluginManagement.resolutionStrategy` or a corrected publication.
- Plugin Publish Plugin 1.0+ auto-applies `java-gradle-plugin` and `maven-publish`, publishes sources/Javadoc jars, and signs plugin artifacts when the Signing plugin is applied.
- Treat `validatePlugins`, file-backed repository fixture consumption, and `publishPlugins --validate-only` as separate gates: plugin implementation quality, marker/resolution behavior, and Portal metadata; Portal validation does not bypass approval.
- Before remote publishing, consume the locally published plugin through `pluginManagement.repositories` from a fixture build so marker metadata, implementation class, variants, sources/Javadoc, and checksums are tested together.
- Keep Plugin Portal credentials in user-local Gradle properties (`gradle.publish.key`, `gradle.publish.secret`) or CI environment variables (`GRADLE_PUBLISH_KEY`, `GRADLE_PUBLISH_SECRET`), not in project files.
- Published plugin builds should treat stricter `validatePlugins` findings as release blockers.
- Keep plugin publication separate from ordinary library publication unless the project intentionally publishes both.

## Failure Triage

- Missing artifact or publish task: inspect the component, publication name, repository name or implicit `Maven`/`Ivy` name, and generated tasks.
- Wrong POM metadata: inspect identity, dependency versions, and POM customization.
- Published POM or Ivy descriptor still shows declared/dynamic versions after locks or resolution rules: configure `versionMapping` with `fromResolutionResult()` or `fromResolutionOf(...)`, then inspect the generated descriptor before publishing.
- Publication warning about lost Gradle semantics: inspect constraints, rich versions, capabilities, feature variants, and custom components.
- Credential failure: inspect provider names, CI secrets, and repository URL selection.
- Plugin resolves locally but fails when applied: inspect marker module coordinates, implementation-class metadata, plugin classpath dependencies, and variant attributes before changing Portal credentials.
- Duplicate or stale publication: inspect repository coordinates and relocation metadata.
- Legacy publishing logic depending on deferred configuration: prefer provider/plugin ordering repairs; use `afterEvaluate` only as a migration bridge.
