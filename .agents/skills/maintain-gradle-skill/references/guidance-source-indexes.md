# Gradle Source Indexes

Read this when: documentation or Gradle source materially calibrates runtime guidance, or source-index topology is being maintained.

## Source Index Rules

- Keep source provenance under `references/source-index-<runtime-reference-file>.md`.
- Name each source-index file after the runtime reference it calibrates with the `source-index-` prefix, and start it with the same H1 as the owning runtime reference.
- Put documentation links under `## Documentation` and code-source links under `## Source Code`.
- Use one bullet per durable documentation entry: `- [Official title](public URL)`.
- Use one bullet per durable code-source entry with the Gradle checkout's repository-relative path.
- When reading `https://docs.gradle.org/**` and changing a runtime file because of it, update the owning source-index file in the same change with each materially used page title and URL.
- Sort documentation entries by normalized title and source-code entries lexicographically by repository-relative path. Use `node scripts/sort-reference-sections.mjs --check` from this skill directory to verify sorting, reference naming, and the runtime target for every source-index file.
- Omit `## Source Code` when no code source file materially calibrates the runtime reference.
- Do not create a source-index entry for every page skimmed; include only sources that materially calibrate the runtime reference.
- Current Gradle code-source path calibration baseline is Gradle version `9.6.1`; update this baseline when regenerating source-code paths from a different Gradle version.
