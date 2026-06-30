# Gradle Dependency Verification

Read this when: `verification-metadata.xml`, checksums, signatures, trusted keys, keyrings, bootstrapping, or dependency verification failures own the work.

## Verification Model

- Dependency verification checks artifacts resolved through Gradle dependency management against expected checksums or signatures.
- Checksums prove byte integrity. Signatures prove provenance. Use both for strongest release trust when maintainable.
- Signature verification without checksums can miss weak-hash integrity problems.
- With signature verification enabled, unsigned artifacts still require checksum fallback, and any configured checksums are checked even after a signature passes.
- When multiple checksum algorithms are declared for one artifact, Gradle verifies all of them; a stale weak checksum can fail an otherwise valid artifact.
- For artifacts signed by multiple keys, every signature must validate; one bad signature can fail the artifact even when another trusted signature passes.
- Verification metadata is security policy, not a cache artifact.
- Dependency verification is enabled when `gradle/verification-metadata.xml` exists; this XML file is currently Gradle's only dependency verification metadata source.
- Do not commit only a minimal `<configuration>` skeleton as a staged rollout; once the file exists, external dependencies and plugins without recorded metadata will fail in strict mode.
- The verification file is global for the current build and affects all subprojects and `buildSrc`; included builds use the current build's verification metadata, ignoring their own for this invocation.
- Verification does not replace repository content filters, dependency locking, wrapper validation, or Gradle distribution checksums.
- Verification protects against tampered or substituted dependency bytes and metadata; it does not identify known vulnerabilities in otherwise genuine dependencies.

## Commands

Bootstrap or update only after reviewing the dependency change:

```bash
./gradlew <task> --write-verification-metadata sha256
./gradlew <task> --write-verification-metadata sha256,pgp
./gradlew <task> --write-verification-metadata sha256 --dry-run
./gradlew <task> --dependency-verification lenient
./gradlew <task> --refresh-keys
./gradlew <task> --write-verification-metadata pgp,sha256 --export-keys
./gradlew --export-keys
```

- Use lenient mode for review and migration, not as a permanent release setting.
- Dry-run metadata is written to `gradle/verification-metadata.dryrun.xml`; compare it as a preview, but remember it can miss dependencies resolved only during task execution.
- Bootstrapping trusts the repositories and artifacts currently reachable by the build; review generated diffs manually.
- Metadata generation can resolve root, subproject, `buildSrc`, included-build, and plugin configurations; expect broad diffs after topology or plugin changes, and add entries manually for dependencies resolved only during task execution or custom resolution logic.
- Metadata generation writes external artifacts from resolvable configurations; expect project dependencies, file dependencies, changing dependencies, and consumable-only buckets to be absent rather than "missing" from generated metadata.
- Bootstrapping signatures is optimistic; bootstrap checksums first when integrity evidence matters, then add PGP trust.
- Treat auto-added trusted keys, ignored keys, and group-level key trust from PGP bootstrap as review items; narrow trusted keys with `group`, `name`, `version`, or `file` scopes after verifying the signer.
- Keep generation parameters consistent after the project chooses checksum-only or checksum-plus-signature policy.
- `--export-keys` can run without updating metadata, but it exports keys only and does not report verification errors.

## Verification Modes

- `strict` is the default and should own CI/release gates.
- `lenient` records and reports verification failures while allowing the build to continue; use it for migration and review only.
- `off` disables verification and should be limited to explicit local escape hatches.
- If `verification-metadata.xml` exists but verification appears inactive, inspect `--dependency-verification`, `org.gradle.dependency.verification`, and configuration `resolutionStrategy.disableDependencyVerification()` before trusting coverage.
- `org.gradle.dependency.verification.console=verbose` helps CI logs when the HTML report is hard to retrieve.

## Scope Boundaries

