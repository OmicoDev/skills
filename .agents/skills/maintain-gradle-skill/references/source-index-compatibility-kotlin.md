# Gradle Kotlin Compatibility

## Documentation

- [Compatibility Matrix](https://docs.gradle.org/current/userguide/compatibility.html)
- [Upgrading to Gradle 9.0.0](https://docs.gradle.org/current/userguide/upgrading_major_version_9.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)

## Source Code

- `platforms/core-configuration/kotlin-dsl-integ-tests/src/crossVersionTest/groovy/org/gradle/kotlin/dsl/plugins/PrecompiledKotlinPluginCrossVersionSpec.groovy`
- `platforms/core-configuration/kotlin-dsl-integ-tests/src/crossVersionTest/groovy/org/gradle/kotlin/dsl/plugins/ProjectTheExtensionCrossVersionSpec.groovy`
- `platforms/core-configuration/kotlin-dsl-integ-tests/src/integTest/kotlin/org/gradle/kotlin/dsl/integration/KotlinDslJvmDefaultIntegrationTest.kt`
- `platforms/core-configuration/kotlin-dsl-integ-tests/src/integTest/kotlin/org/gradle/kotlin/dsl/integration/KotlinDslJvmTargetIntegrationTest.kt`
- `platforms/core-configuration/kotlin-dsl-integ-tests/src/integTest/kotlin/org/gradle/kotlin/dsl/integration/KotlinDslPluginCustomKotlinOptionsIntegrationTest.kt`
- `platforms/core-configuration/kotlin-dsl-integ-tests/src/integTest/kotlin/org/gradle/kotlin/dsl/integration/PrecompiledScriptPluginErrorsIntegrationTest.kt`
- `platforms/core-configuration/kotlin-dsl-integ-tests/src/integTest/kotlin/org/gradle/kotlin/dsl/integration/SkipMetadataVersionCheckTest.kt`
- `platforms/core-configuration/kotlin-dsl-integ-tests/src/integTest/kotlin/org/gradle/kotlin/dsl/plugins/dsl/KotlinDslPluginForOldestKotlinVersionTest.kt`
- `platforms/core-configuration/kotlin-dsl-integ-tests/src/integTest/kotlin/org/gradle/kotlin/dsl/plugins/dsl/KotlinDslPluginTest.kt`
- `platforms/core-configuration/kotlin-dsl-integ-tests/src/integTest/kotlin/org/gradle/kotlin/dsl/plugins/dsl/KotlinDslPluginWithExplicitKGPVersionTest.kt`
- `platforms/core-configuration/kotlin-dsl-integ-tests/src/integTest/kotlin/org/gradle/kotlin/dsl/plugins/embedded/EmbeddedKotlinPluginIntegTest.kt`
- `platforms/core-configuration/kotlin-dsl-plugins/src/main/kotlin/org/gradle/kotlin/dsl/plugins/dsl/KotlinDslCompilerPlugins.kt`
- `platforms/core-configuration/kotlin-dsl-plugins/src/main/kotlin/org/gradle/kotlin/dsl/plugins/dsl/KotlinDslPlugin.kt`
- `platforms/core-configuration/kotlin-dsl-plugins/src/main/kotlin/org/gradle/kotlin/dsl/plugins/embedded/EmbeddedKotlinPlugin.kt`
- `platforms/core-configuration/kotlin-dsl/src/main/kotlin/org/gradle/kotlin/dsl/execution/DefaultKotlinMetadataCompatibilityChecker.kt`
- `platforms/core-configuration/kotlin-dsl/src/main/kotlin/org/gradle/kotlin/dsl/execution/metadataCompatibilityCheck.kt`
- `platforms/core-configuration/kotlin-dsl/src/main/kotlin/org/gradle/kotlin/dsl/support/KotlinCompiler.kt`
- `platforms/core-configuration/kotlin-dsl/src/main/kotlin/org/gradle/kotlin/dsl/support/KotlinCompilerOptions.kt`
- `platforms/core-configuration/kotlin-dsl/src/main/kotlin/org/gradle/kotlin/dsl/support/KotlinDslOptions.kt`
- `platforms/core-runtime/base-services/src/main/java/org/gradle/util/internal/KotlinDslVersion.java`
- `platforms/core-runtime/gradle-cli/src/test/groovy/org/gradle/launcher/cli/DefaultCommandLineActionFactoryTest.groovy`
- `platforms/documentation/docs/src/docs/userguide/releases/upgrading/upgrading_major_version_9.adoc`
