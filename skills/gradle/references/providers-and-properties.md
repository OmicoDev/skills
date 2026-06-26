# Gradle Providers And Properties

Read this when: Provider API, managed properties, conventions, lazy value transformations, `ObjectFactory`, domain object containers, or extension model design owns the work.

## Providers And Properties

- Treat `Provider<T>` as a read-only lazy recipe and `Property<T>` as configurable lazy state.
- Use `DirectoryProperty` and `RegularFileProperty` for filesystem values.
- Use `ListProperty<T>`, `SetProperty<T>`, and `MapProperty<K, V>` for collections.
- Use `map`, `flatMap`, and `zip` to transform values without realizing them.
- Use `convention(...)` for defaults and `set(...)` for explicit values.
- Use `orElse(...)` for lazy fallback.
- Avoid `.get()` during configuration unless the value is needed to create Gradle model objects and no provider-aware API exists.

## Finalization And Defaults

- Use `convention` for plugin defaults that users can override.
- Use `finalizeValueOnRead` when the first consumer should freeze the value.
- Use `disallowChanges` after the plugin has intentionally closed mutation.
- Use `forUseAtConfigurationTime` only for older Gradle compatibility work; in modern builds prefer proper configuration inputs and providers.
- Do not finalize extension values before all intended conventions have had a chance to apply.

## Managed Model

- Prefer managed properties over plain mutable fields when tasks consume values.
- Use `ObjectFactory` to create managed objects, file properties, collection properties, and named containers.
- Use nested managed types for structured extension DSLs.
- Use domain object containers when users need named DSL elements.
- Use `named`, `register`, and `configureEach` with domain collections.

## Service Injection

- Inject only supported public Gradle services; internal services are unstable even when injection appears to work.
- Use `ProjectLayout` for project-owned paths and `BuildLayout` for settings-owned root/settings directories.
- Use `ProviderFactory` for Gradle properties, system properties, environment, and provider-backed external values.
- Use `FileSystemOperations`, `ArchiveOperations`, and `ExecOperations` inside tasks or workers instead of reaching through `Project`.
- Constructor injection is explicit. Property injection defers service creation until the getter is called.

## Extension To Task Wiring

- Let extensions expose intent and tasks perform work.
- Map extension properties to task properties lazily.
- Keep default conventions close to the plugin that owns the model.
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

Primary upstream pages: Properties and Providers, Gradle Managed Types, Lazy Configuration, Binary Plugins.
