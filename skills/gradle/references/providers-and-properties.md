# Gradle Providers And Properties

Read this when: Provider API, managed properties, conventions, lazy value transformations, `ObjectFactory`, domain object containers, or extension model design owns the work.

## Providers And Properties

- Treat `Provider<T>` as a read-only lazy recipe and `Property<T>` as configurable lazy state.
- Use `DirectoryProperty` and `RegularFileProperty` for filesystem values.
- Use `ListProperty<T>`, `SetProperty<T>`, and `MapProperty<K, V>` for collections.
- Use `map`, `flatMap`, and `zip` to transform values without realizing them.
- Use `convention(...)` for defaults and `set(...)` for explicit values.
- Use `orElse(...)` for lazy fallback.
- Avoid `.get()` during configuration unless the value is needed to create Gradle model objects and no provider-aware API exists. `map`/`flatMap` preserve late value resolution and implicit task dependency wiring.
- Use provider-backed process/environment/system/Gradle-property reads when configuration cache should track the value.

## Finalization And Defaults

- Use `convention` for plugin defaults that users can override.
- Prefer conventions set by the plugin that owns the model. Constructor conventions are a compatibility bridge for public existing types that may be used without the owning plugin.
- Use `finalizeValueOnRead` when the first consumer should freeze the value.
- Use `disallowChanges` after the plugin has intentionally closed mutation.
- Use `forUseAtConfigurationTime` only for older Gradle compatibility work; in modern builds prefer proper configuration inputs and providers.
- Do not finalize extension values before all intended conventions have had a chance to apply.
- Do not simulate conventions with `isPresent`, `getOrElse`, or ad hoc fallback reads when another owner could still attach a real convention.
- Replace `afterEvaluate`-style delayed reads with conventions and provider wiring. Use fail-fast validation or final-state logging callbacks only when no lazy model API can own the behavior.

## Managed Model

- For new task, extension, or domain object APIs, expose managed lazy properties when users configure the value or tasks consume it.
- Prefer fully managed interfaces or abstract classes with abstract getters; let Gradle generate property implementations for clean-sheet types.
- Use `ObjectFactory` to create managed objects, file properties, collection properties, and named containers so Gradle decorations and Groovy DSL behavior are applied.
- Use `@Nested` managed objects for structured DSL values that share the owner lifecycle.
- Use domain object containers when users need named DSL elements; use `named`, `register`, and `configureEach` with domain collections.
- Manual `Property` fields are a compatibility fallback for existing public implementation classes, not a clean-sheet default.

## When Not To Use Lazy Types

- Do not use `Provider` or `Property` for immutable identity, non-calculated constants, or values that cannot be changed.
- Do not use `Property<NestedType>` for a nested managed object with the same lifecycle as its owner; model it as `@Nested NestedType`.
- Do not wrap a constant in `project.provider { ... }` when no deferred calculation or Gradle-tracked input exists.
- Do not add setters that accept `Provider`; expose a `Property<T>` and let callers wire providers into it.
- Do not add new plain getter/setter properties to tasks, extensions, or domain objects unless preserving an existing public API requires a bridge.

## Service Injection

- Inject only supported public Gradle services; internal services are unstable even when injection appears to work.
- Use `ProjectLayout` for project-owned paths and `BuildLayout` for settings-owned root/settings directories.
- Use `ProviderFactory` for Gradle properties, system properties, environment, and provider-backed external values.
- Use `FileSystemOperations`, `ArchiveOperations`, and `ExecOperations` inside tasks or workers instead of reaching through `Project`.
- Constructor injection is explicit. Property injection defers service creation until the getter is called.

## Extension To Task Wiring

- Let extensions expose intent and tasks perform work.
- Map extension properties to task properties lazily.
- React to plugins with `plugins.withId(...)` before wiring plugin-owned model elements.

## Container Design

- Use named containers when users need multiple configured elements.
- Use polymorphic containers when element types carry different behavior.
- Prefer stable element names because they become DSL and diagnostics surface.
- Configure container elements lazily with `configureEach`.
- Avoid reading all container elements just to create one aggregate task; wire providers or outgoing variants instead.

## Common Mistakes

- Modeling extension values as plain `var` fields.
- Passing a mutable extension object into a task action.
- Eagerly iterating containers with `all` or `getByName`.
- Creating ad hoc `MutableList` or `Map` fields where a Gradle container would preserve lazy DSL ownership.
- Converting file providers to raw `File` too early.

## Source Calibration

Primary upstream pages: Properties and Providers, Gradle Managed Types, Lazy Configuration, Binary Plugins. Local architecture docs: ADR-0006 Use of Provider APIs in Gradle.
