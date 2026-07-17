# Gradle Best-Practice Audits

Read this when: a user asks for a broad Gradle best-practice audit, official best-practice coverage, or every-practice review before the owner surface is known.

Use this as a grouped checklist of audit items. Do not use tables. Keep each item simple: practice, owner link, next action.

## Audit Method

- Start broad, then route each finding to one owning reference.
- Promote only reusable Gradle guidance, and leave one-off project preferences in the audit report.
- Finish by grouping findings by owner, applying requested fixes only in the owning Gradle surface, and running the narrowest wrapper or repository validation command.

## Checklist

### General

- Use Kotlin DSL ([scripts-and-conventions.md](scripts-and-conventions.md)): keep new examples and build logic in Kotlin DSL unless a Groovy migration is the task.
- Use the latest Gradle minor ([upgrade-strategy.md](upgrade-strategy.md)): check compatibility, then update the wrapper deliberately.
- Apply plugins with the `plugins {}` block ([scripts-and-conventions.md](scripts-and-conventions.md)): replace imperative plugin application only when classpath and ordering stay valid.
- Do not rely on plugin application order ([plugins-services-and-diagnostics.md](plugins-services-and-diagnostics.md)): apply mandatory plugins explicitly and use plugin callbacks for optional integrations.
- Avoid Gradle internal APIs ([scripts-and-conventions.md](scripts-and-conventions.md), [plugins-services-and-diagnostics.md](plugins-services-and-diagnostics.md)): move to public APIs before changing behavior.
- Put build flags in `gradle.properties` ([runtime-and-structure.md](runtime-and-structure.md)): centralize flags instead of scattering command-line or script defaults.
- Name the root project ([project-topology-and-build-logic.md](project-topology-and-build-logic.md)): set stable project identity in settings.
- Keep `gradle.properties` out of subprojects ([runtime-and-structure.md](runtime-and-structure.md)): move shared properties to the root, settings, convention plugins, or typed extensions.
- Avoid `afterEvaluate` ([providers-and-properties.md](providers-and-properties.md)): replace late mutation with lazy properties, providers, and plugin callbacks.

### Structure

- Modularize builds ([project-topology-and-build-logic.md](project-topology-and-build-logic.md)): split only around real ownership, reuse, or isolation boundaries.
- Do not put source files in the root project ([project-topology-and-build-logic.md](project-topology-and-build-logic.md)): keep the root as orchestration unless it is intentionally buildable.
- Prefer `build-logic` composite builds for build logic ([project-topology-and-build-logic.md](project-topology-and-build-logic.md)): move reusable conventions out of ad hoc root script blocks.
- Avoid empty projects created by accident ([project-topology-and-build-logic.md](project-topology-and-build-logic.md)): verify settings includes match real project directories.
- Use convention plugins ([scripts-and-conventions.md](scripts-and-conventions.md)): turn repeated script policy into named, testable build logic.

### Dependencies

- Use single GAV dependency notation ([dependency-policy.md](dependency-policy.md)): keep coordinates readable and put shared version ownership in catalogs, constraints, or platforms.
- Centralize versions with version catalogs ([dependency-version-governance.md](dependency-version-governance.md)): move repeated requested versions out of project scripts.
- Name version catalog entries consistently ([dependency-version-governance.md](dependency-version-governance.md)): choose aliases that survive module swaps and bundle changes.
- Declare repositories in settings ([dependency-repositories.md](dependency-repositories.md)): enforce repository policy before project scripts resolve anything.
- Avoid explicit Kotlin standard library dependencies ([dependency-policy.md](dependency-policy.md)): remove redundant stdlib declarations unless a deliberate Kotlin alignment owns them.
- Avoid redundant dependency declarations ([dependency-policy.md](dependency-policy.md)): delete duplicates or model them through constraints, platforms, or shared conventions.
- Use content filtering with multiple repositories ([dependency-repositories.md](dependency-repositories.md)): restrict each repository to the groups or modules it should serve.
- Apply exclusions narrowly ([dependency-resolution-rules.md](dependency-resolution-rules.md)): prefer scoped exclusions with evidence over broad graph rewrites.
- Model custom configurations for variant-aware matching ([dependency-variants-and-metadata.md](dependency-variants-and-metadata.md)): give participating producer and consumer configurations meaningful, aligned attributes.