- Dependency verification checks downloaded dependencies, metadata files, plugins, and artifacts resolved through advanced resolution APIs.
- Artifact-view leniency does not bypass dependency verification; checksum, signature, and trust failures still belong to verification metadata or trust policy, not artifact-view configuration.
- It does not verify locally produced artifacts or changing dependencies whose bytes intentionally change.
- It does not verify the Gradle wrapper JAR or distribution; handle those through wrapper validation and `distributionSha256Sum`.
- Signature verification uses ASCII-armored PGP `.asc` signatures from remote repositories; if signatures are unavailable through that path, keep checksum coverage explicit.
- Generated verification entries should be reviewed like dependency upgrades.
- Keyring files can be committed to avoid repeated keyserver lookups; commit one format and treat it as public-key material.
- Disabling metadata verification shrinks metadata but can miss malicious POM, Ivy, or Gradle Module Metadata changes that alter transitive dependencies or selected variants.
- Configuration-level opt-outs are for plugins that resolve unknown future versions or similar cases where verification cannot be meaningful; avoid plugin or buildscript opt-outs because executable plugin code can otherwise weaken its own verification path, and Gradle prints a warning when verification is disabled for a configuration.
- `disableDependencyVerification()` is per resolved configuration, including detached configurations; resolving the same coordinates through another configuration still verifies them.
- `trusted-artifacts` rules bypass all verification for every matched file and can keep generated metadata from adding checksum entries for those artifacts; plain `group` matching is exact, and subgroup regex trusts should be rare, reasoned, and reviewed like other security exceptions.
- Trusting source or javadoc artifacts by filename can reduce IDE/import churn, but it is still a trust exception and should not cover runtime artifacts.

## Failure Triage

- Missing checksum: confirm the new dependency/version, then add generated metadata or a reviewed manual entry.
- Incorrect checksum: treat as high risk; test local cache corruption, then compare official upstream bytes and repository order.
- Untrusted signature: verify the signing key owner before trusting it.
- Do not trust a PGP key only because the key name, email, or error message looks plausible; verify the full fingerprint from an official project-controlled source.
- Failed signature: compare upstream-published signatures and downloaded signatures before adding exceptions.
- Expired signing keys do not automatically invalidate signatures; if the artifact was signed before key expiry and the signature verifies, keep triage focused on key ownership and artifact bytes.
- Wrong artifact from internal/public repository order: repair repository content filters before adding trust exceptions.
- Repeated missing keys: retry with `--refresh-keys`, then add public keys to a committed keyring if the owner is verified.
- Signature mismatch with safe artifact: use an artifact-level key exclusion paired with a checksum, not a broad group trust exception.
- Ignored unavailable keys are not trust evidence. If no other trusted key verifies the signature, provide a reviewed checksum.
- Name squatting or repository shadowing suspicion: verify coordinates and repository ownership before adding generated trust.

## Maintenance

- Review generated metadata diffs and replace `Generated by Gradle` origins only after verification.
- Remove stale entries when dependencies are removed; Gradle will not know all unused entries automatically.
- To clean stale metadata, move the existing metadata file aside before dry-run generation; dry-run and bootstrap are incremental and copy existing metadata such as trusted keys.
- Prefer SHA-256 or SHA-512 checksums; avoid MD5 and SHA-1 for new policy.
- Verify new checksums from a source independent of the artifact repository when possible, especially after repository compromise, mirroring, or shadowing suspicion.
- Use `also-trust` only after verifying alternate checksums for the same artifact from mirrors or separately produced repository metadata; do not treat it as a blanket mismatch escape hatch.
- Prefer artifact-level exceptions over broad component or group exceptions.
- Record reasons for ignored keys, trusted artifacts, and additional checksums.
- Use full 40-character fingerprints for `pgp` and `trusted-key` entries; `ignored-key` can use a long ID, but full fingerprints reduce collision risk.
- If a signature is wrong but the artifact is verified safe, pair the key exclusion with a checksum for that artifact.
- If CI disables key servers with `<key-servers enabled="false"/>`, keep committed keyrings fresh enough that missing keys fail early; `--write-verification-metadata` ignores that flag and may still contact key servers to fetch missing keys.
- Gradle caches missing keys for a period; use `--refresh-keys` when retrying a keyserver or keyring repair immediately.
- When using committed keyrings, choose either ASCII-armored `.keys` for readable diffs or binary `.gpg` for compact storage; do not commit both formats unless the policy explicitly requires it.
- Gradle 9.5+ may rewrite armored keyring headers that contain non-ASCII metadata correctly; treat that one-time export diff as keyring normalization before suspecting trust-policy drift.
- If both keyring formats are present and no format is configured, Gradle prefers the binary `.gpg` keyring.
