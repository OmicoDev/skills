# Gradle Skill Validation

Read this when: validating any Gradle runtime or maintenance content batch, rename, merge, split, or delete before completion.

## Validation Gate

Report inventory and every failure for the completed batch:

- Inventory: reference count, total words, total lines, maximum reference length in lines, the longest references by line count, and every reference at or above 100 lines.
- Runtime-shape failures: runtime references that do not start with an H1, contain more than one H1, omit their `Read this when: ...` scope sentence, or exceed 120 lines.
- Maintenance-guidance-shape failures: `guidance-*.md` references that do not contain exactly one H1 or omit their `Read this when: ...` scope sentence.
- Link and topology failures: broken internal Markdown links and orphaned references, where an orphan is any `skills/gradle/references/*.md` file not reachable from `skills/gradle/SKILL.md` through Markdown links.
- Rename/delete failures: residual mentions of renamed or deleted filenames.
- Source-index failures: missing source-index entries for documentation URLs or source paths that materially calibrated runtime changes in the batch.
- Version-boundary failures: a Release Gate violation; final-release evidence generalized beyond its verified versions; a version-sensitive rule missing its carrying component or material qualifier; or an introduction, change, or removal claim without tagged or versioned final-release evidence from that component.
- Surface failures: runtime files that contain maintenance provenance, raw calibration notes, machine-local paths, upstream reading logs, or artifact-history phrasing instead of portable Gradle task guidance.
- Markdown policy failures for the edited surface.

## Fresh Review Gate

- After mechanical validation passes, reinspect every changed runtime and maintenance artifact without assuming the draft is correct.
- Scope the result precisely: whole-batch review covers the current batch's changed artifacts and candidate decisions, not untouched runtime owners. Apply [Gradle Distillation Coverage](protocol-distillation-coverage.md) before claiming whole-owner semantic freshness from a recurring or one-off audit.
- For each source-derived rule, verify the exact claim against the nearest direct implementation owner when one exists and against a representative test or documented contract. Apply the source-index rules before accepting provenance.
- Pressure-test scope with the counter-case that would most change user action, such as the release immediately before the boundary, cache hit versus miss, managed versus unmanaged execution, enabled versus disabled behavior, success versus cancellation, or root process versus descendant.
- Narrow wording to what the evidence proves. Do not turn “this cancelled result is not reusable” into “no prior result can be reused,” or current-source behavior into an unqualified cross-version rule.
- Commit or report completion only after one clean review of the final state. A finding invalidates affected checks: fix it, rerun those checks, and review the resulting state again. If the final review is blocked, report the limitation instead of presenting the batch as finished.

Run the source-index check from this skill directory before reporting completion:

```bash
node scripts/sort-reference-sections.mjs --check
```

Apply the repository formatting and Markdown lint rules from `AGENTS.md` to the edited files.
