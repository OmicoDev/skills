# Gradle Skill Agent Rules

Read this when working in `skills/gradle/**`.

This file is maintenance guidance for the Gradle skill. It is not Gradle runtime knowledge and should not be loaded to solve ordinary Gradle build problems.

## Mission

The Gradle skill helps future agents classify, diagnose, and safely modify Gradle builds, build logic, plugins, tasks, dependency policy, CI, publishing, and upgrade paths.

Its durable value is middle-layer operating knowledge:

- classify the Gradle owner surface before editing
- diagnose symptoms with narrow wrapper commands and reports
- choose safe Gradle APIs and model boundaries
- make small build logic changes that preserve laziness, cacheability, and reproducibility
- validate the change with evidence appropriate to the owner

Do not turn the skill into a Gradle tutorial, User Manual mirror, release-note archive, generated source index, or broad upstream page catalog.

## Content Gate

- Treat `skills/gradle/SKILL.md` as the first-hop classifier and `skills/gradle/references/*.md` as practical operating knowledge.
- Add durable knowledge only when it helps a future agent make a better Gradle decision without reading a whole upstream page.
- Prefer model boundaries, symptom maps, command recipes, owner-selection rules, and safe Gradle patterns over prose summaries.
- Use official Gradle docs links only for citations or version-specific calibration; do not copy upstream prose or examples wholesale.
- Remove any reintroduced vendored Gradle User Manual directory under `skills/gradle/references/`.
- Keep one-off preferences in the current turn or owning issue; only promote rules that protect a realistic recurring failure mode.

## Information Architecture

- Keep `SKILL.md` coarse, stable, and limited to first-hop owner routes.
- Keep references one level deep under `skills/gradle/references/`; do not create nested route trees.
- Organize references by decision owner: model boundaries, command evidence, runtime/structure, script authoring, dependencies, plugins/tasks/services, performance/cache, publishing/CI/security, ecosystem interop, and upgrades/migrations.
- Use stable owner-oriented filenames so routing remains visible from paths.
- If a topic can only be found by adding it to `SKILL.md`, repair the owning reference instead.
- Put narrow checklists, diagnostics, and subtopic rules in the owning reference, not in `SKILL.md`.
- Split only when a future task can choose one file without needing the other.
- Merge sibling leaves when they describe the same decision, diagnostic path, workflow, policy surface, or model boundary.

## Maintenance Loop

1. Audit `skills/gradle/SKILL.md` and `skills/gradle/references/*.md` for topology, owner boundaries, naming, length pressure, repeated content, orphan references, and stale filenames.
2. Choose a coherent upstream Gradle doc batch from an available upstream Gradle checkout.
3. Read the relevant body sections deeply enough to extract model boundaries, symptom maps, command recipes, and safe API choices.
4. Re-evaluate the whole Gradle skill architecture after the batch; rename, merge, split, or delete references when routing becomes clearer.
5. Rewrite affected references as concise owner guides rather than pasting old sections together.
6. Run the validation gate and report the upstream topics read, files reshaped, durable rules added, and remaining risks.

Complete at least one read -> refactor -> validate -> report loop before stopping unless blocked by missing context, missing source docs, or a required user decision.

## Reference Shape

- Each reference starts with exactly one H1 and a short `Read this when: ...` scope sentence.
- A reference should have one clear owner and should not overlap siblings except through explicit routing links.
- Keep references short enough to scan; split, compress, or redistribute any reference over 120 lines.
- Keep short references scannable without a `## Contents` section; the filename, H1, and scope sentence should carry the structure.
- Do not hard-wrap Markdown prose or list items by column width.
- Use bullets, small examples, and owner boundaries over broad essays.
- Keep examples focused on safe Gradle patterns; avoid generated source indexes, full-file listings, copied `.adoc` content, machine-specific paths, or historical breadcrumbs.

## Shrink Decisions

- Preserve progressive disclosure while shrinking: route files classify owner surfaces; leaf files carry distinct reusable decisions.
- Delete or merge low-value duplicate files first: empty glossaries, pure second-level routers, single-entry diagnostics, thin option catalogs, and one-inbound leaves whose content belongs naturally in the parent.
- Keep an independent owner file when the next task can reasonably choose that file without the parent topic, especially for version-sensitive behavior, dedicated diagnostics, or separate implementation APIs.
- Prefer sharpening, merging, or deleting weak wording before adding new rules.
- After merging leaves, remove duplicated wording created by the merge.

## Compatibility Calibration

- Separate release existence from compatibility facts. The Gradle versions API proves which Gradle versions exist; compatibility pages prove Java, Kotlin, Groovy, AGP, platform, Tooling API, and TestKit support.
- Use `https://services.gradle.org/versions/current` to identify the latest final Gradle release.
- Use `https://services.gradle.org/versions/all` to identify the latest stable patch per major line; ignore entries where `snapshot`, `nightly`, `releaseNightly`, `broken`, or non-empty `rcFor` are present.
- Before promoting an API current version into compatibility knowledge, verify that `https://docs.gradle.org/<version>/userguide/compatibility.html` exists and contains the expected matrix. If the versioned page is missing, keep the skill calibrated to the latest published compatibility page and record only the reusable checking method.
- Use `https://docs.gradle.org/current/userguide/compatibility.html` for upgrade-target decisions and `https://docs.gradle.org/<gradle-version>/userguide/compatibility.html` for legacy-wrapper diagnosis.
- Keep release-level Java, Kotlin, Groovy, and Android Gradle Plugin ranges in `compatibility-version-snapshots.md`.
- Keep the Java runtime/toolchain table and Java symptom ownership in `compatibility-java.md`.
- Keep the embedded Kotlin table and Kotlin DSL ownership rules in `compatibility-kotlin.md`.
- Keep `compatibility-matrix.md` as a compatibility router and cross-surface rule page, not as a copied upstream matrix.
- Do not cite Gradle release anchors as compatibility evidence. Release pages and API results are calibration inputs; compatibility pages are support evidence.

## Validation Gate

After each delete, merge, rename, or content batch, check:

- reference count, total words, total lines, and maximum reference length
- broken Markdown links
- orphaned references
- missing H1s
- reference files over 120 lines
- residual mentions of deleted filenames
- no `skills/gradle/references/userguide/**` directory was reintroduced

Run the repository Markdown policy for the edited surface:

```bash
npx --yes markdownlint-cli2 "skills/gradle/**/*.md" --config .markdownlint-cli2.yaml
```

Also lint this file when it changes. Do not continue pruning until the current batch has zero broken links, zero orphans, zero missing H1s, no overlong reference files, and no residual renamed/deleted filenames.
