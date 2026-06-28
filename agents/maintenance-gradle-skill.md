# Gradle Skill Agent Rules

Read this when maintaining the Gradle skill.

This governs the Gradle skill as a skill artifact. In this file, runtime surface means `skills/gradle/**`, and maintenance surface means this file. Do not load it for ordinary Gradle build troubleshooting.

## Purpose

The Gradle skill helps future agents classify, diagnose, and safely modify Gradle builds, build logic, plugins, tasks, dependency policy, CI, publishing, and upgrade paths. Preserve middle-layer operating knowledge: owner selection, symptom maps, narrow commands and reports, safe APIs and model boundaries, lazy/cacheable/reproducible changes, and owner-appropriate validation.

Do not turn the skill into a Gradle tutorial, User Manual mirror, release-note archive, generated source index, or broad upstream page catalog.

## Placement Rules

- Put guidance in the runtime surface only when an agent solving an ordinary Gradle task would need it before acting.
- Put curation process, calibration method, upstream batch selection, vendoring bans, local checkout handling, topology rules, validation gates, and historical cleanup rules in the maintenance surface.
- Keep current-turn notes, raw source-reading logs, one-off preferences, audit breadcrumbs, local paths, and edit rationale in the current conversation, owning issue, or maintenance report.
- Before adding runtime text, ask: "Would this help a future agent decide what to do in a user's Gradle project?" If no, do not put it in the runtime surface.
- Do not narrate a runtime file's creation, calibration, source gathering, maintainer action, local evidence, or edit history. Rewrite the reusable Gradle rule, source-use behavior, or compatibility fact instead.
- Use official Gradle links in runtime text only when they help a future task cite or verify a Gradle fact, not as a record of where a maintainer learned the rule.

## Content Principles

- Add knowledge only when it helps a future agent make a better Gradle decision without reading a whole upstream page.
- Keep runtime guidance portable and task-facing: owner selection, command choices, symptom maps, compatibility facts, safe APIs, validation commands, and concise source-use behavior.
- Prefer model boundaries, symptom maps, command recipes, owner-selection rules, and safe Gradle patterns over prose summaries, broad essays, copied upstream prose, or copied upstream examples.
- Local Gradle checkouts may be used as maintenance inputs, but the runtime surface must not mention maintainer-local evidence such as checkout paths, private branch names, unavailable source-tree filenames, local notes, or provenance labels. Rewrite such evidence as portable Gradle model rules, official documentation links, or versioned compatibility facts.
- Keep one-off preferences in the current turn or owning issue; promote only rules that protect against a realistic recurring failure mode.
- Keep examples focused on safe Gradle patterns; avoid generated source indexes, full-file listings, copied `.adoc` content, machine-specific paths, and historical breadcrumbs.

## Topology Rules

- Treat `skills/gradle/SKILL.md` as the first-hop classifier: broad, stable, under 500 lines, and under the skill-creator recommended instruction budget when practical.
- Treat each `skills/gradle/references/*.md` file as a full-load, on-demand resource. Keep references one level deep; avoid nested route trees, second-level routers, and thin shards that force multi-file reads for one decision.
- Organize references by decision owner: model boundaries, command evidence, runtime/structure, script authoring, dependencies, plugins/tasks/services, performance/cache, publishing/CI/security, ecosystem interop, and upgrades/migrations.
- Keep routes visible in filenames, H1s, and `Read this when: ...` sentences. Put narrow checklists, diagnostics, and subtopic rules in the owning reference, not in `SKILL.md`.
- If discoverability requires stuffing a topic into `SKILL.md`, repair the owning reference or route wording.
- Each reference starts with exactly one H1 and a short `Read this when: ...` scope sentence, has one clear owner, and overlaps siblings only through explicit routing links.
- Treat 100 lines as a warning threshold and 120 lines as a hard maximum. Before adding to a long reference, first shrink, redistribute, or justify why the owner must stay intact.
- Compress before splitting: delete duplicate rules, replace explanations with decision bullets, move volatile version facts into the owning snapshot file, and split only when a future task can choose the new file directly.
- Merge sibling leaves that describe the same decision, diagnostic path, workflow, policy surface, or model boundary. Delete or merge low-value duplicates first: empty glossaries, pure routers, single-entry diagnostics, thin option catalogs, and one-inbound leaves whose content belongs naturally in the parent owner.
- Remove duplicated wording after merges.
- Do not hard-wrap Markdown prose or list items by column width.

