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
- Prefer `scala { scalaVersion = ... }` for Scala projects so Gradle owns Scala SDK and compiler classpaths; if inferring classpaths from dependencies, Scala 2 needs `scala-library`, Scala 3 needs `scala3-library_3`, and `scalaClasspath`/`zinc` remain compiler-tool inputs, not application dependencies.

## Toolchains

- Read [compatibility-java.md](compatibility-java.md) when deciding whether a Java version can run Gradle or is only safe as a toolchain target for the selected Gradle version; read [runtime-and-structure.md](runtime-and-structure.md) when Daemon JVM criteria, `org.gradle.java.home`, `JAVA_HOME`, or client startup owns the issue.
- The Gradle runtime JVM runs Gradle and plugins; Java toolchains select JVMs for compile, test, javadoc, and custom Java tool tasks.
- Toolchain coverage differs by JVM plugin: Java covers compile, test, and Javadoc; on the final Gradle 9.6.1 baseline, Groovy compilation is covered but Groovydoc is not; Scala covers compilation and Scaladoc.
- Prefer toolchains over `JAVA_HOME`, IDE Gradle JVM settings, or `sourceCompatibility`/`targetCompatibility` alone; IDE settings choose how Gradle is launched inside the IDE, not the project compile/test toolchain.
- Toolchains choose the JDK; they do not prevent accidental use of newer Java APIs. Use `--release` for Java API targeting when compiling Java sources for older platforms.
- `ScalaCompile` derives target or release flags from the configured toolchain, or defaults to Java 8 bytecode without toolchains; explicit Scala compiler output flags override Gradle's selection, and older Scala versions may require a lower toolchain or explicit target.
- A non-empty `JavaToolchainSpec` must set `languageVersion`; vendor, implementation, and native-image capability are refinements. An empty spec selects the current Gradle JVM, not a reproducible project toolchain. Leaving native-image unset or false does not reject a native-image-capable JDK.
- Diagnose with `./gradlew -q javaToolchains` when available in the build; the report shows detection source, metadata, auto-detection/download state, and invalid installations.
- Configure toolchain resolver plugins and toolchain repositories in settings when auto-provisioning is allowed. Repository order decides which matching JDK is downloaded first; auto-provisioning downloads only GA JDKs when no detected toolchain matches and never updates already-provisioned JDKs.
- Custom `fromEnv` and `paths` locations extend the detected candidate set instead of taking priority. Missing locations or entries without `bin/java` warn, and precedence still prefers the current Gradle JVM, JDKs over JREs, known-vendor order, higher versions, then path ordering.
- Stop daemons after changing toolchain locations, auto-detection, auto-download, resolver plugins, or provisioning policy so cached JVM metadata cannot mask the new configuration.
- For custom Java tasks, expose `JavaCompiler`, `JavaLauncher`, or `JavadocTool` providers, or lazily map their executable/home paths into `RegularFileProperty` or `DirectoryProperty`; avoid eager `.get()` during configuration.
- Mark custom task toolchain tool properties as `@Nested` inputs so launcher, compiler, or javadoc tool changes participate in validation, up-to-date checks, and cache keys.

## API Documentation

- The Java plugin registers a `Javadoc` task for each source set, using that source set's `allJava` sources and its output plus compile classpath; module-path inference follows the Java extension unless the task overrides it.
- Prefer the `javadocTool` provider from `JavaToolchainService`; Gradle validates a legacy `executable` override against the selected toolchain, so do not combine paths from different JDKs.
- `failOnError = false` ignores Javadoc tool failures; keep the default failure behavior for published or verified documentation so a failed tool invocation cannot silently leave incomplete output.
- On the final Gradle 9.6.1 baseline, `Groovydoc` is not Java-toolchain-aware: it loads the Groovydoc implementation from `groovyClasspath` in a classloader-isolated worker. Keep the Gradle runtime JVM compatible with that Groovy version, and do not assume the Java extension toolchain selects the documentation JVM.
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
- Keep source-set class outputs under `build/`; on Gradle 9+, stale class outputs outside the build directory are no longer deleted, so external class dirs need explicit cleanup or different output ownership.
- A custom JVM source set creates compile, resources, classes tasks, and configurations; declare dependencies after it exists, and do not expect a runnable verification task or `check` attachment without a `Test` task or suite target.
