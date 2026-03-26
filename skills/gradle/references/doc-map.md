# Gradle doc map

This repository includes a bundled mirror of the Gradle userguide source under `skills/gradle/references/userguide/`.

All paths below are relative to that mirror root.

This file combines:

- a curated topic index for the bundled Gradle docs mirror
- a practical playbook for triage, commands, and topic-specific guidance

For the official published pages and the exact local `.adoc` to remote `.html` mapping, see [remote-local-map.md](remote-local-map.md).
The official entry page is [Gradle User Manual](https://docs.gradle.org/current/userguide/userguide.html).

## Fundamentals

- `fundamentals/running-builds/gradle_basics.adoc` - core Gradle concepts.
- `fundamentals/running-builds/build_file_basics.adoc` - `build.gradle(.kts)` basics.
- `fundamentals/running-builds/settings_file_basics.adoc` - `settings.gradle(.kts)` basics.
- `fundamentals/running-builds/command_line_interface_basics.adoc` - CLI basics.
- `fundamentals/running-builds/gradle_wrapper_basics.adoc` - wrapper basics.
- `fundamentals/authoring-builds/build_lifecycle_intermediate.adoc` - build phases and lifecycle.
- `fundamentals/authoring-builds/multi_project_builds_intermediate.adoc` - multi-project build structure.

## Execution and environment

- `reference/runtime-configuration/command_line_interface.adoc` - tasks, flags, diagnostics, execution options.
- `reference/runtime-configuration/gradle_wrapper.adoc` - wrapper setup, upgrade, checksum, private distribution URLs.
- `reference/runtime-configuration/build_environment.adoc` - `gradle.properties`, system properties, project properties.
- `reference/runtime-configuration/build_lifecycle.adoc` - configuration vs execution behavior.
- `reference/runtime-configuration/gradle_daemon.adoc` - daemon behavior and lifecycle.
- `reference/runtime-configuration/logging.adoc` - log levels and console output.
- `reference/runtime-configuration/continuous_builds.adoc` - `--continuous`.

## Dependencies and repositories

- `reference/dependency-management/getting_started_dep_man.adoc` - dependency management overview.
- `reference/dependency-management/declaring-dependencies/declaring_dependencies_basics.adoc` - dependency declarations.
- `reference/dependency-management/declaring-dependencies/declaring_configurations.adoc` - custom configurations.
- `reference/dependency-management/declaring-dependencies/viewing_debugging_dependencies.adoc` - `dependencies`, `dependencyInsight`, debugging.
- `reference/dependency-management/declaring-repositories/supported_repository_types.adoc` - repository types.
- `reference/dependency-management/declaring-repositories/filtering_repository_content.adoc` - repository content filters.
- `reference/dependency-management/centralizing-dependencies/version_catalogs.adoc` - version catalogs.
- `reference/dependency-management/centralizing-dependencies/platforms.adoc` - platforms and aligned versions.
- `reference/dependency-management/dependency-management/dependency_locking.adoc` - locking versions.
- `reference/dependency-management/dependency-management/dependency_caching.adoc` - dependency cache behavior.
- `reference/dependency-management/dependency-management/resolution_rules.adoc` - forcing or adjusting resolution.
- `reference/dependency-management/how-to/how_to_fix_version_catalog_problems.adoc` - version catalog troubleshooting.
- `reference/dependency-management/how-to/how_to_upgrade_transitive_dependencies.adoc` - transitive upgrades.
- `reference/dependency-management/how-to/how_to_downgrade_transitive_dependencies.adoc` - transitive downgrades.
- `reference/dependency-management/how-to/how_to_exclude_transitive_dependencies.adoc` - exclusions.
- `reference/dependency-management/advanced/graph_resolution.adoc` - how the dependency graph is selected.
- `reference/dependency-management/advanced/variant_aware_resolution.adoc` - variants and attributes.
- `reference/dependency-management/advanced/artifact_resolution.adoc` - resolved artifacts and files.

## Plugins and shared build logic

- `reference/plugin-development/plugins.adoc` - plugin types and scope.
- `reference/plugin-development/implementing_gradle_plugins_convention.adoc` - convention plugins.
- `reference/plugin-development/implementing_gradle_plugins_precompiled.adoc` - precompiled script plugins.
- `reference/plugin-development/implementing_gradle_plugins_binary.adoc` - binary plugins.
- `reference/plugin-development/testing_gradle_plugins.adoc` - plugin testing.
- `reference/plugin-development/preparing_to_publish.adoc` - pre-publish checks.
- `reference/plugin-development/publishing_gradle_plugins.adoc` - Plugin Portal publishing.
- `reference/plugin-development/reporting_problems.adoc` - Problems API for plugin authors.
- `fundamentals/developing-plugins/plugin_introduction_advanced.adoc` - plugin authoring overview.
- `fundamentals/developing-plugins/pre_compiled_script_plugin_advanced.adoc` - precompiled plugin fundamentals.

## Tasks and lazy configuration

- `reference/task-development/more_about_tasks.adoc` - task model and authoring.
- `reference/task-development/task_configuration_avoidance.adoc` - avoid unnecessary task realization.
- `reference/task-development/lazy_configuration.adoc` - `Property` and `Provider` APIs.
- `reference/task-development/implementing_custom_tasks.adoc` - custom task implementation.
- `reference/task-development/custom_tasks.adoc` - advanced task behavior.
- `reference/task-development/controlling_task_execution.adoc` - task execution rules.
- `reference/task-development/build_services.adoc` - shared build services.
- `reference/best-practices/best_practices_tasks.adoc` - task-specific best practices.

## JVM and toolchains

- `reference/platforms/jvm/toolchains.adoc` - toolchains, auto-detection, provisioning, precedence.
- `reference/platforms/jvm/java_plugin.adoc` - Java plugin behavior.
- `reference/platforms/jvm/java_library_plugin.adoc` - Java library plugin.
- `reference/platforms/jvm/application_plugin.adoc` - application plugin.
- `reference/platforms/jvm/java_testing.adoc` - JVM test behavior.
- `reference/platforms/jvm/jvm_test_suite_plugin.adoc` - JVM test suites.

## Performance and caching

- `optimizing-builds/performance.adoc` - performance overview.
- `optimizing-builds/configuration-cache/configuration_cache.adoc` - configuration cache overview.
- `optimizing-builds/configuration-cache/configuration_cache_enabling.adoc` - enable and configure configuration cache.
- `optimizing-builds/configuration-cache/configuration_cache_requirements.adoc` - requirements for build logic.
- `optimizing-builds/configuration-cache/configuration_cache_debugging.adoc` - configuration cache debugging.
- `optimizing-builds/build-cache/build_cache.adoc` - build cache overview.
- `optimizing-builds/build-cache/build_cache_debugging.adoc` - diagnose cache misses.
- `optimizing-builds/build-cache/common_caching_problems.adoc` - common cache problems.
- `reference/best-practices/best_practices_performance.adoc` - performance best practices.

## Security and verification

- `securing-builds/security.adoc` - secure build practices.
- `securing-builds/dependency_verification.adoc` - dependency verification workflow.
- `reference/best-practices/best_practices_security.adoc` - security best practices.

## Upgrades and migrations

- `releases/compatibility.adoc` - compatibility matrix for Gradle and Java.
- `releases/feature_lifecycle.adoc` - incubating, deprecated, and removed features.
- `releases/upgrading/upgrading_major_version_9.adoc` - migration to Gradle 9.
- `releases/upgrading/upgrading_version_9.adoc` - Gradle 9.x upgrade notes.
- `releases/upgrading/upgrading_version_8.adoc` - Gradle 8.x upgrade notes.
- `releases/upgrading/upgrading_version_7.adoc` - 7.x to 8.0 migration notes.
- `releases/upgrading/upgrading_version_6.adoc` - 6.x to 7.0 migration notes.
- `releases/migrating/migrating_from_maven.adoc` - Maven migration.
- `releases/migrating/migrating_from_ant.adoc` - Ant migration.

## Fast lookup suggestions

- Wrapper or `gradlew` questions: start with `reference/runtime-configuration/gradle_wrapper.adoc`.
- Task flags or command syntax: start with `reference/runtime-configuration/command_line_interface.adoc`.
- Dependency conflicts: start with `reference/dependency-management/declaring-dependencies/viewing_debugging_dependencies.adoc`.
- Version catalogs: start with `reference/dependency-management/centralizing-dependencies/version_catalogs.adoc`.
- Convention plugins: start with `reference/plugin-development/implementing_gradle_plugins_convention.adoc`.
- Lazy APIs: start with `reference/task-development/lazy_configuration.adoc`.
- Toolchain or JDK issues: start with `reference/platforms/jvm/toolchains.adoc`.
- Configuration cache failures: start with `optimizing-builds/configuration-cache/configuration_cache_debugging.adoc`.
- Upgrade warnings: start with `releases/upgrading/upgrading_major_version_9.adoc` or the matching current version guide.

## Triage

1. Identify the workstream:
   - bootstrap or wrapper
   - build execution or CLI
   - build scripts or settings
   - dependencies or repositories
   - plugins or shared build logic
   - task authoring
   - JVM or toolchains
   - performance or caching
   - security or verification
   - upgrade or migration
2. Inspect the existing build files first:
   - `settings.gradle(.kts)`
   - `build.gradle(.kts)`
   - `gradle.properties`
   - `libs.versions.toml`
   - `gradle/wrapper/gradle-wrapper.properties`
3. Use the wrapper-centric command that answers the question with the smallest blast radius.
4. Cite the relevant Gradle concept and doc path when it affects behavior or trade-offs.

## Command playbook

Use these commands as starting points and then narrow down.

Build discovery:

```bash
./gradlew tasks --all
./gradlew projects
./gradlew help --task <task>
./gradlew properties
```

Dependencies:

```bash
./gradlew dependencies
./gradlew dependencyInsight --dependency <module-or-fragment> --configuration <configuration>
./gradlew buildEnvironment
```

Toolchains and environment:

```bash
./gradlew -q javaToolchains
./gradlew --version
```

Diagnostics and upgrades:

```bash
./gradlew help --warning-mode=all
./gradlew help --scan
./gradlew wrapper --gradle-version <target-version>
```

Performance experiments:

```bash
./gradlew <task> --scan
./gradlew <task> --configuration-cache
./gradlew <task> --build-cache
./gradlew <task> --profile
```

Bootstrap a brand-new build only when no wrapper exists yet:

```bash
gradle init
gradle wrapper
```

## Guidance by topic

### Wrapper and execution

- Use `./gradlew` unless the task is generating the wrapper for a brand-new build.
- Prefer updating the wrapper with the `wrapper` task instead of manually editing `distributionUrl`.
- When explaining wrapper changes, mention version pinning, reproducibility, and checksum or validation options if security matters.

### Build scripts and shared build logic

- Keep examples in the same DSL as the project.
- For repeated conventions across subprojects, prefer convention plugins or precompiled script plugins over duplicating logic.
- When creating new task or extension APIs, model inputs and outputs with lazy properties and providers.

### Dependencies

- Separate repository problems, declaration problems, and resolution problems.
- Use `dependencyInsight` for one module or one conflict instead of reading the full tree first.
- Prefer version catalogs, platforms, constraints, and locking when the user wants consistency or controlled upgrades.
- If the issue is unexpected resolution or variant selection, consult the advanced dependency docs before changing code.

### Plugins and task authoring

- Distinguish between script plugins, precompiled script plugins, convention plugins, and binary plugins.
- Avoid script plugins for long-lived production build logic when a reusable plugin is more appropriate.
- For custom tasks, prefer configuration avoidance and explicit input or output modeling.

### JVM and toolchains

- Prefer `java { toolchain { languageVersion = ... } }` for reproducible JVM builds.
- Use `options.release` when strict API compatibility matters.
- If toolchain resolution behaves unexpectedly, inspect `javaToolchains` output and relevant Gradle properties before changing code.

### Performance

- Start with `--scan` or configuration-cache diagnostics before speculative refactors.
- Consider configuration cache, build cache, parallel execution, and file system watching separately; they solve different problems.
- When performance advice changes build logic, call out compatibility risks for custom plugins and task code.

### Upgrades and migrations

- Surface deprecations first, then plugin compatibility, then wrapper upgrade steps.
- Prefer fixing one class of warning at a time instead of rewriting large areas blindly.
- Call out Gradle major-version migration notes explicitly when you see APIs scheduled for removal.

## Output expectations

- Give an actionable answer, not a doc dump.
- Include the minimal commands or edits needed to validate the change.
- When suggesting a build-script change, explain why the Gradle model prefers it.
- Mention relevant compatibility or migration risks when recommending newer APIs.

## Examples

- "Why does `./gradlew dependencyInsight` show a different version than I declared?" -> inspect dependency resolution docs, then explain constraints, conflict resolution, or variants.
- "Please migrate this build from Gradle 8 to 9." -> check deprecations, plugin compatibility, wrapper upgrade, then apply targeted fixes.
- "Help me write a reusable plugin for shared JVM conventions." -> prefer convention or precompiled script plugins, then consult plugin-development docs.
- "Why is configuration cache failing?" -> collect the exact failure, inspect configuration-cache docs, and trace eager access or unsupported APIs.
