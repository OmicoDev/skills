# Gradle Runtime And Structure

## Documentation

- [ADR-0007 - Java prerequisite](https://github.com/gradle/gradle/blob/master/architecture/standards/0007-java-pre-requisite.md)
- [Best Practices for Performance](https://docs.gradle.org/current/userguide/best_practices_performance.html)
- [Build Environment Configuration](https://docs.gradle.org/current/userguide/build_environment.html)
- [Build Execution Model](https://github.com/gradle/gradle/blob/master/architecture/build-execution-model.md)
- [Build Lifecycle](https://docs.gradle.org/current/userguide/build_lifecycle.html)
- [Build State Model](https://github.com/gradle/gradle/blob/master/architecture/build-state-model.md)
- [Compatibility Matrix](https://docs.gradle.org/current/userguide/compatibility.html)
- [Continuous Builds](https://docs.gradle.org/current/userguide/continuous_builds.html)
- [File System Watching](https://docs.gradle.org/current/userguide/file_system_watching.html)
- [Gradle Daemon](https://docs.gradle.org/current/userguide/gradle_daemon.html)
- [Gradle Runtimes](https://github.com/gradle/gradle/blob/master/architecture/runtimes.md)
- [Gradle-managed Directories](https://docs.gradle.org/current/userguide/directory_layout.html)
- [Initialization Scripts and Init Plugins](https://docs.gradle.org/current/userguide/init_scripts.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)

## Source Code

- `platforms/core-runtime/build-configuration/src/integTest/groovy/org/gradle/interal/buildconfiguration/tasks/UpdateDaemonJvmIntegrationTest.groovy`
- `platforms/core-runtime/build-configuration/src/main/java/org/gradle/buildconfiguration/tasks/UpdateDaemonJvm.java`
- `platforms/core-runtime/build-configuration/src/main/java/org/gradle/internal/buildconfiguration/DaemonJvmPropertiesConfigurator.java`
- `platforms/core-runtime/build-configuration/src/main/java/org/gradle/internal/buildconfiguration/tasks/DaemonJvmPropertiesModifier.java`
- `platforms/core-runtime/launcher/src/main/java/org/gradle/launcher/cli/converter/LayoutToPropertiesConverter.java`
- `platforms/core-runtime/wrapper-main/src/main/java/org/gradle/wrapper/GradleWrapperMain.java`
- `platforms/core-runtime/wrapper-shared/src/main/java/org/gradle/wrapper/GradleUserHomeLookup.java`
