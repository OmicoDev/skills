# Gradle Compatibility Matrix

Read this when: Gradle version compatibility is involved but the exact owner is not yet clear.

## First Choice

- Read [compatibility-version-snapshots.md](compatibility-version-snapshots.md) when comparing a Gradle release against Java, Kotlin, Groovy, or Android Gradle Plugin ranges.
- Read [compatibility-java.md](compatibility-java.md) when deciding whether a Java version can run Gradle, work only as a toolchain, or explain Java/class-file symptoms.
- Read [compatibility-kotlin.md](compatibility-kotlin.md) when embedded Kotlin, Kotlin DSL compilation, Kotlin language level, or Gradle/Kotlin version mapping is the owner.
- Read [ecosystem-integrations.md](ecosystem-integrations.md) or [plugin-testing.md](plugin-testing.md) when Tooling API, IDE import, `GradleRunner`, or TestKit cross-version behavior is the compatibility surface.
- Read [runtime-and-structure.md](runtime-and-structure.md) when OS, architecture, filesystem, or file-watching support decides whether Gradle itself is supported on the host.

## Use Pattern

- Read the wrapper version first, then choose the matching compatibility page.
- Use `https://services.gradle.org/versions/current` to identify the latest final Gradle release; use compatibility pages to identify supported Java/Kotlin/Groovy/AGP ranges.
- Do not assume the API current version already has a published versioned compatibility page; verify the URL before citing it.
- Use `current` when choosing an upgrade target; use the wrapper-specific page for legacy diagnosis: `https://docs.gradle.org/<gradle-version>/userguide/compatibility.html`.
- The current Java table is cumulative history. Kotlin, Groovy, AGP, and platform tested ranges are page-local, so compare the current wrapper page with the target wrapper page.
- Keep Gradle runtime JVM, Java toolchains, embedded Kotlin, Kotlin Gradle Plugin, AGP, Android Studio, and IDE Tooling API as separate compatibility surfaces.
- If a version is absent from a matrix, treat it as untested, not impossible, and prove support with representative wrapper tasks.

## Cross-Surface Rules

- Wrapper, Gradle client, Tooling API client, and TestKit client may run on older JVMs than the Gradle daemon they launch.
- Tooling API/TestKit compatibility is not just the wrapper matrix: the client library supports target Gradle releases from the last five major lines and current/next major forward, while daemon JVM requirements and serialized `BuildAction` or fixture bytecode still follow the target Gradle range.
- Target-platform compatibility is about the host Gradle runtime and file watching, not project output targets; route native cross-compilation or `targetMachines` to [ecosystem-integrations.md](ecosystem-integrations.md).
- Do not infer KGP, Compose compiler, KSP, KAPT, AGP, or Android Studio support from the embedded Kotlin table.
- Beta, RC, and alpha versions in tested ranges are not release promises.
