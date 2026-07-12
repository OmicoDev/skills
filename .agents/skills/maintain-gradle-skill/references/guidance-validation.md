# Gradle Skill Validation

Read this when: validating any Gradle runtime or maintenance content batch, rename, merge, split, or delete before completion.

## Validation Gate

Report inventory and every failure after each batch:

- Inventory: reference count, total words, total lines, maximum reference length in lines, the longest references by line count, and every reference at or above 100 lines.
- Shape failures: references that do not start with an H1, references with more than one H1, references missing the `Read this when: ...` scope sentence, and references over 120 lines.
- Link and topology failures: broken internal Markdown links and orphaned references, where an orphan is any `skills/gradle/references/*.md` file not reachable from `skills/gradle/SKILL.md` through Markdown links.
- Rename/delete failures: residual mentions of renamed or deleted filenames.
- Source-index failures: missing source-index entries for documentation URLs or source paths that materially calibrated runtime changes in the batch.
- Version-boundary failures: current-only evidence promoted as universal behavior, version-sensitive rules missing an owning-component or release qualifier, or introduction/change/removal claims inferred without tagged or versioned evidence.
- Surface failures: runtime files that contain maintenance provenance, raw calibration notes, machine-local paths, upstream reading logs, or artifact-history phrasing instead of portable Gradle task guidance.
- Markdown policy failures for the edited surface.

## Fresh Review Gate

- After mechanical validation passes, reread the changed runtime guidance as a fresh reviewer without assuming the intended conclusion is correct.
- For every source-derived rule, verify the exact claim against the nearest direct implementation owner when one exists, plus a representative test or documented contract; apply the source-index rules before treating provenance as complete.
- Pressure-test scope with the counter-case that would most change user action, such as the release immediately before the boundary, cache hit versus miss, managed versus unmanaged execution, enabled versus disabled behavior, success versus cancellation, or root process versus descendant.
- Narrow wording to what the evidence proves. Do not turn “this cancelled result is not reusable” into “no prior result can be reused,” or current-source behavior into an unqualified cross-version rule.
- Fix every confirmed finding, rerun the affected validation gates, and complete one clean post-fix review before committing or reporting completion. If a fresh review cannot be completed, report that limitation instead of presenting the batch as finished.

Run the source-index check from this skill directory before reporting completion:

```bash
node scripts/sort-reference-sections.mjs --check
```

Apply the repository formatting and Markdown lint rules from `AGENTS.md` to the edited files.
