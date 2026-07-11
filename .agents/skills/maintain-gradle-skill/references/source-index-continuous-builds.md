# Gradle Continuous Builds

## Documentation

- [Continuous Builds](https://docs.gradle.org/current/userguide/continuous_builds.html)
- [File System Watching](https://docs.gradle.org/current/userguide/file_system_watching.html)
- [Gradle 7.5 Build Environment Configuration](https://docs.gradle.org/7.5/userguide/build_environment.html)

## Source Code

- `platforms/core-runtime/launcher/src/integTest/groovy/org/gradle/launcher/continuous/ChangesDuringBuildContinuousIntegrationTest.groovy`
- `platforms/core-runtime/launcher/src/integTest/groovy/org/gradle/launcher/continuous/ContinuousBuildCancellationIntegrationTest.groovy`
- `platforms/core-runtime/launcher/src/integTest/groovy/org/gradle/launcher/continuous/ContinuousBuildChangeReportingIntegrationTest.groovy`
- `platforms/core-runtime/launcher/src/main/java/org/gradle/tooling/internal/provider/FileSystemWatchingBuildActionRunner.java`
- `platforms/core-runtime/launcher/src/main/java/org/gradle/tooling/internal/provider/continuous/AccumulateBuildInputsListener.java`
- `platforms/core-runtime/launcher/src/main/java/org/gradle/tooling/internal/provider/continuous/BuildInputHierarchy.java`
- `platforms/core-runtime/launcher/src/main/java/org/gradle/tooling/internal/provider/continuous/ContinuousBuildActionExecutor.java`
- `platforms/core-runtime/launcher/src/main/java/org/gradle/tooling/internal/provider/continuous/ContinuousBuildTriggerHandler.java`
- `platforms/core-runtime/launcher/src/main/java/org/gradle/tooling/internal/provider/continuous/FileEventCollector.java`
- `platforms/core-runtime/start-parameter/src/main/java/org/gradle/initialization/StartParameterBuildOptions.java`
