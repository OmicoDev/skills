# Gradle Runtime Curation

Read this when: editing, reorganizing, or reviewing runtime Gradle skill content, placement, or topology.

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
- Treat 100 lines as a warning threshold and 120 lines as a hard maximum. Before adding to a long reference, split the owner guidance when future turns can load the parts independently; otherwise remove duplication or move volatile facts to their owning snapshot without compressing away decision-critical detail.
- Merge sibling leaves that describe the same decision, diagnostic path, workflow, policy surface, or model boundary. Remove duplicated wording after merges.
