# Gradle Runtime Curation

Read this when: editing, reorganizing, or reviewing runtime Gradle skill content, placement, or topology.

## Runtime Content Gate

- Add only guidance that changes a future agent's decision in a user's Gradle project.
- Preserve middle-layer operating knowledge: owner selection, symptom maps, narrow commands and reports, safe APIs and model boundaries, lazy/cacheable/reproducible patterns, and owner-appropriate validation. Exclude tutorials, broad essays, copied upstream prose or examples, release-note archives, and page catalogs.
- Translate checkout evidence into portable model rules, official documentation links, or versioned compatibility facts. Keep maintainer-local paths, branches, source filenames unavailable to users, reading logs, and provenance labels out of runtime files.
- Apply the Release Gate in `SKILL.md` before admitting behavior to `skills/gradle/**`.
- Use official Gradle links in runtime text only when they help a future task cite or verify a Gradle fact, not to record where a maintainer learned it.

## Placement Rules

- Put ordinary task guidance in `skills/gradle/**`.
- Put curation process, calibration method, source-index format, upstream batch selection, vendoring bans, local checkout handling, topology rules, validation gates, and historical cleanup rules in this skill.
- Keep discovery notes and raw reading logs in the conversation, owning issue, or maintenance report. Use automation memory only for candidate decisions and continuity; none of these surfaces is a runtime source of truth.
- Promote preferences only when they become reusable rules that prevent a realistic recurring failure.
- Describe the user's Gradle decision, not the runtime file's creation, calibration, source gathering, or edit history.

## Runtime Topology

- Keep `skills/gradle/SKILL.md` as a broad, stable first-hop classifier under 500 lines and, when practical, under 5 KiB.
- Keep runtime references one hop from the entry. Treat each as a full-load, on-demand owner guide; avoid nested routers and thin shards that require several files for one decision.
- Organize runtime references by decision owner: model boundaries, command evidence, runtime/structure, script authoring, dependencies, plugins/tasks/services, performance/cache, publishing/CI/security, ecosystem interop, and upgrades/migrations.
- Keep routes visible in filenames, H1s, and `Read this when: ...` sentences. Put narrow checklists, diagnostics, and subtopic rules in the owning reference, not in `SKILL.md`.
- Treat 100 lines as a warning and 120 as a hard maximum. Split only at an independent load boundary; otherwise remove duplication or move volatile facts to their owning snapshot without losing decision-critical detail.
- Merge siblings that serve the same decision, diagnostic path, workflow, policy surface, or model boundary, then remove duplicated wording.
