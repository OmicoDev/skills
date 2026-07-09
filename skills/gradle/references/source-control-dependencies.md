# Gradle Source Control Dependencies

Read this when: `sourceControl`, `gitRepository`, `vcsMappings`, `GitVersionControlSpec`, source dependencies, Git-backed module replacement, or `.gradle/vcs-1` checkout cache behavior owns dependency resolution.

## Scope Boundary

- Source control dependencies are settings-owned dependency mappings from external module coordinates to a Git-backed Gradle build.
- They are not Maven/Ivy repositories, not `repositories {}` entries, and not ordinary included builds visible through `gradle.includedBuilds`.
- Prefer composite builds for active local fork development; use `sourceControl` when resolution should select source from a Git repository by module identity and requested version or branch.
- Dependency locking does not lock source dependencies; reproducibility depends on stable mappings, tags, branch policy, and the repository's own build metadata.

## Declaration Model

- Declare source control in `settings.gradle(.kts)`, because it changes dependency resolution for the build tree.
- Use `sourceControl { gitRepository(uri).producesModule("group:module") }` for a direct repository-to-module mapping.
- Use `sourceControl.vcsMappings.withModule("group:module") { from(GitVersionControlSpec) { url = uri(...) } }` for exact-module mapping and `vcsMappings.all { details -> ... }` when the rule derives a repository from requested group or module data.
- `producesModule` names only `group:name`; the requested version is matched against Git refs and the checked-out build's own `group`, `name`, version, and outgoing variants.
- Set the repository `rootDir` only when the Gradle build root is below the Git repository root.
- Root-build source-control mappings can disambiguate conflicting mappings contributed by nested source dependency builds.

## Version Selection

- Static versions, dynamic versions, and version ranges select Git tags; branch names such as `master`, `release`, or `HEAD` are not static version strings.
- Use `versionConstraint.branch = "<branch>"` for a branch selector.
- `latest.integration` asks Gradle's Git source dependency resolver for its default branch, which currently resolves `refs/heads/master`; for repositories that only expose `main`, use `versionConstraint.branch = "main"` or inspect resolver behavior before adding binary repositories.
- A missing tag or branch reports the Git repository as the searched location, so fix refs or selectors before changing Maven/Ivy repositories.

## Checkout Cache

- Gradle stores source dependency working trees under the build tree's `.gradle/vcs-1` cache, keyed by repository identity and selected revision.
- Existing source dependency working trees are reused but hard-reset to the selected revision; do not edit them as workspaces.
- Git submodules are cloned, fetched, updated, and reset recursively when the source dependency is populated or reused.
- `--offline` can use a previously resolved checkout, but it fails when the requested source dependency has no cached working tree.
- Unused VCS checkouts are garbage-collected by the VCS checkout cache; removing `sourceControl` mappings does not make old checkouts part of normal dependency cache retention.

## Diagnostics

```bash
./gradlew dependencyInsight --dependency <group:name> --configuration <configuration>
./gradlew <task> --info
./gradlew <task> --offline
```

- If resolution cannot find a version, compare requested selector, tags, branch selectors, and the source build's declared version before changing repositories.
- If the checked-out source build is invisible through `gradle.includedBuilds`, that is expected; diagnose it as a source dependency build, not a composite include.
- If a source dependency build tries to define included builds, route to source dependency limitations before refactoring ordinary composite build topology.
- If an external edit inside `.gradle/vcs-1` disappears on the next build, treat that as checkout reset behavior rather than a task or file-watching bug.
