# Gradle Upgrade Strategy

## Documentation

- [Command-Line Interface](https://docs.gradle.org/current/userguide/command_line_interface.html)
- [Compatibility Matrix](https://docs.gradle.org/current/userguide/compatibility.html)
- [General Gradle Best Practices](https://docs.gradle.org/current/userguide/best_practices_general.html)
- [Migrating Builds From Apache Ant](https://docs.gradle.org/current/userguide/migrating_from_ant.html)
- [Migrating Builds From Apache Maven](https://docs.gradle.org/current/userguide/migrating_from_maven.html)
- [The Feature Lifecycle](https://docs.gradle.org/current/userguide/feature_lifecycle.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)

## Source Code

- `platforms/core-runtime/logging-api/src/main/java/org/gradle/api/logging/configuration/WarningMode.java`
- `platforms/core-runtime/logging/src/main/java/org/gradle/internal/featurelifecycle/LoggingDeprecatedFeatureHandler.java`
- `platforms/core-runtime/logging/src/main/java/org/gradle/internal/logging/LoggingConfigurationBuildOptions.java`
- `platforms/core-runtime/wrapper-main/src/integTest/groovy/org/gradle/integtests/WrapperChecksumVerificationTest.groovy`
- `platforms/core-runtime/wrapper-main/src/integTest/groovy/org/gradle/integtests/WrapperGenerationIntegrationTest.groovy`
- `platforms/core-runtime/wrapper-main/src/integTest/groovy/org/gradle/integtests/WrapperHttpIntegrationTest.groovy`
- `platforms/core-runtime/wrapper-main/src/integTest/groovy/org/gradle/integtests/WrapperHttpsIntegrationTest.groovy`
- `platforms/core-runtime/wrapper-main/src/integTest/groovy/org/gradle/integtests/WrapperUpgradeIntegrationTest.groovy`
- `platforms/core-runtime/wrapper-shared/src/main/java/org/gradle/wrapper/WrapperExecutor.java`
- `platforms/software/build-init/src/main/java/org/gradle/api/tasks/wrapper/Wrapper.java`
- `platforms/software/build-init/src/main/java/org/gradle/api/tasks/wrapper/internal/WrapperGenerator.java`
- `platforms/software/build-init/src/test/groovy/org/gradle/api/tasks/wrapper/WrapperTest.groovy`
- `subprojects/core/src/main/java/org/gradle/internal/buildevents/BuildResultLogger.java`
- `subprojects/core/src/main/java/org/gradle/internal/buildtree/DeprecationsReporter.java`
