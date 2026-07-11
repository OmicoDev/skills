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

Run the source-index check from this skill directory before reporting completion:

```bash
node scripts/sort-reference-sections.mjs --check
```

Apply the repository formatting and Markdown lint rules from `AGENTS.md` to the edited files.
