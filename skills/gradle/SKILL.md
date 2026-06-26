---
name: gradle
description: Gradle development knowledge for agents maintaining builds, build logic, plugins, tasks, dependencies, JVM toolchains, caches, publishing, CI, security, and upgrades. Use when working with Gradle, gradlew, build.gradle(.kts), settings.gradle(.kts), gradle.properties, init.gradle(.kts), libs.versions.toml, dependencies/dependencyInsight reports, dependency locking or verification, Gradle plugins/tasks, TestKit, Java toolchains, Maven/Ant migration, or wrapper upgrades.
---

# Gradle

Use this skill when Gradle owns the work: build authoring, debugging, dependency resolution, plugin/task development, performance, CI/security, ecosystem integration, or migrations.

Calibrated from the local Gradle User Manual source tree. Do not vendor upstream pages into this skill; improve the references when repeated Gradle development work needs durable knowledge.

## When Not To Use This Skill

- Pure Maven-only work with no Gradle involvement.
- Application code issues that are clearly unrelated to build logic or build tooling.
- IDE-only problems unless the IDE behavior is tied to Gradle execution, Gradle JVM, toolchains, or Gradle import.

## Defaults

- Use the Gradle Wrapper (`./gradlew`, `gradlew.bat`) unless creating a wrapper for a new project.
- Read `gradle/wrapper/gradle-wrapper.properties` before relying on version-sensitive behavior.
- Match the repository's DSL, project layout, plugin style, and CI entrypoints before changing examples.
- Prefer lazy APIs and configuration avoidance: `tasks.register`, `tasks.named`, `configureEach`, `Property`, `Provider`, `DirectoryProperty`, and `RegularFileProperty`.
- Prefer Java toolchains over ambient `JAVA_HOME`, `sourceCompatibility`, or `targetCompatibility` alone.
- Treat build logic as production code: keep changes small, model inputs/outputs, and verify with wrapper commands.

## Workflow

1. Classify the task by nearest owner surface.
2. Inspect relevant files: wrapper properties, settings, build scripts, `gradle.properties`, catalogs, build logic, included builds, lock/verification metadata, and CI files.
3. Read one first-hop owner reference below. Read a second only when repository evidence crosses owner boundaries.
4. Run or suggest the narrowest wrapper command that proves the owner.
5. Explain the Gradle model behind the change so the build remains maintainable.

## First-Hop Owner References

Keep this list coarse. Add narrow references from their owning file, not from `SKILL.md`.

- Read [references/model-boundaries.md](references/model-boundaries.md) when the owner is unclear or the task turns on Gradle model boundaries.
- Read [references/commands-and-evidence.md](references/commands-and-evidence.md) when choosing commands, flags, logs, reports, or failure evidence.
- Read [references/runtime-and-structure.md](references/runtime-and-structure.md) when wrapper files, Gradle runtime, init scripts, settings, topology, build logic placement, or layout is the owner.
- Read [references/scripts-and-conventions.md](references/scripts-and-conventions.md) when editing build scripts or reusable build logic.
- Read [references/dependency-policy.md](references/dependency-policy.md) when dependency declarations, configuration roles, catalogs, platforms, version policy, or selected versions are the main surface.
- Read [references/plugins-services-and-diagnostics.md](references/plugins-services-and-diagnostics.md) when plugin shape, shared services, lifecycle-result work, Problems API diagnostics, TestKit, or task public surface is the owner.
- Read [references/performance-strategy.md](references/performance-strategy.md) when improving build speed, task avoidance, configuration cache, build cache, incremental behavior, or isolated projects.
- Read [references/ci-and-security.md](references/ci-and-security.md) when publishing, CI execution, credentials, dependency verification, or wrapper security is the owner.
- Read [references/ecosystem-integrations.md](references/ecosystem-integrations.md) when Gradle coordinates Android, native, frontend, IDE, Tooling API, Maven/Ant, or external tools.
- Read [references/upgrade-strategy.md](references/upgrade-strategy.md) when changing Gradle versions, handling deprecations, or migrating build systems.

## Source Use

- Use the local Gradle source tree for calibration when available.
- Use [Gradle User Manual](https://docs.gradle.org/current/userguide/userguide.html) links for shareable citations.
- Prefer concise model rules, symptom maps, command recipes, and safe code patterns over upstream excerpts.
