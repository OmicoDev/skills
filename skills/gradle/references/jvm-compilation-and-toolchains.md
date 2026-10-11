# Gradle JVM Compilation And Toolchains

Read this when: Java/Kotlin/Groovy/Scala build authoring, source sets, Java toolchains, JVM compilation, generated sources, or generated API documentation owns the task.

Read [jvm-testing-and-quality.md](jvm-testing-and-quality.md) when test execution, test suites, fixtures, report aggregation, JaCoCo, or JVM quality plugins own the task.

## JVM Plugin Boundaries

- `java` owns source sets, compile/test/jar lifecycle, and standard JVM configurations.
- `java-library` adds API/implementation separation and API variants.
- `java-platform` publishes dependency constraints, not ordinary compiled classes.
- `application` applies Java plus Distribution, treats `main` as the runnable JVM application, and owns `run`, `startScripts`, `installDist`, `distZip`, and `distTar`.
- Kotlin, Groovy, Scala, Android, and external JVM plugins add their own task and source-set layers; identify which plugin owns the model before patching.
- The Kotlin Gradle Plugin adds the Kotlin standard library to each source set by default; do not declare `kotlin-stdlib` explicitly unless the build disables that default or owns a deliberate stdlib version policy.
- Groovy projects still need an explicit Groovy dependency on the source set that uses Groovy; avoid `localGroovy()` for application code unless coupling to Gradle's bundled Groovy version is intentional.
- On Gradle 8.13+, prefer the incubating `scala { scalaVersion = ... }` property so Gradle adds the Scala standard library to each source set and supplies compiler classpaths; if inferring classpaths from dependencies, Scala 2 needs `scala-library`, Scala 3 needs `scala3-library_3`, and `scalaClasspath`/`zinc` remain compiler-tool inputs, not application dependencies.

## Toolchains

- Read [compatibility-java.md](compatibility-java.md) when deciding whether a Java version can run Gradle or is only safe as a toolchain target for the selected Gradle version; read [runtime-and-structure.md](runtime-and-structure.md) when Daemon JVM criteria, `org.gradle.java.home`, `JAVA_HOME`, or client startup owns the issue.
- The Gradle runtime JVM runs Gradle and plugins; Java toolchains select JVMs for compile, test, javadoc, and custom Java tool tasks.
- Toolchain coverage differs by JVM plugin: Java covers compile, test, and Javadoc; Groovy covers compilation and, on Gradle 9.7+, Groovydoc; Scala covers compilation and Scaladoc. Groovydoc on earlier Gradle versions still runs on the Gradle runtime JVM.
- Prefer toolchains over `JAVA_HOME`, IDE Gradle JVM settings, or `sourceCompatibility`/`targetCompatibility` alone; IDE settings choose how Gradle is launched inside the IDE, not the project compile/test toolchain.
- Toolchains choose the JDK; they do not prevent accidental use of newer Java APIs. Use `--release` for Java API targeting when compiling Java sources for older platforms.
- When it can identify the Scala library version, Gradle 9.7.1 `ScalaCompile` derives target or release flags from the configured toolchain, or targets Java 8 bytecode with the fallback toolchain; explicit Scala compiler output flags override Gradle's selection, and older Scala versions may require a lower toolchain or explicit target.
- When constraining a `JavaToolchainSpec` by vendor or VM implementation, also set `languageVersion`; invalid specs fail from Gradle 8.0 onward. An empty spec selects the current Gradle JVM, not a reproducible project toolchain.
- The incubating `nativeImageCapable` filter requires Gradle 8.14+. Set `languageVersion` with it: in 9.7.1, setting only `nativeImageCapable = true` falls back to the current JVM without enforcing native-image capability. Leaving the filter unset or false does not exclude native-image-capable JDKs.
- Diagnose with `./gradlew -q javaToolchains` when available in the build; the report shows detection source, metadata, auto-detection/download state, and invalid installations.
- Configure toolchain resolver plugins and toolchain repositories in settings when auto-provisioning is allowed. Repository order decides which matching JDK is downloaded first; auto-provisioning downloads only GA JDKs when no detected toolchain matches and never updates already-provisioned JDKs.
- In Gradle 9.7.1, reusing an auto-provisioned JDK with auto-download enabled but no toolchain repositories configured emits a deprecation warning with a planned Gradle 10 failure. Keep the resolver/repository settings reproducible on fresh machines; an already-downloaded JDK can conceal missing provisioning configuration.
- Custom `fromEnv` and `paths` locations extend the detected candidate set instead of taking priority. In Gradle 9.7.1, missing locations or entries without `bin/java` are skipped, with warnings for explicitly configured locations and `--info` diagnostics for auto-detected locations. Among matching candidates, precedence prefers the current Gradle JVM, JDKs over JREs, known-vendor order, higher versions, then path ordering.
- Stop daemons after changing toolchain locations, auto-detection, auto-download, resolver plugins, or provisioning policy so cached JVM metadata cannot mask the new configuration.
- For custom Java tasks, expose `JavaCompiler`, `JavaLauncher`, or `JavadocTool` providers, or lazily map their executable/home paths into `RegularFileProperty` or `DirectoryProperty`; avoid eager `.get()` during configuration.
- Mark custom task toolchain tool properties as `@Nested` inputs so launcher, compiler, or javadoc tool changes participate in validation, up-to-date checks, and cache keys.

