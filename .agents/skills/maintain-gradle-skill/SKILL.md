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

## Maintenance References

- Read [references/guidance-runtime-curation.md](references/guidance-runtime-curation.md) before editing, reorganizing, or reviewing runtime Gradle skill content and topology.
- Read [references/guidance-source-indexes.md](references/guidance-source-indexes.md) whenever documentation or Gradle source materially calibrates runtime guidance.
- Read [references/guidance-version-calibration.md](references/guidance-version-calibration.md) before promoting current behavior, compatibility facts, or source-derived claims that may differ across releases or carrying components.
- Read [references/guidance-validation.md](references/guidance-validation.md) after every content, rename, merge, split, or delete batch and before reporting completion.

## Operating Loop

1. Audit `skills/gradle/SKILL.md` and `skills/gradle/references/*.md` for topology, owner boundaries, naming, length pressure, repeated content, orphan references, stale filenames, and runtime/maintenance leakage.
2. Read the runtime-curation reference before changing runtime guidance; when calibration is needed, also read the source-index and version-calibration references, choose one coherent upstream batch, and identify version boundaries before generalizing current evidence.
3. Read deeply enough to extract model boundaries, symptom maps, command recipes, safe APIs, version boundaries, and validation choices.
4. Re-evaluate the skill architecture after the batch; rename, merge, split, or delete references when routing becomes clearer.
5. Update the owning source-index files for every documentation URL or source path that materially calibrates changed runtime guidance.
6. Rewrite affected runtime files as concise owner guides, not pasted upstream notes or edit-history summaries.
7. Read the validation reference, run its gate, and report upstream topics read, files reshaped, durable rules added, version decisions, and remaining risks.

Complete at least one read -> refactor -> validate -> report loop before stopping, unless missing context, missing source docs, or a required user decision blocks the work.
