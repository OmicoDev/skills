# Gradle Source Control Dependencies

Read this when: `sourceControl`, `gitRepository`, `vcsMappings`, `GitVersionControlSpec`, source dependencies, Git-backed module replacement, or `.gradle/vcs-1` checkout cache behavior owns dependency resolution.

## Scope Boundary

- Source control dependencies are settings-owned dependency mappings from external module coordinates to a Git-backed Gradle build.
- They are not Maven/Ivy repositories, not `repositories {}` entries, and not ordinary included builds visible through `gradle.includedBuilds`.
- Prefer composite builds for active local fork development; use `sourceControl` when resolution should select source from a Git repository by module identity and requested version or branch.
- Dependency locking does not lock source dependencies; reproducibility depends on stable mappings, tags, branch policy, and the repository's own build metadata.

## Declaration Model

- Declare source control in `settings.gradle(.kts)`, because it changes dependency resolution for the build tree.
- On Gradle 4.10+, use `sourceControl { gitRepository(uri).producesModule("group:module") }` for a direct repository-to-module mapping.
- Use `sourceControl.vcsMappings.withModule("group:module") { from(GitVersionControlSpec) { url = uri(...) } }` for exact-module mapping and `vcsMappings.all { details -> ... }` when the rule derives a repository from requested group or module data.
- `producesModule` names only `group:name`. The requested version or branch first selects a Git ref; Gradle then locates a checked-out project with matching `group` and name and resolves that project's declared version and outgoing variants. The project version does not need to equal the tag or branch name. In Gradle 9.8.1, mapping one project does not automatically map all sibling modules; declare each external module that must resolve from source, while project dependencies within that build still work.
- Set the repository `rootDir` only when the Gradle build root is below the Git repository root.
- In Gradle 9.8.1, a matching root-build mapping takes precedence over nested-build mappings; without one, conflicting nested repository mappings fail. Root rules run in registration order, and a later `from(...)` replaces an earlier result; `withModule` is a filter, not a specificity priority.

## Version Selection

- In Gradle 9.8.1, static versions and metadata-free dynamic selectors such as `1.+` or version ranges select Git tags. A static string such as `master`, `release`, or `HEAD` searches for that tag, not the branch or symbolic ref. Metadata-dependent selectors such as `latest.release` cannot select a source version.
- Use `versionConstraint.branch = "<branch>"` for a branch selector.
- In Gradle 9.8.1, `latest.integration` selects `refs/heads/master`, regardless of the remote default branch. For a repository that only exposes `main`, use `versionConstraint.branch = "main"`.
- A missing tag or branch reports the Git repository as the searched location, so fix refs or selectors before changing Maven/Ivy repositories.

## Checkout Cache

- Gradle stores source dependency working trees under the project cache directory, keyed by repository identity and selected revision. The default location is the root build's `.gradle/vcs-1`; `--project-cache-dir` relocates it.
- In Gradle 9.8.1, populating an existing checkout hard-resets tracked files and local commits to the selected revision; it does not clean unrelated untracked files. Population is reused within an invocation, and a configuration-cache hit need not populate it again. Do not edit cached checkouts as workspaces.
- In Gradle 9.8.1, initial cloning includes submodules before the parent is reset to the selected revision; do not assume that this also realigns submodules to a historical parent revision. Reusing a populated checkout fetches, updates and hard-resets existing submodules recursively; it does not initialize a submodule whose local repository is absent.
- In Gradle 9.8.1, `--offline` needs a persistent selection for the repository plus requested branch or required-version string, then populates that saved revision. A checkout alone does not satisfy a new selector. Missing checkout contents can trigger cloning, and existing submodule reuse still fetches; do not treat this resolver as a guarantee of no Git network access.
- Unused VCS checkouts are garbage-collected by the VCS checkout cache; removing `sourceControl` mappings does not make old checkouts part of normal dependency cache retention.

## Configuration Cache

- Through Gradle 9.6.1, source-control mappings silently disable configuration-cache storage. Gradle 9.7+ can store source dependency builds as implicit included builds and restore them from the configuration cache.
- On Gradle 9.7+, a static source dependency selector can reuse the configuration-cache entry. Changes to settings-owned `vcsMappings` still invalidate the entry as ordinary configuration inputs.
- On Gradle 9.7+, successful online resolution of branch selectors, version ranges, other dynamic selectors, and `latest.integration` records a zero-TTL configuration input, so the stored configuration-cache entry expires even if the selected commit has not moved. `ResolutionStrategy.cacheDynamicVersionsFor(...)` does not change this source dependency expiry. Offline resolution uses the saved selection instead of this online listener path.

## Diagnostics

```bash
./gradlew dependencyInsight --dependency <group:name> --configuration <configuration>
./gradlew <task> --info
./gradlew <task> --offline
```

- If resolution cannot find a version, compare the requested selector with Git tags and branch refs. If checkout succeeds but Gradle says the repository did not publish the dependency, compare the mapped `group:name` with the checked-out projects; inspect the project version separately when the resolved graph reports an unexpected version.
- If the checked-out source build is invisible through `gradle.includedBuilds`, that is expected; diagnose it as a source dependency build, not a composite include.
- In Gradle 9.8.1, a source dependency build cannot define `includeBuild`; move that topology to an explicit composite build when it is required.
- If a tracked-file edit inside the VCS checkout cache (by default `.gradle/vcs-1`) disappears when Gradle populates the checkout, diagnose checkout reset behavior.
