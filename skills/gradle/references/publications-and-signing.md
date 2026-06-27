# Gradle Publications And Signing

Read this when: Maven/Ivy publishing, Gradle Module Metadata, signing, publication identity, generated POMs, Maven Local, Plugin Portal publishing, or publishing dry-runs owns the work.

## Publication Model

- Publications define what artifacts and metadata are published.
- Repositories define where publications are published.
- Tasks are generated from publication and repository combinations.
- `publish` publishes defined publications to defined publishing repositories; Maven Local is reached through the separate `publishToMavenLocal` tasks.
- Maven publication identity defaults to project `group`, project name, and project `version`; override `groupId`, `artifactId`, or `version` deliberately when published coordinates differ from project identity.
- Maven `groupId` and `artifactId` have a restricted character set; do not let project paths or directory-derived names leak into external coordinates.
- Gradle Module Metadata carries Gradle variants and should usually be published with Gradle-built libraries.
- Gradle Module Metadata is published alongside Maven POM or Ivy descriptors. The descriptor marker lets Gradle consumers prefer the `.module` file, while Maven and Ivy consumers still use their normal descriptors in degraded mode.
- Maven POM customization should be narrow and intentional.

## Metadata Checks

- Verify `group`, artifact ID, version, packaging, dependencies, variants, and capabilities before release.
- Verify source and javadoc artifacts when the target repository requires them.
- Verify Gradle Module Metadata when consumers rely on variants or capabilities.
- Treat Gradle Module Metadata publication warnings as consumer-compatibility evidence; suppress them only after naming the lost semantics and deciding Maven/Ivy degraded metadata is acceptable.
- Gradle Module Metadata validates unique variant names, at least one attribute per variant, no duplicate attribute/capability sets, and dependency version information across dependency-bearing variants.
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
- Use `generatePomFileFor<PubName>Publication` to inspect Maven metadata without publishing; the default output is `build/publications/<pubName>/pom-default.xml`.
- Use dry-run or local repository publishing before remote release.
- Use `versionMapping` when a release should publish resolved versions, especially with dynamic versions, rich versions, or dependency locking. When locking affects published dependencies, prefer publishing the locked/resolved versions deliberately.
- Do not assume `maven-publish` can deploy directly to Maven Central's current process; check the required Central publishing plugin/workflow.

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
- Sign release publications when the target repository requires it; avoid signing ordinary PR builds unless CI intentionally exercises release publishing.
- Source signing keys and passwords from CI secrets or user-local properties.
- Prefer in-memory ASCII-armored keys or subkeys in CI so private key material does not need a committed or cached keyring file.
- Sign publications when release consumers need all artifacts and generated metadata signed; publication signing wires publish tasks to `Sign` and distributes signatures automatically. Sign task outputs or configurations only for non-publication workflows.
- Signing a publication automatically attaches the signature artifacts to that publication; signing configurations or tasks writes signature artifacts to the `signatures` configuration.
- Only archive-producing tasks are directly signable as task outputs.
- Make signing conditional on release intent or selected publish tasks so ordinary verification and PR builds do not require credentials.
- Use `required(...)` to defer whether signing credentials are mandatory, and `onlyIf(...)` on Sign tasks when signing should be skipped entirely outside release publishing.

## Plugin Portal

- Gradle plugin publishing uses plugin metadata and marker artifacts.
- A publishable plugin needs plugin ID, implementation class, `group`, and `version`; verify that generated coordinates match the intended owner and plugin namespace.
- The plugin marker module is what lets consumers resolve `plugins { id("...") }`; if a plugin was published without marker artifacts, consumers need `pluginManagement.resolutionStrategy` or a corrected publication.
- The Plugin Publish Plugin automatically publishes sources and Javadoc jars; applying the Signing plugin signs plugin artifacts.
- Before remote publishing, publish to a file-backed Maven repository and consume it through `pluginManagement.repositories` from a fixture build.
- `publishPlugins --validate-only` validates Plugin Portal metadata without uploading.
- Keep Plugin Portal credentials in user-local Gradle properties or CI environment variables such as `GRADLE_PUBLISH_KEY` and `GRADLE_PUBLISH_SECRET`, not in project files.
- Test plugin IDs, implementation classes, plugin marker artifacts, sources/javadoc, and functional behavior before publishing.
- Keep plugin publication separate from ordinary library publication unless the project intentionally publishes both.

## Failure Triage

- Missing artifact: inspect publication component and generated tasks.
- Wrong POM metadata: inspect identity, dependency versions, and POM customization.
- Publication warning about lost Gradle semantics: inspect constraints, rich versions, capabilities, feature variants, and custom components.
- Credential failure: inspect provider names, CI secrets, and repository URL selection.
- Duplicate or stale publication: inspect repository coordinates and relocation metadata.
- Legacy publishing logic depending on deferred configuration: prefer provider/plugin ordering repairs; use `afterEvaluate` only as a migration bridge.

## Source Calibration

Primary upstream pages: Maven Publish Plugin, Ivy Publish Plugin, Signing Plugin, Publishing Gradle Module Metadata, Customizing Publishing, Preparing to Publish Plugins, Publishing Plugins to the Gradle Plugin Portal.
