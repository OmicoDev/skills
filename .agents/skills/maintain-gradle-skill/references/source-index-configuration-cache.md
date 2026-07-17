# Gradle Configuration Cache

## Documentation

- [Best Practices for Performance](https://docs.gradle.org/current/userguide/best_practices_performance.html)
- [Build Lifecycle](https://docs.gradle.org/current/userguide/build_lifecycle.html)
- [Configuration Cache](https://docs.gradle.org/current/userguide/configuration_cache.html)
- [Configuration Cache Requirements for your Build Logic](https://docs.gradle.org/current/userguide/configuration_cache_requirements.html)
- [Configuration Cache Requirements for your Build Logic (Gradle 9.7.0-milestone-3)](https://docs.gradle.org/9.7.0-milestone-3/userguide/configuration_cache_requirements.html#config_cache:requirements:custom_collection_types)
- [Configuration Cache Status](https://docs.gradle.org/current/userguide/configuration_cache_status.html)
- [Debugging and Troubleshooting the Configuration Cache](https://docs.gradle.org/current/userguide/configuration_cache_debugging.html)
- [Enabling and Configuring the Configuration Cache](https://docs.gradle.org/current/userguide/configuration_cache_enabling.html)
- [Implementing Binary Plugins](https://docs.gradle.org/current/userguide/implementing_gradle_plugins_binary.html)
- [Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)
- [Upgrading within Gradle 9.x.y (Gradle 9.7.0-milestone-3)](https://docs.gradle.org/9.7.0-milestone-3/userguide/upgrading_version_9.html#deprecated_custom_collection_types_with_cc)

## Source Code

- `platforms/core-configuration/configuration-cache/readme.md`
- `platforms/core-configuration/configuration-cache/src/integTest/groovy/org/gradle/internal/cc/impl/ConfigurationCacheGracefulDegradationIntegrationTest.groovy`
- `platforms/core-configuration/configuration-cache/src/integTest/groovy/org/gradle/internal/cc/impl/ConfigurationCacheInitScriptsIntegrationTest.groovy`
- `platforms/core-configuration/configuration-cache/src/integTest/groovy/org/gradle/internal/cc/impl/ConfigurationCacheSupportedTypesIntegrationTest.groovy`
- `platforms/core-configuration/configuration-cache/src/integTest/groovy/org/gradle/internal/cc/impl/ConfigurationCacheUnsupportedTypesIntegrationTest.groovy`
- `platforms/core-configuration/configuration-cache/src/integTest/groovy/org/gradle/internal/cc/impl/inputs/process/ProcessInInitScriptIntegrationTest.groovy`
- `platforms/core-configuration/configuration-cache/src/integTest/groovy/org/gradle/internal/cc/impl/isolated/IsolatedProjectsToolingApiGracefulDegradationIntegrationTest.groovy`
- `platforms/core-configuration/configuration-cache/src/main/kotlin/org/gradle/internal/cc/impl/ConfigurationTimeBarrierBasedExecutionAccessChecker.kt`
- `platforms/core-configuration/configuration-cache/src/main/kotlin/org/gradle/internal/cc/impl/DefaultConfigurationCacheDegradationController.kt`
- `platforms/core-configuration/configuration-cache/src/main/kotlin/org/gradle/internal/cc/impl/DeprecatedFeaturesListener.kt`
- `platforms/core-configuration/configuration-cache/src/main/kotlin/org/gradle/internal/cc/impl/InstrumentedExecutionAccessListener.kt`
- `platforms/core-configuration/configuration-cache/src/main/kotlin/org/gradle/internal/cc/impl/TaskExecutionAccessCheckers.kt`
- `platforms/core-configuration/configuration-cache/src/main/kotlin/org/gradle/internal/cc/impl/barrier/VintageConfigurationTimeActionRunner.kt`
- `platforms/core-configuration/configuration-cache/src/main/kotlin/org/gradle/internal/cc/impl/problems/ConfigurationCacheProblems.kt`
- `platforms/core-configuration/configuration-cache/src/main/kotlin/org/gradle/internal/cc/impl/promo/ConfigurationCachePromoHandler.kt`
- `platforms/core-configuration/configuration-cache/src/main/kotlin/org/gradle/internal/cc/impl/serialize/ConfigurationCacheCodecs.kt`
- `platforms/core-configuration/configuration-problems-base/src/main/kotlin/org/gradle/internal/cc/impl/problems/ProblemSeverity.kt`
- `platforms/core-configuration/core-serialization-codecs/src/main/kotlin/org/gradle/internal/serialize/codecs/core/UnsupportedTypesCodecs.kt`
- `platforms/core-configuration/graph-serialization/src/main/kotlin/org/gradle/internal/serialize/graph/Combinators.kt`
- `platforms/core-configuration/model-core/src/main/java/org/gradle/api/internal/provider/ConfigurationTimeBarrier.java`
- `platforms/core-configuration/model-core/src/main/java/org/gradle/api/internal/provider/DefaultConfigurationTimeBarrier.java`
- `platforms/core-configuration/stdlib-serialization-codecs/src/main/kotlin/org/gradle/internal/serialize/codecs/stdlib/CollectionCodecs.kt`
- `platforms/core-configuration/stdlib-serialization-codecs/src/main/kotlin/org/gradle/internal/serialize/codecs/stdlib/HashSetCodec.kt`
- `platforms/documentation/docs/src/docs/userguide/best-practices/best_practices_performance.adoc`
- `platforms/documentation/docs/src/snippets/best-practices/useConfigurationCache-avoid/common/gradle.properties`
- `platforms/documentation/docs/src/snippets/best-practices/useConfigurationCache-do/common/gradle.properties`
- `subprojects/core-api/src/main/java/org/gradle/api/configuration/BuildFeature.java`
- `subprojects/core-api/src/main/java/org/gradle/api/configuration/BuildFeatures.java`
- `subprojects/core/src/integTest/groovy/org/gradle/api/configuration/BuildFeaturesIntegrationTest.groovy`
- `subprojects/core/src/main/java/org/gradle/api/internal/ConfigurationCacheDegradation.java`
- `subprojects/core/src/main/java/org/gradle/api/internal/ConfigurationCacheDegradationController.java`
- `subprojects/core/src/main/java/org/gradle/api/internal/configuration/DefaultBuildFeature.java`
- `subprojects/core/src/main/java/org/gradle/api/internal/configuration/DefaultBuildFeatures.java`
