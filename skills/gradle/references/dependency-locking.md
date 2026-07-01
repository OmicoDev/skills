# Gradle Dependency Locking

Read this when: dependency lockfiles, `--write-locks`, `--update-locks`, dynamic versions, lock modes, or reproducible selected versions own the work.

## Locking Model

- Locking records selected versions, not declared preferences.
- Locks behave like strict constraints during resolution.
- Locking is most useful with dynamic selectors because it lets declarations stay flexible while selected versions and task inputs stay reproducible.
- Do not use locking as the safety mechanism for changing modules such as `-SNAPSHOT`; their bytes can change under the same coordinates, and Gradle warning while persisting lock state is a modeling signal rather than something to ignore.
- Lockfiles are source policy and should be reviewed like dependency changes.
- Locking improves reproducibility but does not prove artifact trust; pair it with dependency verification for release-critical builds.
- Initial lock generation freezes the versions Gradle already selected; inspect optimistic conflict upgrades before writing locks or you may preserve the wrong baseline.
- Use constraints, platforms, or rich versions to express intended compatibility policy before relying on locks to make the selected graph reproducible.

## Activation

- Locking only attaches to resolvable configurations; enabling it on declarable-only buckets is a no-op.
- Activate locking for the configurations whose selected versions must stay stable.
- `lockAllConfigurations()` covers project configurations, not buildscript classpaths.
- If a convention or plugin enables locking broadly, disable locking on intentionally volatile configurations instead of papering over them with ignored modules.
- Buildscript classpath locking is separate from project dependency locking; strict mode and custom lock files do not leak between them.
- Use `resolutionStrategy.deactivateDependencyLocking()` or `dependencyLocking.unlockAllConfigurations()` when a resolvable configuration should stay unlocked after broad activation; deleting lock entries alone does not change the locking policy.
- Configuration inheritance does not inherit locking policy: resolving an unlocked child ignores a locked parent's lock state, while a locked child locks inherited dependencies.
- Decide locking activation, deactivation, lock mode, custom lockfile, ignored dependencies, dependencies, hierarchy, and resolution strategy before a configuration is observed or resolved; Gradle finalizes lock options when lock state is first used, so do not hide locking changes in `incoming.beforeResolve { ... }`.
- In multi-project builds, each project can have its own `gradle.lockfile`.
- A project dependency's lockfile does not constrain the consuming project; the consumer's own locked configuration can lock external modules reached transitively through that project dependency.
- The build must resolve a configuration before Gradle can create, update, or clean up its lock state.

## Lock State Files

- The default lock state is `gradle.lockfile` in each project or subproject directory.
- Buildscript classpath locks use `buildscript-gradle.lockfile`.
- Lock entries are sorted and record which configurations contain each module; an `empty=` entry preserves locked configurations with no dependencies.
- Gradle 9.5+ writes lockfiles with LF line endings on every platform; a one-time CRLF-to-LF diff after lock regeneration is formatting churn, not dependency churn.
- Custom lockfile names or locations are for real execution-context boundaries, such as platform-specific native graphs, not for hiding unrelated lock churn.
- If you customize `dependencyLocking.lockFile`, keep the file unique per project and separate from buildscript lock state; shared lock paths mix cleanup, update, and review ownership.
- Legacy per-configuration lockfiles can migrate incrementally: writing the new per-project lockfile transfers resolved configurations and deletes only the old state that was transferred.
- Malformed lockfiles fail lock-state loading before dependency selection; repair the `group:name:version` entries and configuration mappings before changing repositories or declarations.

## Commands

```bash
./gradlew <representative-task> --write-locks
./gradlew dependencies --configuration <configuration> --write-locks
./gradlew <representative-task> --update-locks <group:name>
./gradlew <representative-task> --update-locks <group:*>,*:guava
```

