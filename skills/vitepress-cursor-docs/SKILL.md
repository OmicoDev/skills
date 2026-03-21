---
name: vitepress-cursor-docs
description: >-
  Use this skill for VitePress sites that publish Cursor rules, commands, and agent skills
  through docs/scripts/generate-docs.mjs (bootstrap from template/generate-docs.mjs and
  template/config.mts when starting fresh).
  Apply it when editing docs/.vitepress/config.mts and themeConfig.nav,
  sidebar.generated.mts, GITHUB_BASE, PATHS, FLAT_SECTIONS, the recursive .cursor/skills
  walker, npm scripts docs:prepare/docs:dev/docs:build, gitignore for generated docs/src
  trees, or CI paths and workflows for docs.
  Use it when the user wants to publish or sync .cursor content into docs, fix a broken
  docs build, add a generated section, replicate this pipeline in another repo, or mentions
  VitePress together with Cursor rules, commands, or skills—even if they never name
  generate-docs.mjs or this skill.
  Do not use it for VitePress-only docs with hand-written Markdown and no
  generate-docs.mjs pipeline from .cursor, or for generic site styling and content work
  unrelated to this Cursor-to-docs sync (prefer the general VitePress skill).
---

# VitePress docs from Cursor (rules, skills, commands)

**`docs/scripts/generate-docs.mjs`** builds VitePress content under **`docs/src/`** and writes **`docs/.vitepress/sidebar.generated.mts`**. Hand-maintain **`themeConfig.nav`** in **`docs/.vitepress/config.mts`** (paths must match generated routes; order does not need to match the sidebar). Do not edit **`sidebar.generated.mts`** by hand.

Optional **Cursor rules** (`.cursor/rules/*.mdc`) may point agents here; this skill is the **canonical** workflow. Keep **repo-only** facts in rules (generator path, default branch, install command).

## Scope

### When not to use this skill

- **No Cursor-to-docs pipeline**: plain VitePress with hand-written `docs/src/` and no `docs/scripts/generate-docs.mjs` (or equivalent) that reads `.cursor/rules`, `.cursor/commands`, or `.cursor/skills`.
- **VitePress-only work**: theming, unrelated authoring, or config changes that do not involve `sidebar.generated.mts`, `PATHS` / `FLAT_SECTIONS`, or syncing from `.cursor/`.
- **Other doc stacks** (e.g. MkDocs, Docusaurus) or anything that is not “VitePress + this generator.”

### If the fit is unclear

Open **`docs/scripts/generate-docs.mjs`** (or **`template/generate-docs.mjs`** while bootstrapping). If that script is central to the task, use this skill; otherwise use another skill.

## Architecture and pipeline

- **`generate-docs.mjs`** (Node, ESM): **flat** sections use **`PATHS`** and **`FLAT_SECTIONS`** and only list **top-level files** in each source directory; **`.cursor/skills/`** is walked **recursively**. Use **`template/generate-docs.mjs`** as the structural reference.
- **`docs/.vitepress/config.mts`** imports **`sidebar.generated.mts`** and sets **`themeConfig.nav`** (**`template/config.mts`** is the matching starter).
- **`docs:prepare`** may be run from the repository root or from **`docs/`**.

**Pipeline** (details live in the script): strip YAML frontmatter; insert an “Auto-generated from” line with **`GITHUB_BASE`**; rewrite **`.cursor/skills/...`** links to site routes; write Markdown under **`docs/src/`**; emit index tables for flat sections.

## Sources, output, and `docs:prepare`

Edit **sources** under **`.cursor/rules`**, **`.cursor/commands`**, and **`.cursor/skills`**. Do **not** edit generated trees such as **`docs/src/cursor-rules/`**, **`docs/src/cursor-commands/`**, **`docs/src/agent-skills/`**, **`docs/.vitepress/sidebar.generated.mts`**, or flat-section index pages (e.g. **`docs/src/cursor-rules/index.md`**). The **homepage** (e.g. **`docs/src/index.md`**) may stay hand-written unless the repository says otherwise.

After source edits, run **`npm run docs:prepare`** from the repository root or **`docs/`** (it usually runs before **`docs:dev`** and **`docs:build`**). Generated flat-section index pages use a single Markdown **`#`** heading only—no YAML **`title`**; the generator owns that shape.

## Navigation and sidebar

- **Nav**: **`themeConfig.nav`** in **`docs/.vitepress/config.mts`** — paths must match routes the generator emits.
- **Sidebar**: change **`docs/scripts/generate-docs.mjs`** (for example **`FLAT_SECTIONS`** and agent-skills sidebar logic), not **`sidebar.generated.mts`**, then run **`npm run docs:prepare`**.

## Git ignores and fresh clones

**`docs/.gitignore`** (paths relative to **`docs/`**; a leading **`/`** anchors to the docs root):

```gitignore
/node_modules/
/src/agent-skills/
/src/cursor-commands/
/src/cursor-rules/
```

