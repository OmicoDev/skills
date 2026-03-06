---
name: vitepress-cursor-docs
description: Maintain and extend the VitePress docs site generated from Cursor rules, skills, and commands. Use when adding a docs section, changing sidebar or nav behavior, editing generate-docs.mjs or config.mts, debugging the docs build, or replicating this setup elsewhere.
---

# VitePress docs from Cursor (rules, skills, commands)

This setup uses **`docs/scripts/generate-docs.mjs`** to turn Cursor rules, commands, and skills into VitePress content. Site navigation lives in **`docs/.vitepress/config.mts`**. The sidebar output in **`docs/.vitepress/sidebar.generated.mts`** is generated and must not be edited by hand.

## When to use this skill

- Adding or removing a generated docs section
- Changing nav structure or sidebar generation behavior
- Debugging the generator script or the VitePress build
- Replicating this "docs from Cursor sources" pattern in another repository

## What not to edit

- Do not edit generated files under `docs/src/cursor-rules/`, `docs/src/cursor-commands/`, or `docs/src/agent-skills/`.
- Do not edit `docs/.vitepress/sidebar.generated.mts` by hand.
- Generated section index pages such as `docs/src/cursor-rules/index.md` are outputs, not source files.
- The site homepage, such as `docs/src/index.md`, may still be hand-maintained unless the repo defines otherwise.

## Architecture

- **Generator**: `docs/scripts/generate-docs.mjs` (Node, ESM).
- **Flat sections**: one output dir per source dir, one doc per file. These are configured with `PATHS` and `FLAT_SECTIONS` in `generate-docs.mjs` (for example, rules use `.mdc` and commands use `.md`).
- **Agent skills section**: a tree under `.cursor/skills/`; each skill directory has `SKILL.md` (written to `index.md`) and can also include `references/*.md`. The sidebar for this section is hierarchical.
- **Outputs**: Markdown under `docs/src/` plus `docs/.vitepress/sidebar.generated.mts`. VitePress reads both the generated content and the generated sidebar.
- **Run context**: Script can run from repo root or from `docs/`; it detects via `path.basename(cwd) === "docs"` and sets `repoRoot` / `docsRoot` accordingly.

## Content pipeline

For each source file the generator:

- **Strips YAML frontmatter** so the doc is plain Markdown.
- **Inserts an “Auto-generated from” block** after the first heading, linking to the source file on GitHub (`GITHUB_BASE` in the script).
- **Rewrites links**: `.cursor/skills/...` (and `./.cursor/skills/...`) in content become `/agent-skills/...` (extensionless) for the built site.
- **Writes** the result under the appropriate `docs/src/` subdir.

Generated section index pages such as `cursor-rules/index.md` and `cursor-commands/index.md` list items with "Title | Source" tables that link to generated pages and GitHub source paths. These pages use a Markdown `#` heading only and do not include a `title` frontmatter block.

## Adding a new flat section

Use this checklist to add another "one source dir -> one docs section" setup, similar to rules or commands:

- **Add a `PATHS` entry** in `generate-docs.mjs`. Set `in` to the repo-relative source directory and `out` to the target path under `contentRoot`, such as `docs/src/my-section`.
- **Add a `FLAT_SECTIONS` entry** with the matching `pathKey`, source file extension, section title, and sidebar base such as `"/my-section/"`.
- **Regenerate the docs** with `npm run docs:prepare` from the repo root or from `docs/`.
- **Add a nav entry** in `docs/.vitepress/config.mts` so the new section is visible in the site navigation.
- **Update CI if needed**. If the source directory is outside `.cursor/commands`, `.cursor/rules`, or `.cursor/skills`, add its paths to the workflow filter in `.github/workflows/docs.yml`.
- **Do not hand-edit generated output** under `docs/src/` after regeneration.

## Agent-skills section (tree)

- **Source**: `.cursor/skills/**`; each directory with a `SKILL.md` is one skill; `references/*.md` become sub-pages under that skill.
- **Output**: `docs/src/agent-skills/<skill-name>/index.md` (from SKILL.md) and `docs/src/agent-skills/<skill-name>/references/<name>.md` for each reference file.
- **Sidebar**: Built in `buildAgentSkillsSidebar()` — top-level “Agent skills” link plus one entry per skill; if a skill has `references/*.md`, that entry gets `collapsed: true` and `items` for each reference.
- **Links in content**: The generator rewrites `.cursor/skills/...` links to `/agent-skills/...` so cross-references between skills work on the site.

To add a new skill, add a directory under `.cursor/skills/` with `SKILL.md` (and optionally `references/*.md`); no change to the script is needed. Run `npm run docs:prepare` to regenerate.

## Local and CI commands

- **Prepare only**: `npm run docs:prepare` (from repo root or `docs/`) — runs `node scripts/generate-docs.mjs`, writes `docs/src/*` and `sidebar.generated.mts`.
- **Dev**: `npm run docs:dev` — runs prepare then `vitepress dev`.
- **Build**: `npm run docs:build` — runs prepare then `vitepress build`; CI uses this and uploads `docs/.vitepress/dist` as the GitHub Pages artifact.

## Replicating in another repo

- **Copy the docs scaffolding** such as `docs/package.json`, `docs/.vitepress/config.mts`, and `docs/scripts/generate-docs.mjs`; then set `PATHS` and `GITHUB_BASE` for the new repo.
- **Adjust** `FLAT_SECTIONS` and `PATHS` to match the new repo’s source layout.
- **Add** a GitHub Actions workflow that runs `npm run docs:build` in `docs/` and deploys `docs/.vitepress/dist` (e.g. `deploy-pages`).
- **Keep** the convention: treat generated files under `docs/src/` as build output, not source material; edit source dirs and regenerate.
