# Gradle Source Indexes

Read this when: documentation or Gradle source materially calibrates runtime guidance, or source-index topology is being maintained.

## Source Index Rules

- Keep provenance in `references/source-index-<runtime-reference-file>.md`; match the owning runtime filename and H1.
- Put unique `- [Official title](public URL)` entries without URL fragments under `## Documentation`. Under `## Source Code`, put each unique Gradle-checkout-relative path in an inline-code bullet; omit the section when no source path materially calibrated the owner.
- Index only evidence that materially calibrated the runtime owner. When documentation or source evidence changes a runtime rule, update its source index in the same batch.
- Treat release notes as discovery inputs. After accepting a change, index the durable current User Manual or API contract when available, plus the direct implementation and representative test when they establish the rule.
- Default `docs.gradle.org` links to `current`. Pin a version only when that release establishes a material boundary or supports legacy diagnosis; make the reason visible in the link title or runtime guidance.
- Trace delegating facades to the nearest implementation owner. When both implementation and representative test establish the rule, index both; a facade and test do not replace the code that performs the behavior.
- The Gradle source-path baseline is final Gradle release `9.7.0`. Advance it only to a newer final release. Unreleased source paths may identify candidates but cannot enter runtime guidance, become durable entries, or replace the baseline until revalidated against a final Gradle release.
- Run `node scripts/sort-reference-sections.mjs --check` from this skill directory to validate topology and entry shape, reject duplicates, and verify normalized-title and source-path ordering.
