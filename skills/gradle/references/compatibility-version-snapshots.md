# Gradle Version Compatibility Snapshots

Read this when: comparing specific Gradle releases against Java runtime, tested Kotlin, embedded Kotlin, Groovy, or Android Gradle Plugin support.

## Version API Check

- Latest final Gradle: query `https://services.gradle.org/versions/current`.
- Latest stable per major: query `https://services.gradle.org/versions/all` and ignore entries where `snapshot`, `nightly`, `releaseNightly`, `broken`, or `rcFor` are set.
- Current compatibility snapshot uses Gradle docs version `9.6.1`. When citing published docs, still verify that the versioned compatibility page exists.

## Gradle 9.6.1

- Java: Gradle runtime JVM 17 through 26; JVM 27+ is not yet supported.
- Kotlin: tested Kotlin 2.0.0 through 2.4.0-RC; embedded Kotlin 2.3.21; Kotlin language version 2.2. The embedded Kotlin table lists 2.3.21 with minimum Gradle `9.6.0`, so treat this as the 9.6.x compatibility row unless a later compatibility page changes it.
- Groovy: tested Groovy 1.5.8 through 5.0.2; Groovy-based Gradle plugins must use Groovy 4.x.
- Android Gradle Plugin: tested AGP 9.0 through 9.3.0-alpha06.

## Gradle 8.14.5

- Java: Gradle runtime JVM 8 through 24; daemon execution with JVM 16 or earlier is deprecated and becomes an error in Gradle 9.
- Kotlin: tested Kotlin 1.6.10 through 2.1.20-RC3; embedded Kotlin 2.0.21; Kotlin language version 1.8.
- Groovy: tested Groovy 1.5.8 through 4.0.0; Groovy-based Gradle plugins must use Groovy 3.x.
- Android Gradle Plugin: tested AGP 7.3 through 8.13.

## Gradle 7.6.6

- Java: Gradle runtime Java 8 through 19; Java 20+ is not supported for running Gradle.
- Kotlin: tested Kotlin 1.3.72 through 1.7.10; embedded Kotlin 1.7.10; Kotlin language version 1.4; Kotlin-based Gradle plugins target Kotlin 1.4.
- Groovy: tested Groovy 1.5.8 through 4.0.0; Groovy-based Gradle plugins must use Groovy 3.x.
- Android Gradle Plugin: tested AGP 4.1, 4.2, and 7.0 through 7.4.

## Gradle 6.9.4

- Java: Gradle runtime Java 8 through 15; Java 16+ is not supported for running Gradle; Java 16 can be used for compile/test via toolchains.
- Kotlin: tested Kotlin 1.3.21 through 1.4.20; embedded Kotlin 1.4.20 with language version 1.3 inferred from the current cumulative embedded Kotlin table.
- Groovy: tested Groovy 1.5.8 through 2.5.12.
- Android Gradle Plugin: tested AGP 3.4, 3.5, 3.6, 4.0, 4.1, and 4.2.
