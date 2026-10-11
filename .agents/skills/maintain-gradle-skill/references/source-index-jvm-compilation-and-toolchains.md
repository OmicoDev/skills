# Gradle JVM Compilation And Toolchains

## Documentation

- [Best Practices for Dependencies](https://docs.gradle.org/current/userguide/best_practices_dependencies.html)
- [Build Environment Configuration](https://docs.gradle.org/current/userguide/build_environment.html)
- [Configure a Gradle project (Kotlin)](https://kotlinlang.org/docs/gradle-configure-project.html)
- [Groovydoc API](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/javadoc/Groovydoc.html)
- [JavaToolchainSpec API](https://docs.gradle.org/current/javadoc/org/gradle/jvm/toolchain/JavaToolchainSpec.html)
- [ScalaPluginExtension API](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/scala/ScalaPluginExtension.html)
- [The Application Plugin](https://docs.gradle.org/current/userguide/application_plugin.html)
- [The Groovy Plugin (Gradle 9.6.1 before Groovydoc toolchain support)](https://docs.gradle.org/9.6.1/userguide/groovy_plugin.html)
- [The Java Library Plugin](https://docs.gradle.org/current/userguide/java_library_plugin.html)
- [The Java Plugin](https://docs.gradle.org/current/userguide/java_plugin.html)
- [The Scala Plugin](https://docs.gradle.org/current/userguide/scala_plugin.html)
- [Toolchains for JVM projects](https://docs.gradle.org/current/userguide/toolchains.html)
- [Upgrading to Gradle 9.0.0](https://docs.gradle.org/current/userguide/upgrading_major_version_9.html)

## Source Code

- `architecture/build-execution-model.md`
- `platforms/core-execution/execution/src/main/java/org/gradle/internal/execution/steps/HandleStaleOutputsStep.java`
- `platforms/jvm/javadoc/src/main/java/org/gradle/api/tasks/javadoc/Javadoc.java`
- `platforms/jvm/jvm-services/src/main/java/org/gradle/internal/jvm/inspection/DefaultJavaInstallationRegistry.java`
- `platforms/jvm/jvm-services/src/main/java/org/gradle/internal/jvm/inspection/JvmInstallationMetadataComparator.java`
- `platforms/jvm/jvm-services/src/main/java/org/gradle/internal/jvm/inspection/JvmInstallationProblemReporter.java`
- `platforms/jvm/jvm-services/src/test/groovy/org/gradle/internal/jvm/inspection/JvmInstallationProblemReporterTest.groovy`
- `platforms/jvm/jvm-services/src/test/groovy/org/gradle/jvm/toolchain/internal/JvmInstallationMetadataComparatorTest.groovy`
- `platforms/jvm/language-groovy/src/integTest/groovy/org/gradle/groovy/GroovyDocIntegrationTest.groovy`
- `platforms/jvm/language-groovy/src/integTest/groovy/org/gradle/groovy/GroovyDocStampsIntegrationTest.groovy`
- `platforms/jvm/language-groovy/src/integTest/groovy/org/gradle/groovy/GroovyDocToolchainIntegrationTest.groovy`
- `platforms/jvm/language-groovy/src/main/java/org/gradle/api/tasks/javadoc/Groovydoc.java`
- `platforms/jvm/language-java/src/integTest/groovy/org/gradle/api/tasks/javadoc/JavadocModularizedJavaIntegrationTest.groovy`
- `platforms/jvm/language-java/src/integTest/groovy/org/gradle/api/tasks/javadoc/JavadocToolchainIntegrationTest.groovy`
- `platforms/jvm/language-java/src/integTest/groovy/org/gradle/java/compile/incremental/BaseJavaClassChangeIncrementalCompilationIntegrationTest.groovy`
- `platforms/jvm/language-java/src/main/java/org/gradle/api/internal/tasks/compile/incremental/recomp/AbstractRecompilationSpecProvider.java`
- `platforms/jvm/language-java/src/main/java/org/gradle/api/internal/tasks/compile/incremental/transaction/CompileTransaction.java`
- `platforms/jvm/plugins-groovy/src/main/java/org/gradle/api/plugins/GroovyBasePlugin.java`
- `platforms/jvm/plugins-java-base/src/integTest/groovy/org/gradle/api/plugins/jvm/internal/DefaultJvmFeatureTest.groovy`
- `platforms/jvm/plugins-java-base/src/main/java/org/gradle/api/plugins/JavaBasePlugin.java`
- `platforms/jvm/plugins-java-base/src/main/java/org/gradle/api/plugins/internal/JvmPluginsHelper.java`
- `platforms/jvm/plugins-java-base/src/main/java/org/gradle/api/plugins/jvm/internal/DefaultJvmFeature.java`
- `platforms/jvm/plugins-java/src/main/java/org/gradle/api/plugins/JavaPlugin.java`
- `platforms/jvm/scala/src/integTest/groovy/org/gradle/scala/ScalaPluginExplicitVersionIntegrationTest.groovy`
- `platforms/jvm/scala/src/main/java/org/gradle/api/plugins/scala/ScalaBasePlugin.java`
- `platforms/jvm/scala/src/main/java/org/gradle/api/plugins/scala/ScalaPluginExtension.java`
- `platforms/jvm/scala/src/main/java/org/gradle/api/tasks/scala/internal/ScalaCompileOptionsConfigurer.java`
- `platforms/jvm/scala/src/test/groovy/org/gradle/scala/compile/internal/ScalaCompileOptionsConfigurerTest.groovy`
- `platforms/jvm/toolchains-jvm-shared/src/main/java/org/gradle/jvm/toolchain/JavaToolchainSpec.java`
- `platforms/jvm/toolchains-jvm-shared/src/main/java/org/gradle/jvm/toolchain/internal/DefaultToolchainSpec.java`
- `platforms/jvm/toolchains-jvm-shared/src/main/java/org/gradle/jvm/toolchain/internal/JavaToolchainQueryService.java`
- `platforms/jvm/toolchains-jvm/src/integTest/groovy/org/gradle/jvm/toolchain/JavaToolchainIntegrationTest.groovy`
- `testing/soak/src/integTest/groovy/org/gradle/jvm/toolchain/JavaToolchainDownloadSoakTest.groovy`
