# Gradle Providers And Properties

Read this when: Provider API, managed properties, conventions, lazy value transformations, `ObjectFactory`, domain object containers, service injection, or extension model design owns the work.

## Providers And Properties

- Treat `Provider<T>` as a read-only lazy recipe and `Property<T>` as configurable lazy state.
- Use `DirectoryProperty` and `RegularFileProperty` for filesystem values.
- Derive child paths with `DirectoryProperty.dir(...)` and `DirectoryProperty.file(...)` so later changes to the base directory still flow through.
- Use `ListProperty<T>`, `SetProperty<T>`, and `MapProperty<K, V>` for collections.
- Use `map`, `flatMap`, `zip`, and `orElse` to transform or fall back without realizing values.
- Use `convention(...)` for defaults and `set(...)` for explicit values.
- Wiring a task output provider into another task input preserves the producing task relationship and can create the implicit task dependency; converting to raw `File`, `String`, or collection values too early loses that wiring.
- Do not implement `Provider`, `Property`, or their subtypes yourself; obtain instances from Gradle factories, layouts, tasks, or other model objects.
- Expose `Property` and `Provider` objects directly through getters; wrapper getters/setters that call `.get()` or `.set(...)` hide lazy wiring.
- Avoid `.get()` during configuration unless the value is needed to create Gradle model objects and no provider-aware API exists. `map`/`flatMap` preserve late value resolution and implicit task dependency wiring.
- Use provider-backed process/environment/system/Gradle-property reads when configuration cache should track the value.
- `providers.gradleProperty(...)` reads build-level sources such as `-P`, `org.gradle.project.*`, `ORG_GRADLE_PROJECT_*`, and user/root/installation `gradle.properties`; it does not read subproject `gradle.properties` files or dynamic extra properties.
- Prefer built-in provider factories over `ProviderFactory.provider(Callable)`; use a callable provider only when no typed factory models the value source.

## External Value Providers

- Use `providers.systemProperty(...)`, `providers.environmentVariable(...)`, `providers.fileContents(...)`, `providers.exec(...)`, and `providers.javaexec(...)` when configuration needs those values tracked.
- Use prefix provider APIs when a real policy depends on a whole property or environment namespace; adding a matching key will invalidate configuration cache entries.
- Use `ValueSource` when built-in providers are too small for complex environment, file, process, or network-derived values. Gradle tracks the returned value, not every read inside `obtain()`.
- Keep `ValueSource.obtain()` fast and return effectively immutable values because queried value sources run on every build to decide configuration-cache reuse.

## Finalization And Defaults

- Use `convention` for plugin defaults users can override, and `set`/`setFrom` for project-specific values that should win.
- Prefer conventions set by the plugin that owns the model. Constructor conventions are a compatibility bridge for public existing types that may be used without the owning plugin.
- `finalizeValue()` queries any backing provider immediately and freezes the current value; use it only when eager finalization is intentional.
- Use `finalizeValueOnRead` when the first consumer should freeze the value.
- Use `disallowChanges` after the plugin has intentionally closed mutation.
- Task properties are finalized automatically when the task starts execution; explicit finalization is for closing plugin or model lifecycle earlier than execution.
- Use `forUseAtConfigurationTime` only for older Gradle compatibility work; in modern builds prefer proper configuration inputs and providers.
- Do not finalize extension values before all intended conventions have had a chance to apply.
- Do not simulate conventions with `isPresent`, `getOrElse`, or ad hoc fallback reads when another owner could still attach a real convention.
- Replace `afterEvaluate`-style delayed reads with conventions and provider wiring. Use fail-fast validation or final-state logging callbacks only when no lazy model API can own the behavior.

## Managed Model

- For new task, extension, or domain object APIs, expose managed lazy properties when users configure the value or tasks consume it.
- Prefer fully managed interfaces or abstract classes with abstract public or protected getters, no property setters, and no fields; let Gradle generate property implementations for clean-sheet types.
- Use `ObjectFactory` to create managed objects, file properties, collection properties, and named containers so Gradle decorations and Groovy DSL behavior are applied.
- Use `@Nested` managed objects for structured DSL values that share the owner lifecycle.
- Use `Property<NestedType>` instead of an `@Nested` getter when the nested value has a different lifecycle or should be replaceable as a value.
- For named DSL elements, implement `Named` or expose an abstract read-only `name`; named managed types fit `NamedDomainObjectContainer` element models.
- Use domain object containers when users need named DSL elements; use `named`, `register`, and `configureEach` with domain collections.
- Manual `Property` fields are a compatibility fallback for existing public implementation classes, not a clean-sheet default.

## When Not To Use Lazy Types

- Do not use `Provider` or `Property` for immutable identity, non-calculated constants, or values that cannot be changed.
- Do not use `Property<NestedType>` for a nested managed object with the same lifecycle as its owner; model it as `@Nested NestedType`.
- Do not wrap a constant in `project.provider { ... }` when no deferred calculation or Gradle-tracked input exists.
- Do not add setters that accept `Provider`; expose a `Property<T>` and let callers wire providers into it.
- Do not add new plain getter/setter properties to tasks, extensions, or domain objects unless preserving an existing public API requires a bridge.
- When migrating a stable getter/setter API, add a provider-backed property, deprecate the old accessors, and wire the bridge into the new property.

## Service Injection

- Inject only supported public Gradle services; internal services are unstable even when injection appears to work.
- Service availability is scope-specific. Use `ProjectLayout` for project-owned paths and `BuildLayout` for settings-owned root/settings directories.
- Use `ProviderFactory` for Gradle properties, system properties, environment, and provider-backed external values.
- `systemProp.*` entries are read from the root project's `gradle.properties`; do not hide system properties in subproject `gradle.properties`.
- Use `FileSystemOperations`, `ArchiveOperations`, and `ExecOperations` inside tasks or workers instead of reaching through `Project`.
- Route lifecycle-result work, `FlowScope`, and `FlowProviders` to [build-services-and-lifecycle.md](build-services-and-lifecycle.md).
- Constructor injection is explicit. Property injection defers service creation until the getter is called.
- Gradle injects services only into Gradle-created instances. Use managed types, task/plugin construction, or `ObjectFactory.newInstance(...)`; a plain `new` instance will not receive injected services.
- Property injection getters should be public or protected and abstract when possible; Gradle discards dummy method bodies, so keep logic out of injected service getters.
- If an ad hoc script task needs `ObjectFactory.newInstance(...)` only to obtain injectable services, consider extracting a typed task or plugin.

## Extension To Task Wiring

- Let extensions expose intent and tasks perform work; map extension properties to task properties lazily.
- React to plugins with `plugins.withId(...)` before wiring plugin-owned model elements.

## Container Design

- Use named containers when users need multiple configured elements, and polymorphic containers when element types carry different behavior.
- Prefer stable element names because they become DSL and diagnostics surface.
- Configure container elements lazily with `configureEach`.
- Avoid reading all container elements just to create one aggregate task; wire providers or outgoing variants instead.

## Common Mistakes

- Modeling extension values as plain `var` fields or passing mutable extension objects into task actions.
- Eagerly iterating containers with `all` or `getByName`.
- Creating ad hoc `MutableList` or `Map` fields where a Gradle container would preserve lazy DSL ownership.
- Converting file providers to raw `File` too early.

## Source Calibration

Primary upstream pages: Properties and Providers, Gradle Managed Types, Services and Service Injection, Lazy Configuration, Configuration Cache Requirements, Binary Plugins. Local architecture docs: ADR-0006 Use of Provider APIs in Gradle.
