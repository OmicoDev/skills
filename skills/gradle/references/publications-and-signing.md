# Gradle Publications And Signing

Read this when: Maven/Ivy publishing, Gradle Module Metadata, signing, publication identity, generated POMs, Maven Local, Plugin Portal publishing, or publishing dry-runs owns the work.

## Publication Model

- Publications define what artifacts and metadata are published.
- Repositories define where publications are published.
- Tasks are generated from publication and repository combinations.
- Gradle Module Metadata carries Gradle variants and should usually be published with Gradle-built libraries.
- Gradle Module Metadata is published alongside Maven POM or Ivy descriptors; it improves Gradle consumers without replacing other tools' metadata.
- Maven POM customization should be narrow and intentional.

## Metadata Checks

- Verify `group`, artifact ID, version, packaging, dependencies, variants, and capabilities before release.
- Verify source and javadoc artifacts when the target repository requires them.
- Verify Gradle Module Metadata when consumers rely on variants or capabilities.
- Treat Gradle Module Metadata publication warnings as consumer-compatibility evidence; suppress them only after deciding Maven/Ivy degraded metadata is acceptable.
- Keep relocation POMs narrow and temporary; avoid publishing duplicate coordinates that both look canonical.
- Avoid deferred or late mutation of publications; configure publications during normal configuration.

## Maven Publishing

- Use `maven-publish` for Maven repositories.
- Prefer `from(components["java"])` or the owning component over hand-assembled artifacts.
- Set `group`, `version`, and artifact identity deliberately.
- Configure snapshot/release repositories with provider-backed credentials.
- Use `publishToMavenLocal` only for local interop; do not treat Maven Local as a release repository.
- `publishToMavenLocal` does not require `mavenLocal()` in `publishing.repositories`.
- Use dry-run or local repository publishing before remote release.
- Use `versionMapping` when a release should publish resolved versions, especially with dynamic versions, rich versions, or dependency locking.
- Do not assume `maven-publish` can deploy directly to Maven Central's current process; check the required Central publishing plugin/workflow.

## Release Safety

- Keep snapshot and release repository selection explicit.
- Read credentials through providers and CI secrets.
- Make publishing tasks opt-in for PR builds unless snapshots are intentional.
- Run publication verification tasks and local repository publication before pushing to external repositories.
- Check dependency locks and verification metadata before release publication.
- When coordinates move, publish relocation metadata once, then remove the temporary relocation publication from build logic.

## Signing

- Sign release publications when the target repository requires it.
- Source signing keys and passwords from CI secrets or user-local properties.
- Avoid signing ordinary PR builds unless the CI flow intentionally exercises release publishing.

## Plugin Portal

- Gradle plugin publishing uses plugin metadata and marker artifacts.
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

Primary upstream pages: Maven Publish Plugin, Ivy Publish Plugin, Signing Plugin, Publishing Gradle Module Metadata, Publishing Plugins to the Gradle Plugin Portal.
