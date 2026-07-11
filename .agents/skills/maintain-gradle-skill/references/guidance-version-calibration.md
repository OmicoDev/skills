# Gradle Version Calibration

Read this when: current documentation or source behavior may differ across Gradle, Wrapper, Tooling API, plugin, IDE, CI action, or integration releases.

## Version-Boundary Calibration

- Treat current Gradle documentation and source as evidence for current behavior, not evidence that the behavior exists in every supported release.
- For each new runtime claim about an API, property, CLI option or output, task, default, deprecation, failure message, cache behavior, or model boundary, determine whether it was introduced, renamed, changed, deprecated, or removed. Put a material version qualifier beside the owning runtime guidance instead of relying on a distant compatibility note.
- Identify the component that actually carries the behavior before naming a version: wrapper scripts or JAR, downloaded Gradle distribution, client or daemon, Tooling API client, plugin, CI action, IDE, or external integration. Do not assume changing `distributionUrl` upgrades the checked-in Wrapper JAR or another caller-side component.
- Prefer versioned manuals and API docs, upgrade or release notes, compatibility tables, tagged source, and cross-version tests. For source-only boundaries, compare release tags and use history searches such as `git log -S` plus `git tag --contains`; verify against a release tag rather than inferring support from a commit date alone.
- When current behavior looks new, renamed, surprising, or absent from public documentation, compare at least one relevant older release before promoting it as universal runtime guidance.
- A source-index path at the current calibration baseline proves that code exists in that baseline only; it does not establish the first supported version. Keep provenance in the source index and the actionable version boundary in the owning runtime reference.
- If the exact boundary remains uncertain, scope the rule to the verified release or describe it as current behavior; do not invent an earliest version or silently generalize it across legacy wrappers and builds.
- Keep owner-specific version qualifiers with the owner guidance. Reserve `compatibility-version-snapshots.md` for recurring release-level Java, Kotlin, Groovy, and Android Gradle Plugin ranges rather than moving every introduced API or flag into a central version catalog.

## Compatibility Calibration

- Separate version existence from compatibility facts: the Gradle versions API identifies released Gradle versions; compatibility pages establish Java, Kotlin, Groovy, AGP, platform, Tooling API, and TestKit support.
- Use `https://services.gradle.org/versions/current` to identify the latest final Gradle release.
- Use `https://services.gradle.org/versions/all` to identify the latest stable patch per major line; ignore entries where `snapshot`, `nightly`, `releaseNightly`, `broken`, or non-empty `rcFor` are present.
- Verify `https://docs.gradle.org/<version>/userguide/compatibility.html` exists and contains the expected matrix before promoting an API-reported current version into compatibility knowledge.
- Use `https://docs.gradle.org/current/userguide/compatibility.html` for upgrade-target decisions and `https://docs.gradle.org/<gradle-version>/userguide/compatibility.html` for legacy-wrapper diagnosis.
- Keep release-level Java, Kotlin, Groovy, and Android Gradle Plugin ranges in `compatibility-version-snapshots.md`.
- Keep the Java runtime/toolchain table and Java symptom ownership in `compatibility-java.md`.
- Keep the embedded Kotlin table and Kotlin DSL ownership rules in `compatibility-kotlin.md`.
- Keep `compatibility-matrix.md` as a compatibility router and cross-surface rule page, not as a copied upstream matrix.
- Do not cite Gradle release anchors as compatibility evidence. Release pages and API results are calibration inputs; compatibility pages are support evidence.
