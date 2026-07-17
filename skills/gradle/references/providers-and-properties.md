# Gradle Providers And Properties

Read this when: Provider API, managed properties, conventions, lazy value transformations, project or Gradle property lookup, extra properties, `ObjectFactory`, domain object containers, service injection, or extension model design owns the work.

## Providers And Properties

- Treat `Provider<T>` as a read-only lazy recipe and `Property<T>` as configurable lazy state.
- Use `DirectoryProperty` and `RegularFileProperty` for filesystem values.
- Derive child paths with `DirectoryProperty.dir(...)` and `DirectoryProperty.file(...)` so later changes to the base directory still flow through.
- Use `ListProperty<T>`, `SetProperty<T>`, and `MapProperty<K, V>` for scalar collections; use `ConfigurableFileCollection` or `ConfigurableFileTree` when users need to add file inputs lazily.
- Use `map`, `flatMap`, `zip`, `filter`, and `orElse` to transform, combine, filter, or fall back without realizing values; absent inputs skip transforms, `null` transform results become absent, and `zip` is absent when either side is absent.
- Use `convention(...)` for defaults and `set(...)` for explicit values.
- Wiring a task output provider into another task input preserves the producing task relationship and can create the implicit task dependency; converting to raw `File`, `String`, or collection values too early loses that wiring.
- Use `getLocationOnly()` only when a downstream input needs the file-system location but not the produced content; it deliberately drops producer dependency information.
- Do not implement `Provider`, `Property`, or their subtypes yourself; obtain instances from Gradle factories, layouts, tasks, or other model objects.
- Expose `Property` and `Provider` objects directly through getters; wrapper getters/setters that call `.get()` or `.set(...)` hide lazy wiring.
- Avoid `.get()`, `getOrNull`, `getOrElse`, and `isPresent` branching during configuration unless the value is needed to create Gradle model objects and no provider-aware API exists; provider chains preserve late value resolution and implicit task dependency wiring.
- Use provider-backed process, environment, system-property, Gradle-property, file-content, and credential reads when configuration cache should track the value.
- `providers.gradleProperty(...)` reads lazy build-level values in descending precedence from `-P`, `org.gradle.project.*` system properties, `ORG_GRADLE_PROJECT_*` environment variables, and user-home, build-root, then Gradle-installation `gradle.properties`; it does not read subproject `gradle.properties` files, dynamic extra properties, extensions, tasks, or ancestor projects.
- In Gradle 9.x, `project.findProperty(...)`, `project.property(...)`, and `project.hasProperty(...)` search the current `Project` bean, current extra properties including unmapped project-scoped Gradle properties, an extension, then a task; a missing value returns `null`, throws, or returns `false`, respectively.
- In Gradle 9.x, the ancestor leg is conditional: Vintage builds continue through ancestor extra properties and extensions only while implicit parent lookup is enabled, whereas Isolated Projects omit it and Gradle 9.6's `NO_IMPLICIT_LOOKUP_IN_PARENT_PROJECTS` feature preview disables it. Pre-9 Gradle distributions that expose the legacy `Convention` API can also resolve properties contributed through that object after extensions in the current and inherited scopes. Use the version- and mode-specific order diagnostically, and remove reliance on ancestor lookup as described in [scripts-and-conventions.md](scripts-and-conventions.md).
- The Kotlin DSL `project.extra` accessor, Groovy `project.ext`, and `project.extensions.extraProperties` expose only the current project's extra properties; an explicit extra assignment shadows an unmapped loaded Gradle property of the same name inside that scope, but it cannot override a value already mapped to the `Project` bean because dynamic lookup checks the bean first. Extra-property access does not search bean properties, extensions, tasks, or ancestors; prefer providers for build-environment inputs and keep extra properties for intentional script-local or legacy state.
- Use `ProviderFactory.provider(Callable)` only when no typed provider or existing provider can model the value; for environment, system properties, files, processes, credentials, and other external state, prefer typed `ProviderFactory` APIs or `ValueSource` so configuration-cache inputs are intentional.

## External Value Providers