## API Documentation

- The Java plugin registers `Javadoc` through the main JVM feature, and additional registered JVM features own Javadoc tasks for their backing source sets; a bare custom source set has no automatic Javadoc task. Task names, `allJava` sources, output-plus-compile classpaths, and module-path inference follow the backing source set and Java extension rather than the feature name alone.
- Prefer the `javadocTool` provider from `JavaToolchainService`; Gradle validates a legacy `executable` override against the selected toolchain, so do not combine paths from different JDKs.
- `failOnError = false` ignores Javadoc tool failures; keep the default failure behavior for published or verified documentation so a failed tool invocation cannot silently leave incomplete output.
- On Gradle 9.7+, the Groovy plugin defaults `Groovydoc` to the project's Java toolchain; tasks without that plugin default to the current Gradle JVM unless `javaLauncher` is configured. Groovydoc runs in a process-isolated worker; its new task-level `javaLauncher` and `maxMemory` properties are incubating, with `maxMemory` controlling the worker heap. On earlier Gradle versions, keep the Gradle runtime JVM compatible with the Groovy implementation because Groovydoc is not toolchain-aware.
- `Groovydoc.classpath` resolves types referenced by documented sources, while `groovyClasspath` loads the Groovy and Groovydoc implementation. If inference fails, declare the Groovy dependency and repository or configure `groovyClasspath` deliberately instead of adding Gradle's bundled Groovy by accident.
- Both `Javadoc` and `Groovydoc` are cacheable output-producing tasks. Keep destinations under `build/`; retain Groovydoc's reproducible `noTimestamp` and `noVersionStamp` defaults unless release policy explicitly requires stamps.

## Compatibility Triage

- If Gradle will not start, inspect the Gradle runtime JVM first.
- If a plugin fails to load, inspect plugin version and bytecode target.
- If compilation emits unsupported release or classfile errors, inspect toolchain language version, `--release`, and source/target compatibility.
- If tests fail with classfile errors, inspect the test runtime launcher and test dependencies, not only the compiler.
- If a toolchain cannot be found, decide whether the fix is local installation, `org.gradle.java.installations.*` discovery, settings-level resolver configuration, or a changed language/vendor/native-image constraint before changing source compatibility.
- If Android is involved, check Gradle, AGP, Kotlin, JDK, and Android Studio as one compatibility stack.

## Source Sets And Generated Sources

- Keep generated sources under `build/`, wire generated directories with providers from the producing task, and do not commit generated outputs unless project policy requires it.
- Groovy and Scala source directories may contain Java for joint compilation; keep Java in Java source directories unless bidirectional language dependencies require joint compilation, because Java under Groovy/Scala directories is owned by `GroovyCompile`/`ScalaCompile` and contributes to source-set `allJava`/`allSource`.
- Keep resources, generated outputs, and dependencies scoped to the owning source set.
- Keep source-set class outputs under `build/`; Gradle 9.0 removed the Java plugin's special registration of source-set outputs outside the build directory for generic stale-output cleanup. Do not rely on that cleanup for external class directories; compiler incremental cleanup is separate and can still remove its own obsolete classes there in 9.7.1.
- A custom JVM source set creates compile, resources, classes tasks, and configurations; declare dependencies after it exists, and do not expect a runnable verification task or `check` attachment without a `Test` task or suite target.
