---
name: maintain-gradle-skill
description: Maintain the repository's Gradle agent skill artifact. Use when updating, calibrating, auditing, reorganizing, validating, or source-indexing `skills/gradle/**`, including Gradle skill runtime guidance, Gradle source/documentation calibration, compatibility snapshots, reference topology, validation gates, or maintenance scripts. Do not use for ordinary Gradle build troubleshooting in user projects.
---

# Maintain Gradle Skill

Use this skill only when maintaining the Gradle skill artifact in this repository. For ordinary user-project Gradle troubleshooting, use the runtime `gradle` skill instead.

## Surfaces

- Runtime surface: `skills/gradle/**`. This is what future agents load while solving Gradle tasks.
- Maintenance surface: this skill directory. It owns curation rules, source indexes, maintenance scripts, calibration policy, and validation gates.
- Current-turn surface: conversation notes, temporary source-reading logs, one-off preferences, audit breadcrumbs, local paths, and edit rationale that are not durable skill behavior.

## Operating Loop

1. Audit `skills/gradle/SKILL.md` and `skills/gradle/references/*.md` for topology, owner boundaries, naming, length pressure, repeated content, orphan references, stale filenames, and runtime/maintenance leakage.
2. Choose one coherent upstream Gradle documentation or source batch when calibration is needed.
3. Read deeply enough to extract model boundaries, symptom maps, command recipes, safe APIs, and validation choices.
4. Re-evaluate the skill architecture after the batch; rename, merge, split, or delete references when routing becomes clearer.
5. Update the owning source-index files for every documentation URL or source path that materially calibrates changed runtime guidance.
6. Rewrite affected runtime files as concise owner guides, not pasted upstream notes or edit-history summaries.
7. Run the validation gate and report upstream topics read, files reshaped, durable rules added, and remaining risks.

Complete at least one read -> refactor -> validate -> report loop before stopping, unless missing context, missing source docs, or a required user decision blocks the work.

## Runtime Content Gate

- Add runtime guidance only when it helps a future agent decide what to do in a user's Gradle project before acting.
- Preserve middle-layer operating knowledge: owner selection, symptom maps, narrow commands and reports, safe APIs and model boundaries, lazy/cacheable/reproducible changes, and owner-appropriate validation.
- Prefer model boundaries, symptom maps, command recipes, owner-selection rules, and safe Gradle patterns over tutorials, broad essays, copied upstream prose, copied examples, release-note archives, or upstream page catalogs.
- Rewrite local Gradle checkout evidence as portable Gradle model rules, official documentation links, or versioned compatibility facts. Never mention maintainer-local checkout paths, private branches, unavailable source-tree filenames, local notes, or provenance labels in runtime files.
- Use official Gradle links in runtime text only when they help a future task cite or verify a Gradle fact, not to record where a maintainer learned it.

## Placement Rules

- Put ordinary task guidance in `skills/gradle/**`.
- Put curation process, calibration method, source-index format, upstream batch selection, vendoring bans, local checkout handling, topology rules, validation gates, and historical cleanup rules in this skill.
- Put current-turn notes and raw source-reading logs in the conversation, owning issue, or maintenance report.
- Keep one-off preferences out of runtime files; promote only rules that protect against a realistic recurring failure mode.
- Do not narrate a runtime file's creation, calibration, source gathering, maintainer action, local evidence, or edit history.

## Runtime Topology

- Treat `skills/gradle/SKILL.md` as the first-hop classifier: broad, stable, under 500 lines, and under the skill-creator recommended instruction budget when practical.
- Treat each `skills/gradle/references/*.md` file as a full-load, on-demand resource. Keep references one level deep; avoid nested route trees, second-level routers, and thin shards that force multi-file reads for one decision.
- Organize runtime references by decision owner: model boundaries, command evidence, runtime/structure, script authoring, dependencies, plugins/tasks/services, performance/cache, publishing/CI/security, ecosystem interop, and upgrades/migrations.
- Keep routes visible in filenames, H1s, and `Read this when: ...` sentences. Put narrow checklists, diagnostics, and subtopic rules in the owning reference, not in `SKILL.md`.
- Treat 100 lines as a warning threshold and 120 lines as a hard maximum. Before adding to a long reference, shrink, redistribute, or justify why the owner must stay intact.
- Compress before splitting: delete duplicate rules, replace explanations with decision bullets, move volatile version facts into the owning snapshot file, and split only when a future task can choose the new file directly.
- Merge sibling leaves that describe the same decision, diagnostic path, workflow, policy surface, or model boundary. Remove duplicated wording after merges.

## Source Indexes

- Keep source provenance under `references/source-index-<runtime-reference-file>.md`.
- Name each source-index file after the runtime reference it calibrates with the `source-index-` prefix, and start it with the same H1 as the owning runtime reference.
- Put documentation links under `## Documentation` and code-source links under `## Source Code`.
- Use one bullet per durable documentation entry: `- [Official title](public URL)`.
- Use one bullet per durable code-source entry with the Gradle checkout's repository-relative path.
- When reading `https://docs.gradle.org/**` and changing a runtime file because of it, update the owning source-index file in the same change with each materially used page title and URL.
- Sort documentation entries by normalized title and source-code entries lexicographically by repository-relative path. Use `node scripts/sort-reference-sections.mjs --check` from this skill directory to verify sorting, the `source-index-` prefix, and the runtime reference target for every source-index file.
- Omit `## Source Code` when no code source file materially calibrates the runtime reference.
- Do not create a source-index entry for every page skimmed; include only sources that materially calibrate the runtime reference.
- Current Gradle code-source path calibration baseline is Gradle version `9.6.1`; update this baseline when regenerating source-code paths from a different Gradle version.

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

## Validation Gate

After each delete, merge, rename, or content batch, report inventory and failures:

- Inventory: reference count, total words, total lines, maximum reference length in lines, the longest references by line count, and every reference at or above 100 lines.
- Shape failures: references that do not start with an H1, references with more than one H1, references missing the `Read this when: ...` scope sentence, and references over 120 lines.
- Link and topology failures: broken internal Markdown links and orphaned references, where an orphan is any `skills/gradle/references/*.md` file not reachable from `skills/gradle/SKILL.md` through Markdown links.
- Rename/delete failures: residual mentions of renamed or deleted filenames.
- Source-index failures: missing source-index entries for documentation URLs or source paths that materially calibrated runtime changes in the batch.
- Surface failures: runtime files that contain maintenance provenance, raw calibration notes, machine-local paths, upstream reading logs, or artifact-history phrasing instead of portable Gradle task guidance.
- Markdown policy failures for the edited surface.

Run the source-index check from this skill directory before reporting completion:

```bash
node scripts/sort-reference-sections.mjs --check
```

Apply the repository formatting and Markdown lint rules from `AGENTS.md` to the edited files.
