# Gradle Dependency Locking

Read this when: dependency lockfiles, `--write-locks`, `--update-locks`, dynamic versions, lock modes, or reproducible selected versions own the work.

## Locking Model

- Locking records selected versions, not declared preferences.
- Locks behave like strict constraints during resolution.
- Locking is most useful with dynamic selectors because it lets declarations stay flexible while builds stay reproducible.
- Do not use locking as the safety mechanism for changing modules such as `-SNAPSHOT`; their bytes can change under the same coordinates.
- Lockfiles are source policy and should be reviewed like dependency changes.
- Locking improves reproducibility but does not prove artifact trust; pair it with dependency verification for release-critical builds.

## Activation

- Locking only attaches to resolvable configurations; enabling it on declarable-only buckets is a no-op.
- Activate locking for the configurations whose selected versions must stay stable.
- Buildscript classpath locking is separate from project dependency locking.
- In multi-project builds, each project can have its own `gradle.lockfile`.
- The build must resolve a configuration before Gradle can create, update, or clean up its lock state.

## Commands

```bash
./gradlew <representative-task> --write-locks
./gradlew dependencies --configuration <configuration> --write-locks
./gradlew <representative-task> --update-locks <group:name>
./gradlew <representative-task> --update-locks <group:*>,*:guava
```

- Use representative tasks when `dependencies --write-locks` would miss subprojects, variants, platforms, or task-execution-time resolution.
- Gradle does not write lock state when the build fails.
- `dependencies --write-locks` resolves only configurations reached by that invocation.
- Prefer targeted `--update-locks` for routine upgrades.

## Resolution Behavior

- If the declared version is lower than the lock, Gradle can select the locked version.
- If the declared version is higher than the lock, resolution can fail because the lock is strict.
- Update lock state when selected versions intentionally change; do not expect declarations to override existing locks.
- New or removed dependencies can fail strict lock validation because the resolved graph no longer matches lock state.
- Lenient mode pins dynamic versions but allows graph additions/removals; use it for controlled exploration, not release defaults.
- Strict mode fails when a locked configuration lacks lock state.

## Review Rules

- Review direct and transitive changes separately.
- Treat new repositories, changing modules, dynamic selectors, and broad graph churn as higher risk.
- Ensure the command exercised every configuration whose lock state is meant to change.
- Pair lock diffs with `dependencies` or `dependencyInsight` output when the selected version changed unexpectedly.
- Pair lockfile updates with verification metadata updates when trust policy requires both.
- Do not delete lockfiles to make resolution pass unless the repository intentionally removed locking.

## Ignore And Cleanup Rules

- Avoid broad lock ignore patterns; they weaken reproducibility and can hide the dependency that should own the update workflow.
- Lock ignore rules are project scoped and do not remove transitive dependencies from lock state.
- To remove stale lock state, stop locking that configuration and run a command that resolves it while writing locks.
- Use separate lockfiles only for real execution-context boundaries, such as platform-specific native graphs.

## Source Calibration

Primary upstream page: Locking Dependency Versions.
