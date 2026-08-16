---
name: maintain-gradle-skill
description: Maintain or review the repository's Gradle skill package under `skills/gradle/**` and `.agents/skills/maintain-gradle-skill/**`, including runtime guidance, source calibration, compatibility snapshots, reference topology, source indexes, validation, and maintenance scripts. Do not use for ordinary Gradle troubleshooting in user projects.
---

# Maintain Gradle Skill

Maintain the canonical Gradle runtime skill and its maintenance package. Use the runtime `gradle` skill for ordinary user-project troubleshooting.

## Surfaces

- Runtime surface: `skills/gradle/**`. This is what future agents load while solving Gradle tasks.
- Maintenance surface: this skill directory. It owns curation rules, source indexes, maintenance scripts, calibration policy, and validation gates.
- Discovery surface: conversation notes, temporary source-reading logs, audit breadcrumbs, local paths, and edit rationale that must not become runtime guidance.

## Release Gate

Promote behavior only after the component that carries it has a final release; Gradle-owned behavior requires a final Gradle release. Keep milestone, release-candidate, snapshot, nightly, untagged, and otherwise unreleased evidence out of runtime guidance and durable source indexes even when qualified. A final release's deprecation contract may retain a planned future failure or removal when it changes current migration action: bind the plan to the released warning, label the future behavior as planned rather than observed, and re-evaluate it when the target release becomes final. This exception does not admit evidence from an unreleased target. Use all other unreleased evidence only to identify candidates, then re-evaluate them from final-release evidence.

## Distillation Coverage

Recurring upstream distillation must complete independent delta and published-owner lanes. Read [references/protocol-distillation-coverage.md](references/protocol-distillation-coverage.md) before selecting their coverage, declaring no change, advancing the owner cursor, or claiming whole-owner semantic freshness.

## Maintenance References

- Read [references/guidance-runtime-curation.md](references/guidance-runtime-curation.md) before editing, reorganizing, or reviewing runtime Gradle skill content and topology.
- Read [references/guidance-source-indexes.md](references/guidance-source-indexes.md) whenever documentation or Gradle source materially calibrates runtime guidance.
- Read [references/guidance-version-calibration.md](references/guidance-version-calibration.md) before promoting version-sensitive behavior, compatibility facts, or source-derived claims.
- Read [references/guidance-validation.md](references/guidance-validation.md) after every edit batch and before committing or reporting completion.

## Operating Loop

1. Audit the runtime entry and references for owner boundaries, topology, naming, length pressure, duplication, orphans, stale routes, and maintenance leakage. For recurring upstream distillation, complete both coverage lanes before deciding that no change qualifies.
2. For every candidate, read the routed maintenance references and enough upstream evidence to identify the action-changing rule, runtime owner, carrying component, final-release boundary, and validation oracle.
3. Classify each evidenced candidate as accepted, rejected with a reason, or blocked by named missing evidence or a required decision.
4. Patch the smallest runtime owner for each accepted candidate. Update its source index in the same batch with only the evidence that materially calibrated the change.
5. Reassess affected topology after the content change; rename, merge, split, or delete only when the resulting load boundary is clearer.
6. Run the validation gate, perform a fresh whole-batch review, fix every confirmed finding, and rerun invalidated checks until one clean review remains.
7. Report candidates read, accepted changes or the reason none qualified, files reshaped, version decisions, validation evidence, and residual risks. When the published-owner lane ran, also report its owner, claim dispositions, and next-owner cursor.

Do not leave a discovered candidate unclassified. A no-change run is valid only when its required coverage lanes are complete and every discovered candidate was rejected or blocked with explicit evidence.
