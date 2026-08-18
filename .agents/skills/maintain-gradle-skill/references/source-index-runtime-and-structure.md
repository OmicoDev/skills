# Gradle Runtime And Structure

## Documentation

- [ADR-0007 - Java prerequisite in Gradle 9.7.0](https://github.com/gradle/gradle/blob/v9.7.0/architecture/standards/0007-java-pre-requisite.md)
- [Best Practices for Performance](https://docs.gradle.org/current/userguide/best_practices_performance.html)
- [Build Environment Configuration](https://docs.gradle.org/current/userguide/build_environment.html)
- [Build Execution Model in Gradle 9.7.0](https://github.com/gradle/gradle/blob/v9.7.0/architecture/build-execution-model.md)
- [Build Lifecycle](https://docs.gradle.org/current/userguide/build_lifecycle.html)
- [Build State Model in Gradle 9.7.0](https://github.com/gradle/gradle/blob/v9.7.0/architecture/build-state-model.md)
- [Cache Configurations API in Gradle 8.0](https://docs.gradle.org/8.0/javadoc/org/gradle/api/cache/CacheConfigurations.html)
- [Cache Configurations API in Gradle 8.1](https://docs.gradle.org/8.1/javadoc/org/gradle/api/cache/CacheConfigurations.html)
- [Compatibility Matrix](https://docs.gradle.org/current/userguide/compatibility.html)
- [File System Watching](https://docs.gradle.org/current/userguide/file_system_watching.html)
- [General Gradle Best Practices](https://docs.gradle.org/current/userguide/best_practices_general.html)
- [Gradle 8.10 Release Notes](https://docs.gradle.org/8.10/release-notes.html)
- [Gradle 8.13 Release Notes](https://docs.gradle.org/8.13/release-notes.html)
- [Gradle API in Gradle 6.0](https://docs.gradle.org/6.0/javadoc/org/gradle/api/invocation/Gradle.html)
- [Gradle Daemon](https://docs.gradle.org/current/userguide/gradle_daemon.html)
- [Gradle Lifecycle API in Gradle 8.8](https://docs.gradle.org/8.8/javadoc/org/gradle/api/invocation/GradleLifecycle.html)
- [Gradle Runtimes in Gradle 9.7.0](https://github.com/gradle/gradle/blob/v9.7.0/architecture/runtimes.md)
- [Gradle-managed Directories](https://docs.gradle.org/current/userguide/directory_layout.html)
- [Initialization Scripts and Init Plugins](https://docs.gradle.org/current/userguide/init_scripts.html)
- [UpdateDaemonJvm API in Gradle 8.14](https://docs.gradle.org/8.14/javadoc/org/gradle/buildconfiguration/tasks/UpdateDaemonJvm.html)
- [UpdateDaemonJvm API in Gradle 8.8](https://docs.gradle.org/8.8/javadoc/org/gradle/buildconfiguration/tasks/UpdateDaemonJvm.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)

## Source Code

- `platforms/core-runtime/build-configuration/src/integTest/groovy/org/gradle/interal/buildconfiguration/tasks/UpdateDaemonJvmIntegrationTest.groovy`
- `platforms/core-runtime/build-configuration/src/main/java/org/gradle/buildconfiguration/tasks/UpdateDaemonJvm.java`
- `platforms/core-runtime/build-configuration/src/main/java/org/gradle/internal/buildconfiguration/DaemonJvmPropertiesConfigurator.java`
- `platforms/core-runtime/build-configuration/src/main/java/org/gradle/internal/buildconfiguration/tasks/DaemonJvmPropertiesModifier.java`
- `platforms/core-runtime/daemon-protocol/src/main/java/org/gradle/launcher/daemon/context/DaemonCompatibilitySpec.java`
- `platforms/core-runtime/daemon-protocol/src/test/groovy/org/gradle/launcher/daemon/context/DaemonCompatibilitySpecSpec.groovy`
- `platforms/core-runtime/launcher/src/main/java/org/gradle/launcher/cli/converter/LayoutToPropertiesConverter.java`
- `platforms/core-runtime/launcher/src/main/java/org/gradle/tooling/internal/provider/FileSystemWatchingBuildActionRunner.java`
- `platforms/core-runtime/launcher/src/test/groovy/org/gradle/tooling/internal/provider/FileSystemWatchingBuildActionRunnerTest.groovy`
- `platforms/core-runtime/wrapper-main/src/main/java/org/gradle/wrapper/GradleWrapperMain.java`
- `platforms/core-runtime/wrapper-shared/src/main/java/org/gradle/wrapper/GradleUserHomeLookup.java`
- `platforms/documentation/docs/src/docs/userguide/best-practices/best_practices_general.adoc`
- `platforms/documentation/docs/src/snippets/best-practices/avoidGradlePropertiesInSubProjects-avoid/common/app/gradle.properties`
- `platforms/documentation/docs/src/snippets/best-practices/avoidGradlePropertiesInSubProjects-do/common/gradle.properties`
- `platforms/documentation/docs/src/snippets/best-practices/useTheGradlePropertiesFile-avoid/tests/useTheGradlePropertiesFile-avoid.sample.conf`
- `platforms/documentation/docs/src/snippets/best-practices/useTheGradlePropertiesFile-do/common/gradle.properties`
- `platforms/software/version-control/src/main/java/org/gradle/vcs/internal/services/VersionControlRepositoryCacheFactory.java`
- `subprojects/core-api/src/main/java/org/gradle/api/cache/CacheConfigurations.java`
- `subprojects/core-api/src/main/java/org/gradle/api/cache/MarkingStrategy.java`
- `subprojects/core-api/src/main/java/org/gradle/api/invocation/Gradle.java`
- `subprojects/core-api/src/main/java/org/gradle/api/invocation/GradleLifecycle.java`
- `subprojects/core/src/integTest/groovy/org/gradle/api/invocation/GradleLifecycleIntegrationTest.groovy`
- `subprojects/core/src/main/java/org/gradle/internal/service/scopes/VirtualFileSystemServices.java`