- Use `providers.systemProperty(...)`, `providers.environmentVariable(...)`, `providers.fileContents(...)`, `providers.exec(...)`, `providers.javaexec(...)`, and `providers.credentials(...)` when configuration or task inputs need those values tracked; attach credentials providers to task inputs so required secrets are validated only when that task runs.
- Use prefix provider APIs when a real policy depends on a whole property or environment namespace; adding a matching key will invalidate configuration cache entries.
- Use `ValueSource` when built-in providers are too small for complex environment, file, process, or network-derived values. Gradle tracks the returned value, not every read inside `obtain()`.
- Model custom `ValueSourceParameters` as interfaces with property-like getters; put cache-significant inputs in parameters and let Gradle supply `getParameters()` instead of implementing it.
- Keep `ValueSource.obtain()` fast and return effectively immutable values because queried value sources run on every build to decide configuration-cache reuse.

## Finalization And Defaults

- Use `convention` for plugin defaults users can override, and `set`/`setFrom` for project-specific values that should win.
- `Property.set(null)` discards an explicit value and can reveal the convention again; `set(provider)` with an absent provider makes the property absent regardless of any convention.
- Prefer conventions set by the plugin that owns the model. Constructor conventions are a compatibility bridge for public existing types that may be used without the owning plugin.
- `finalizeValue()` queries any backing provider immediately, replaces the provider link with the current value, and freezes the property; use it only when eager finalization and loss of later provider updates are intentional.
- Use `finalizeValueOnRead` when the first consumer should lazily freeze the value and every later consumer must see the same result.
- Use `disallowChanges` after the plugin has intentionally closed mutation.
- Use `disallowUnsafeRead` when a property must reject configuration-time reads until the owning lifecycle is ready; the first allowed read finalizes the value and can finalize upstream provider-backed properties.
- Task properties are finalized automatically when the task starts execution; explicit finalization is for closing plugin or model lifecycle earlier than execution.
- Use `forUseAtConfigurationTime` only for older Gradle compatibility work; in modern builds prefer proper configuration inputs and providers.
- Do not finalize extension values before all intended conventions have had a chance to apply.
- Do not simulate conventions with `isPresent`, `getOrElse`, or ad hoc fallback reads when another owner could still attach a real convention.
- Replace `afterEvaluate`-style delayed reads with conventions and provider wiring; do not call `getOrElse` just because users may configure a value later. Keep `afterEvaluate` for final validation or logging only when no lazy model API can own the behavior, and treat true wiring gaps as Gradle API gaps rather than plugin design primitives.

## Managed Model

- For new task, extension, or domain object APIs, expose managed lazy properties when users configure the value or tasks consume it.
- Prefer fully managed interfaces or abstract classes with abstract public or protected getters, no property setters, and no fields; for public task/plugin APIs, expose rich properties through abstract getters returning `Provider`, `Property`, collection properties, or `ConfigurableFileCollection`.
- Use `ObjectFactory` to create managed objects, file properties, collection properties, and named containers so Gradle decorations and Groovy DSL behavior are applied.
- Use `ObjectFactory.domainObjectContainer(...)` or managed container properties instead of deprecated `Project.container(...)`; the factory-created container decorates elements and makes them extension-aware.
- Use `@Nested` managed objects for structured DSL values that share the owner lifecycle.
- Use `Property<NestedType>` instead of an `@Nested` getter when the nested value has a different lifecycle or should be replaceable as a value.
- For named DSL elements, implement `Named` or expose an abstract read-only `name`; named managed types fit `NamedDomainObjectContainer` element models.
- Use `NamedDomainObjectContainer` when the DSL should create and manage named elements; use `NamedDomainObjectSet` or `NamedDomainObjectList` when elements are created elsewhere and only collected.
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
- Service availability is scope-specific. Use `ProjectLayout` for project-owned paths, `BuildLayout` for settings-owned directories, `DependencyFactory` for plugin-created dependencies, and only documented public services for the current task/plugin/settings/worker scope.
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
- Prefer stable element names because they become DSL and diagnostics surface; treat element names as immutable identity, not provider-derived state.
- Configure container elements lazily with `named`, `register`, and `configureEach`.
- Avoid reading all container elements just to create one aggregate task; wire providers or outgoing variants instead.

## Common Mistakes

- Modeling extension values as plain `var` fields or passing mutable extension objects into task actions.
- Eagerly iterating containers with `all`, `getByName`, `findByName`, or action-style `withType(...)`.
- Creating ad hoc mutable collections where a Gradle container would preserve lazy DSL ownership, or converting file providers to raw `File` too early.
