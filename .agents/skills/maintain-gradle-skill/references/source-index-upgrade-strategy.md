# Gradle Upgrade Strategy

## Documentation

- [Command-Line Interface](https://docs.gradle.org/current/userguide/command_line_interface.html)
- [Compatibility Matrix](https://docs.gradle.org/current/userguide/compatibility.html)
- [General Gradle Best Practices](https://docs.gradle.org/current/userguide/best_practices_general.html)
- [Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html)
- [Migrating Builds From Apache Ant](https://docs.gradle.org/current/userguide/migrating_from_ant.html)
- [Migrating Builds From Apache Maven](https://docs.gradle.org/current/userguide/migrating_from_maven.html)
- [Reporting Plugin Problems with the Problems API](https://docs.gradle.org/current/userguide/reporting_problems.html)
- [The Feature Lifecycle](https://docs.gradle.org/current/userguide/feature_lifecycle.html)
- [Upgrading to Gradle 9.0.0](https://docs.gradle.org/current/userguide/upgrading_major_version_9.html)
- [Upgrading within Gradle 8.x](https://docs.gradle.org/current/userguide/upgrading_version_8.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)
- [Wrapper](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/wrapper/Wrapper.html)

## Source Code

- `platforms/core-runtime/logging-api/src/main/java/org/gradle/api/logging/configuration/WarningMode.java`
- `platforms/core-runtime/logging/src/integTest/groovy/org/gradle/DeprecatedUsageBuildOperationProgressIntegrationTest.groovy`
- `platforms/core-runtime/logging/src/integTest/groovy/org/gradle/DeprecationHandlingIntegrationTest.groovy`
- `platforms/core-runtime/logging/src/main/java/org/gradle/internal/featurelifecycle/LoggingDeprecatedFeatureHandler.java`
- `platforms/core-runtime/logging/src/main/java/org/gradle/internal/logging/LoggingConfigurationBuildOptions.java`
- `platforms/core-runtime/logging/src/test/groovy/org/gradle/internal/deprecation/LoggingDeprecatedFeatureHandlerTest.groovy`
- `platforms/core-runtime/start-parameter/src/main/java/org/gradle/initialization/StartParameterBuildOptions.java`
- `platforms/core-runtime/wrapper-main/src/integTest/groovy/org/gradle/integtests/WrapperChecksumVerificationTest.groovy`
- `platforms/core-runtime/wrapper-main/src/integTest/groovy/org/gradle/integtests/WrapperGenerationIntegrationTest.groovy`
- `platforms/core-runtime/wrapper-main/src/integTest/groovy/org/gradle/integtests/WrapperHttpIntegrationTest.groovy`
- `platforms/core-runtime/wrapper-main/src/integTest/groovy/org/gradle/integtests/WrapperHttpsIntegrationTest.groovy`
- `platforms/core-runtime/wrapper-main/src/integTest/groovy/org/gradle/integtests/WrapperUpgradeIntegrationTest.groovy`
- `platforms/core-runtime/wrapper-shared/src/main/java/org/gradle/wrapper/WrapperExecutor.java`
- `platforms/ide/problems-api/src/integTest/groovy/org/gradle/api/problems/ProblemsServiceIntegrationTest.groovy`
- `platforms/ide/problems-api/src/main/java/org/gradle/api/problems/ProblemReporter.java`
- `platforms/ide/problems-api/src/main/java/org/gradle/api/problems/internal/DefaultProblemReporter.java`
- `platforms/software/build-init/src/main/java/org/gradle/api/tasks/wrapper/Wrapper.java`
- `platforms/software/build-init/src/main/java/org/gradle/api/tasks/wrapper/internal/WrapperGenerator.java`
- `platforms/software/build-init/src/test/groovy/org/gradle/api/tasks/wrapper/WrapperTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/verification/DependencyVerificationSignatureWriteIntegTest.groovy`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/ivyservice/ivyresolve/verification/writer/WriteDependencyVerificationFile.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/internal/locking/LockFileReaderWriter.java`
- `platforms/software/dependency-management/src/test/groovy/org/gradle/internal/locking/LockFileReaderWriterTest.groovy`
- `subprojects/core/src/main/java/org/gradle/internal/buildevents/BuildResultLogger.java`
- `subprojects/core/src/main/java/org/gradle/internal/buildtree/DeprecationsReporter.java`
