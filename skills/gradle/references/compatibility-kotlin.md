# Gradle Kotlin Compatibility

Read this when: embedded Kotlin, Kotlin DSL compilation, Kotlin language level, or Gradle/Kotlin version mapping is the deciding factor.

## Embedded Kotlin Relation

| Embedded Kotlin | Minimum Gradle | Language |
| --- | --- | --- |
| 1.3.10 | 5.0 | 1.3 |
| 1.3.11 | 5.1 | 1.3 |
| 1.3.20 | 5.2 | 1.3 |
| 1.3.21 | 5.3 | 1.3 |
| 1.3.31 | 5.5 | 1.3 |
| 1.3.41 | 5.6 | 1.3 |
| 1.3.50 | 6.0 | 1.3 |
| 1.3.61 | 6.1 | 1.3 |
| 1.3.70 | 6.3 | 1.3 |
| 1.3.71 | 6.4 | 1.3 |
| 1.3.72 | 6.5 | 1.3 |
| 1.4.20 | 6.8 | 1.3 |
| 1.4.31 | 7.0 | 1.4 |
| 1.5.21 | 7.2 | 1.4 |
| 1.5.31 | 7.3 | 1.4 |
| 1.6.21 | 7.5 | 1.4 |
| 1.7.10 | 7.6 | 1.4 |
| 1.8.10 | 8.0 | 1.8 |
| 1.8.20 | 8.2 | 1.8 |
| 1.9.0 | 8.3 | 1.8 |
| 1.9.10 | 8.4 | 1.8 |
| 1.9.20 | 8.5 | 1.8 |
| 1.9.22 | 8.7 | 1.8 |
| 1.9.23 | 8.9 | 1.8 |
| 1.9.24 | 8.10 | 1.8 |
| 2.0.20 | 8.11 | 1.8 |
| 2.0.21 | 8.12 | 1.8 |
| 2.2.0 | 9.0.0 | 2.2 |
| 2.2.20 | 9.2.0 | 2.2 |
| 2.2.21 | 9.3.0 | 2.2 |
| 2.3.0 | 9.4.0 | 2.2 |
| 2.3.20 | 9.5.0 | 2.2 |
| 2.3.21 | 9.6.0 | 2.2 |

## Diagnostic Rules

- Embedded Kotlin affects Kotlin DSL script compilation, Kotlin DSL APIs, and Gradle plugins compiled against Gradle's Kotlin DSL. It is not the Kotlin Gradle Plugin version used for project source.
- On Gradle 9+, Kotlin DSL scripts and Kotlin build logic use Kotlin language level 2.2; replace script-instance labels such as `this@Build_gradle`, `this@Settings_gradle`, or `this@Init_gradle` with `project`, `settings`, or `gradle` when they mean the script target.
- On Gradle 9+, `kotlinDslPluginOptions.jvmTarget` is removed; configure the Java toolchain or JVM target for `kotlin-dsl` build logic through toolchain APIs instead of Kotlin DSL plugin options.
- Plugins built and published with the `kotlin-dsl` plugin on Gradle 9 require consumer Gradle 8.11+ unless the plugin explicitly compiles against an earlier Kotlin 1.x language/API level.
- On Gradle 9+, public Gradle APIs use JSpecify nullability; Kotlin build-logic errors around `Provider<T>`, `Property<T>`, or Gradle API maps often need non-null generic bounds or non-null value types, not suppression or looser casts.
- Kotlin DSL failures after a Gradle upgrade can come from embedded Kotlin, script accessors, third-party plugins, or build logic classpaths.
- Build logic projects that apply `kotlin-dsl` or `embedded-kotlin` should let Gradle control the `kotlin-dsl` plugin and embedded Kotlin/KGP alignment; applying another KGP version or adding different Kotlin stdlib/reflect versions in the same project can cause Kotlin DSL and precompiled script plugin incompatibilities.
- Precompiled Kotlin script plugin accessor generation depends on Gradle's Kotlin compiler arguments; append to `freeCompilerArgs` instead of reassigning it, because dropping Gradle's script-template arguments breaks plugin-block and accessor compilation.
- Gradle 7.x and 8.0 pages list Gradle version first for embedded Kotlin; 9.x/current pages list embedded Kotlin first. Normalize both to the table above.
- Do not infer KGP, Compose compiler, KSP, KAPT, AGP, or Android Studio support from the embedded Kotlin table.
- Beta and RC Kotlin versions in Gradle's tested range are not release promises.