- Use representative tasks when `dependencies --write-locks` would miss subprojects, variants, platforms, or task-execution-time resolution.
- Before the first `--write-locks`, run `dependencies` or `dependencyInsight` on representative configurations to confirm selected versions and conflict reasons.
- Gradle does not write lock state when the build fails.
- `--write-locks` overwrites lock state for configurations resolved in that invocation; unchanged or unvisited configurations keep their existing lock state.
- `dependencies --write-locks` resolves only configurations reached by that invocation.
- Prefer targeted `--update-locks` for routine upgrades.
- `--update-locks` implies `--write-locks`; treat it as a lock-state update command, not as read-only dependency selection.
- In strict mode, bootstrap missing lock state with `--write-locks` before targeted `--update-locks`; update commands still fail when a locked configuration has no lock state.
- `--update-locks` accepts comma-separated module notations; wildcards may stand alone or appear at the end of the group or module name.
- `--update-locks` still loads existing lock state, but filters out the targeted modules for that resolution; non-targeted locked modules continue to constrain selection.
- Targeted lock updates still run normal resolution, so aligned platforms, constraints, conflicts, or transitive edges can update related modules too.
- If a root `dependencies` run misses subprojects or variants, use a purpose-built lock task that filters resolvable configurations instead of resolving every possible platform-specific graph blindly.

## Resolution Behavior

- If the declared version is lower than the lock, Gradle can select the locked version.
- If the declared version is higher than the lock, resolution can fail because the lock is strict.
- Update lock state when selected versions intentionally change; do not expect declarations to override existing locks.
- Default mode requires every existing lock entry to match the resolved graph and rejects extra resolved dependencies.
- New or removed dependencies can fail default lock validation because the resolved graph no longer matches lock state.
- Strict mode also fails when a locked configuration has no associated lock state.
- Lenient mode pins dynamic versions but can allow version shifts and graph additions/removals; use it for controlled exploration, not release defaults.
- Locking constrains modules that remain in the resolved graph; it does not resurrect excluded modules, and it skips versionless dependencies and included-build substitutions when producing or loading lock state.
- If a force, dependency substitution, or `eachDependency` rule selects a different version from the lock, treat the failure as a lock-policy conflict and update the rule or lock together.
- Locking does not apply to source dependencies.
- Do not combine dependency locking with `failOnDynamicVersions()` or `failOnChangingVersions()` on the same configuration; choose locking to preserve selected dynamic/changing results, or choose fail-fast resolution to reject those selectors before lock state is relevant.

## Review Rules

- Review direct and transitive changes separately.
- Treat new repositories, changing modules, dynamic selectors, and broad graph churn as higher risk.
- Ensure the command exercised every configuration whose lock state is meant to change.
- Pair lock diffs with `dependencies` or `dependencyInsight` output when the selected version changed unexpectedly.
- Pair lockfile updates with verification metadata updates when trust policy requires both.
- If locking is introduced to prevent accidental upgrades, first prove whether `failOnVersionConflict()`, a strict constraint, or a platform should own the policy; locking should then preserve the accepted selected graph.
- When publishing a library whose lock state intentionally fixes dynamic or rich-version selections, review [publications-and-signing.md](publications-and-signing.md) and configure `versionMapping` so resolved versions are published deliberately.
- Do not delete lockfiles to make resolution pass unless the repository intentionally removed locking.

## Ignore And Cleanup Rules

- Avoid broad lock ignore patterns; they weaken reproducibility and can hide the dependency that should own the update workflow.
- `*:*` is not accepted as an ignore pattern because it effectively disables locking.
- Lock ignore rules are project scoped and do not remove transitive dependencies from lock state.
- Ignored modules are filtered out when reading, validating, and writing lock state, and Gradle does not verify that they appear in any resolved configuration.
- Ignored changing modules are filtered before the changing-module warning too; do not treat quiet `--write-locks` output as proof that a SNAPSHOT or changing dependency is reproducible.
- To remove stale lock state, stop locking that configuration and run a command that resolves it while writing locks; Gradle cannot clean a configuration's lock state if that configuration is not visited.