**`docs/.vitepress/.gitignore`** (relative to **`docs/.vitepress/`**):

```gitignore
/cache/
/dist/
/sidebar.generated.mts
```

If **`sidebar.generated.mts`** or generated trees under **`docs/src/`** are ignored, they are missing after **`git clone`** until **`docs:prepare`** runs (or **`docs:dev`**, **`docs:build`**, or CI does the same). **`config.mts`** imports the sidebar—run prepare before **`vitepress`** if the module is absent. To track **`sidebar.generated.mts`**, remove it from **`docs/.vitepress/.gitignore`**.

## Extending the generator

### New flat section

- Add matching **`PATHS`** and **`FLAT_SECTIONS`** in **`generate-docs.mjs`**, then **`npm run docs:prepare`**.
- Add a **nav** entry in **`config.mts`**.
- **CI**: extend workflow **`paths`** when the new source directory is not covered. Use recursive globs for nested files (e.g. **`.cursor/commands/**/*.md`**). The stock flat-section loop only reads files **directly** in each **`PATHS`** directory; nested sources need changes to **`generateFlatSection`** (or a new generator). Patterns like **`.cursor/commands/*.md`** match one directory level only.
- Do not hand-edit regenerated files under **`docs/src/`**.

### Agent skills (tree)

- **Layout**: **`.cursor/skills/`** → **`docs/src/agent-skills/`**; each **`SKILL.md`** → **`index.md`**; other relative paths stay intact (e.g. **`references/*.md`**).
- **Index**: each **`SKILL.md`** adds one row (label from the parent folder). Several nested **`SKILL.md`** files yield several rows—prefer **one skill per top-level folder** under **`.cursor/skills/`**.
- **Processing**: one header and link pipeline for every file (write Markdown; edge cases in **`generate-docs.mjs`**). Hierarchical sidebar and **`.cursor/skills/...`** → site rewrites live in **`generate-docs.mjs`**. For a different sidebar shape or more linked pages, extend the script using existing patterns.

To add a skill, add a directory with **`SKILL.md`** under **`.cursor/skills/`**, then **`npm run docs:prepare`**.

## Bootstrap (`template/`)

Use this when creating or copying the pipeline into a new project. Starter files:

| Template | Copy to |
| -------- | ------- |
| **`template/generate-docs.mjs`** | **`docs/scripts/generate-docs.mjs`** |
| **`template/config.mts`** | **`docs/.vitepress/config.mts`** |

1. Copy both files (create **`docs/scripts/`** and **`docs/.vitepress/`** if needed).
2. In **`config.mts`**, set **`title`**, **`description`**, and **`themeConfig.socialLinks`**. **`themeConfig.nav`** must match routes the generator emits (the stock **`template/generate-docs.mjs`** matches the default nav).
3. In **`generate-docs.mjs`**, set **`GITHUB_BASE`** (required), e.g. `https://github.com/<owner>/<repo>/blob/HEAD/` (or a fixed branch or tag). Powers “Auto-generated from” links and index tables.
4. Add **`docs/package.json`** with **`vitepress`** and scripts (e.g. **`docs:prepare`** → `node scripts/generate-docs.mjs`), run **`npm install`** in **`docs/`**, and keep **`config.mts`** importing **`sidebar.generated.mts`**.

Optionally add **`docs/src/index.md`**, theme assets, and the **Git ignores** above if generated output should not be committed. Copying an existing **`docs/`** tree from another repository is fine when faster.

In the target repository, checked-in **`generate-docs.mjs`** and **`config.mts`** are the source of truth; **`template/`** and this **`SKILL.md`** are bootstrap and reference—not parallel copies to maintain.

## Commands and CI

Define scripts in **`docs/package.json`**; run **`npm run <script>`** from the repository root or **`docs/`**. Pin **VitePress** and Node with **`package-lock.json`** (or your lockfile) when reproducing builds.

- **`docs:prepare`**: `node scripts/generate-docs.mjs` — writes **`docs/src/*`** and **`docs/.vitepress/sidebar.generated.mts`**
- **`docs:dev`**: prepare, then **`vitepress dev`**
- **`docs:build`**: prepare, then **`vitepress build`** — ship **`docs/.vitepress/dist`** (e.g. GitHub Pages or another static host)
- **`docs:preview`**: **`docs:build`**, then **`vitepress preview`**

Typical GitHub Actions: on push to the default branch when docs-related **`paths`** change—checkout, **`npm ci`** or **`npm install`** in **`docs/`**, **`npm run docs:build`**, deploy artifacts.

**Example `on.push.paths`:** **`.cursor/commands/**/*.md`**, **`.cursor/rules/**/*.mdc`**, **`.cursor/skills/**/*.md`**, **`docs/**`**, and the workflow file (e.g. **`.github/workflows/docs.yml`**). Add paths when you add a new ingested source tree that existing globs would not cover. Recursive globs matter when sources nest (see **New flat section**).
