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
- Kotlin DSL failures after a Gradle upgrade can come from embedded Kotlin, script accessors, third-party plugins, or build logic classpaths.
- Gradle 7.x and 8.0 pages list Gradle version first for embedded Kotlin; 9.x/current pages list embedded Kotlin first. Normalize both to the table above.
- Do not infer KGP, Compose compiler, KSP, KAPT, AGP, or Android Studio support from the embedded Kotlin table.
- Beta and RC Kotlin versions in Gradle's tested range are not release promises.
