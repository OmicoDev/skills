# Agent skills from OmicoDev

This repository stores reusable agent skills made by OmicoDev.

## Install

Install from a GitHub repository:

```bash
npx skills add OmicoDev/skills
```

Install a specific skill only:

```bash
npx skills add OmicoDev/skills --skill vitepress-cursor-docs
```

## Included skills

| Skill | Description | Use Cases |
| --- | --- | --- |
| `gradle` | Guides Gradle work across wrapper usage, build scripts, dependency management, plugin development, toolchains, performance, troubleshooting, and upgrades. | Debug `gradlew` or wrapper issues; inspect tasks and CLI usage; manage dependencies, repositories, and version catalogs; write convention or binary plugins; configure JVM toolchains; diagnose configuration cache or build cache problems; migrate between Gradle versions. |
| `vitepress-cursor-docs` | Maintains and extends a VitePress documentation site generated from Cursor rules, skills, and commands. | Add or reorganize docs sections; update VitePress nav or sidebar generation; modify `generate-docs.mjs`; debug docs build issues; replicate the same docs setup in another repository. |