## Maintenance Loop

1. Audit `skills/gradle/SKILL.md` and `skills/gradle/references/*.md` for topology, owner boundaries, naming, length pressure, repeated content, orphan references, and stale filenames.
2. Choose a coherent upstream Gradle doc batch from an available upstream Gradle checkout.
3. Read the relevant body sections deeply enough to extract model boundaries, symptom maps, command recipes, and safe API choices.
4. Re-evaluate the whole Gradle skill architecture after the batch; rename, merge, split, or delete references when routing becomes clearer.
5. Rewrite affected references as concise owner guides rather than pasting old sections together.
6. Run the validation gate and report the upstream topics read, files reshaped, durable rules added, and remaining risks.

Complete at least one read -> refactor -> validate -> report loop before stopping, unless missing context, missing source docs, or a required user decision blocks the work.

## Compatibility Calibration

- Separate version existence from compatibility facts: the Gradle versions API identifies released Gradle versions; compatibility pages establish Java, Kotlin, Groovy, AGP, platform, Tooling API, and TestKit support.
- Use `https://services.gradle.org/versions/current` to identify the latest final Gradle release.
- Use `https://services.gradle.org/versions/all` to identify the latest stable patch per major line; ignore entries where `snapshot`, `nightly`, `releaseNightly`, `broken`, or non-empty `rcFor` are present.
- Before promoting an API-reported current version into compatibility knowledge, verify that `https://docs.gradle.org/<version>/userguide/compatibility.html` exists and contains the expected matrix. If the versioned page is missing, keep the skill calibrated to the latest published compatibility page and record only the reusable checking method.
- Use `https://docs.gradle.org/current/userguide/compatibility.html` for upgrade-target decisions and `https://docs.gradle.org/<gradle-version>/userguide/compatibility.html` for legacy-wrapper diagnosis.
- Keep release-level Java, Kotlin, Groovy, and Android Gradle Plugin ranges in `compatibility-version-snapshots.md`.
- Keep the Java runtime/toolchain table and Java symptom ownership in `compatibility-java.md`.
- Keep the embedded Kotlin table and Kotlin DSL ownership rules in `compatibility-kotlin.md`.
- Keep `compatibility-matrix.md` as a compatibility router and cross-surface rule page, not as a copied upstream matrix.
- Do not cite Gradle release anchors as compatibility evidence. Release pages and API results are calibration inputs; compatibility pages are support evidence.

## Validation Gate

After each delete, merge, rename, or content batch, report both inventory and failures:

- Inventory: reference count, total words, total lines, maximum reference length in lines, the longest references by line count, and every reference at or above 100 lines.
- Shape failures: references that do not start with an H1, references that contain more than one H1, references missing the `Read this when: ...` scope sentence, and references over 120 lines.
- Link and topology failures: broken internal Markdown links and orphaned references, where an orphan is any `skills/gradle/references/*.md` file not reachable from `skills/gradle/SKILL.md` through Markdown links.
- Rename/delete failures: residual mentions of renamed or deleted filenames.
- Surface failures: runtime files that contain maintenance provenance, raw calibration notes, machine-local paths, upstream reading logs, or artifact-history phrasing instead of portable Gradle task guidance.
- Markdown policy failures: repository Markdown policy errors for the edited surface.

Run the repository Markdown policy for the edited surface:

```bash
npx --yes markdownlint-cli2 "skills/gradle/**/*.md" "agents/maintenance-gradle-skill.md" --config .markdownlint-cli2.yaml
```

Do not continue pruning until the current batch has zero shape, link, topology, rename/delete, surface, or Markdown policy failures.
