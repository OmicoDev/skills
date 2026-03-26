---
name: gradle
description: Guides Gradle work across wrapper, build scripts, settings scripts, dependencies, plugins, toolchains, performance, troubleshooting, and upgrade migrations using the Gradle documentation source tree. Use when the user asks about Gradle, gradlew, build.gradle(.kts), settings.gradle(.kts), gradle.properties, version catalogs, dependency resolution, plugin development, configuration cache, build cache, toolchains, or Gradle upgrades.
---

# Gradle

Use this skill for build authoring, debugging, dependency management, plugin development, performance tuning, and migrations in Gradle builds.

Bundled docs version: Gradle `9.4.1`.

## When not to use this skill

- Pure Maven-only work with no Gradle involvement.
- Application code issues that are clearly unrelated to build logic or build tooling.
- IDE-only problems unless the IDE behavior is tied to Gradle execution, Gradle JVM, or toolchains.

## Defaults

- Prefer the Gradle Wrapper (`./gradlew`, `gradlew.bat`) over a globally installed `gradle`.
- Match the project's existing DSL. If the project is new or mixed, prefer Kotlin DSL for new examples.
- Match the project's current layout before suggesting structural changes.
- Prefer lazy APIs and configuration avoidance (`tasks.register`, `configureEach`, `Property`, `Provider`) over eager configuration.
- Prefer Java toolchains over relying on `JAVA_HOME`, `sourceCompatibility`, or `targetCompatibility` alone.
- Surface deprecations early when debugging or upgrading.

## Quick workflow

1. Identify the workstream: wrapper, execution, scripts, dependencies, plugins, tasks, toolchains, performance, security, or migration.
2. Inspect the existing build files first: `settings.gradle(.kts)`, `build.gradle(.kts)`, `gradle.properties`, `libs.versions.toml`, and `gradle/wrapper/gradle-wrapper.properties`.
3. Start with the smallest wrapper-centric command that answers the question.
4. Prefer the bundled mirror in `references/userguide/` for in-repo source references.
5. Use the reference files below to find the right doc, command, or published page.

## References

- [references/doc-map.md](references/doc-map.md) - curated topic index plus triage, command playbook, topic-specific guidance, and usage examples.
- [references/remote-local-map.md](references/remote-local-map.md) - bundled `.adoc` paths mapped to official published HTML pages.
- [Gradle User Manual](https://docs.gradle.org/current/userguide/userguide.html) - official published docs for shareable remote links and live comparison.
