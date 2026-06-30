# Gradle Configuration Cache

## Documentation

- [Configuration Cache](https://docs.gradle.org/current/userguide/configuration_cache.html)
- [Configuration Cache Requirements for your Build Logic](https://docs.gradle.org/current/userguide/configuration_cache_requirements.html)
- [Configuration Cache Status](https://docs.gradle.org/current/userguide/configuration_cache_status.html)
- [Debugging and Troubleshooting the Configuration Cache](https://docs.gradle.org/current/userguide/configuration_cache_debugging.html)
- [Implementing Binary Plugins](https://docs.gradle.org/current/userguide/implementing_gradle_plugins_binary.html)
- [Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html)

## Source Code

- `platforms/core-configuration/configuration-cache/src/integTest/groovy/org/gradle/internal/cc/impl/ConfigurationCacheInitScriptsIntegrationTest.groovy`
- `platforms/core-configuration/configuration-cache/src/integTest/groovy/org/gradle/internal/cc/impl/inputs/process/ProcessInInitScriptIntegrationTest.groovy`
- `subprojects/core-api/src/main/java/org/gradle/api/configuration/BuildFeature.java`
- `subprojects/core-api/src/main/java/org/gradle/api/configuration/BuildFeatures.java`
- `subprojects/core/src/integTest/groovy/org/gradle/api/configuration/BuildFeaturesIntegrationTest.groovy`
- `subprojects/core/src/main/java/org/gradle/api/internal/configuration/DefaultBuildFeature.java`
- `subprojects/core/src/main/java/org/gradle/api/internal/configuration/DefaultBuildFeatures.java`