### Tasks

- Avoid `dependsOn` as wiring ([task-execution-and-options.md](task-execution-and-options.md)): model inputs, outputs, artifacts, or buildable providers instead.
- Avoid consuming task outputs by raw paths ([task-execution-and-options.md](task-execution-and-options.md)): wire task providers or output properties so Gradle sees the producer-consumer relationship.
- Preserve task-output provider provenance ([providers-and-properties.md](providers-and-properties.md)): choose `map` or `flatMap` by output shape and keep the producer relationship attached.
- Prefer task cacheability annotations over ad hoc predicates ([build-cache-and-incremental.md](build-cache-and-incremental.md)): make cacheability explicit with task inputs and outputs.
- Group and describe custom tasks ([task-execution-and-options.md](task-execution-and-options.md)): make public task surfaces discoverable before adding options.
- Avoid hardcoded task names unless they are documented public API ([plugins-services-and-diagnostics.md](plugins-services-and-diagnostics.md)): prefer a plugin DSL, documented task type, or documented public task identifier.
- Avoid eager `Provider.get()` calls during configuration ([providers-and-properties.md](providers-and-properties.md)): keep values lazy through provider-aware APIs, and reserve an explicit `get()` bridge for the narrowly scoped derived task-output workaround in the owning reference.
- Do not access `Project` or other mutable Gradle model objects from task actions ([task-types-and-validation.md](task-types-and-validation.md)): copy required values into tracked task properties during configuration.
- Do not resolve configurations before task execution ([dependency-policy.md](dependency-policy.md)): wire files through providers, task inputs, or resolvable configurations owned by tasks.
- Avoid eager file collection APIs ([file-operations-and-archives.md](file-operations-and-archives.md)): keep file inputs lazy and task-owned.
- Choose path sensitivity deliberately ([task-types-and-validation.md](task-types-and-validation.md)): use none for path-irrelevant files and relative paths for relocatable directories.
- Use unique output files and directories ([task-types-and-validation.md](task-types-and-validation.md)): avoid overlapping outputs before tuning ordering or cache behavior.

### Performance

- Enable UTF-8 consistently ([jvm-and-tests.md](jvm-and-tests.md)): set compile and test encodings through shared JVM conventions.
- Use the build cache ([build-cache-and-incremental.md](build-cache-and-incremental.md)): verify cacheable inputs, outputs, normalization, and reproducibility.
- Use the configuration cache ([configuration-cache.md](configuration-cache.md)): fix configuration-time work before treating cache misses as infrastructure problems.
- Avoid expensive configuration-phase computation ([performance-strategy.md](performance-strategy.md)): defer filesystem, process, network, and dependency work into task actions or value sources.
- Prefer the `-bin` Gradle distribution ([wrapper-and-distributions.md](wrapper-and-distributions.md)): use `-all` only when IDE/source distribution needs justify it.

### Security

- Validate the Gradle distribution checksum ([ci-and-security.md](ci-and-security.md)): keep wrapper downloads pinned and verified.
- Validate the wrapper on every upgrade ([ci-and-security.md](ci-and-security.md)): review wrapper scripts and JAR changes with the wrapper version bump.

### Testing

- Test custom tasks and plugins with TestKit ([plugin-testing.md](plugin-testing.md)): cover build logic behavior through functional builds, not only unit tests.
- Separate test purposes ([jvm-and-tests.md](jvm-and-tests.md)): use JVM Test Suite or explicit `Test` tasks/source sets when dependencies, runtime environment, duration, or CI policy differs.
- Wire non-default test suites deliberately ([jvm-and-tests.md](jvm-and-tests.md), [plugin-testing.md](plugin-testing.md)): `shouldRunAfter` only orders work, and included `build-logic` tests do not run just because the root build uses build-logic artifacts.
- Prove cacheable TestKit behavior ([plugin-testing.md](plugin-testing.md), [build-cache-and-incremental.md](build-cache-and-incremental.md)): verify deterministic inputs, warm cache reuse, input changes, and relocatability when advertised.
