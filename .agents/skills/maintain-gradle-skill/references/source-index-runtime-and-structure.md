# Gradle Runtime And Structure

## Documentation

- [ADR-0007 - Java prerequisite](https://github.com/gradle/gradle/blob/master/architecture/standards/0007-java-pre-requisite.md)
- [Best Practices for Performance](https://docs.gradle.org/current/userguide/best_practices_performance.html)
- [Build Environment Configuration](https://docs.gradle.org/current/userguide/build_environment.html)
- [Build Execution Model](https://github.com/gradle/gradle/blob/master/architecture/build-execution-model.md)
- [Build Lifecycle](https://docs.gradle.org/current/userguide/build_lifecycle.html)
- [Build State Model](https://github.com/gradle/gradle/blob/master/architecture/build-state-model.md)
- [CacheConfigurations API](https://docs.gradle.org/current/javadoc/org/gradle/api/cache/CacheConfigurations.html)
- [Compatibility Matrix](https://docs.gradle.org/current/userguide/compatibility.html)
- [File System Watching](https://docs.gradle.org/current/userguide/file_system_watching.html)
- [General Gradle Best Practices](https://docs.gradle.org/current/userguide/best_practices_general.html)
- [Gradle API](https://docs.gradle.org/current/javadoc/org/gradle/api/invocation/Gradle.html)
- [Gradle Daemon](https://docs.gradle.org/current/userguide/gradle_daemon.html)
- [Gradle Runtimes](https://github.com/gradle/gradle/blob/master/architecture/runtimes.md)
- [Gradle-managed Directories and Caches](https://docs.gradle.org/current/userguide/directory_layout.html)
- [GradleLifecycle API](https://docs.gradle.org/current/javadoc/org/gradle/api/invocation/GradleLifecycle.html)
- [Initialization Scripts and Init Plugins](https://docs.gradle.org/current/userguide/init_scripts.html)
- [UpdateDaemonJvm API](https://docs.gradle.org/current/javadoc/org/gradle/buildconfiguration/tasks/UpdateDaemonJvm.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)

## Source Code

- `platforms/core-runtime/build-configuration/src/integTest/groovy/org/gradle/interal/buildconfiguration/tasks/UpdateDaemonJvmIntegrationTest.groovy`
- `platforms/core-runtime/build-configuration/src/main/java/org/gradle/buildconfiguration/tasks/UpdateDaemonJvm.java`
- `platforms/core-runtime/build-configuration/src/main/java/org/gradle/internal/buildconfiguration/DaemonJvmPropertiesConfigurator.java`
- `platforms/core-runtime/build-configuration/src/main/java/org/gradle/internal/buildconfiguration/tasks/DaemonJvmPropertiesAccessor.java`
- `platforms/core-runtime/build-configuration/src/main/java/org/gradle/internal/buildconfiguration/tasks/DaemonJvmPropertiesModifier.java`
- `platforms/core-runtime/build-configuration/src/test/groovy/org/gradle/internal/buildconfiguration/DaemonJvmPropertiesAccessorTest.groovy`
- `platforms/core-runtime/build-discovery/src/main/java/org/gradle/internal/scripts/DefaultScriptFileResolver.java`
- `platforms/core-runtime/build-discovery/src/main/java/org/gradle/internal/scripts/ScriptFileUtil.java`
- `platforms/core-runtime/build-discovery/src/test/groovy/org/gradle/internal/scripts/DefaultScriptFileResolverTest.groovy`
- `platforms/core-runtime/daemon-protocol/src/main/java/org/gradle/launcher/daemon/context/DaemonCompatibilitySpec.java`
- `platforms/core-runtime/daemon-protocol/src/main/java/org/gradle/launcher/daemon/registry/DaemonDir.java`
- `platforms/core-runtime/daemon-protocol/src/main/java/org/gradle/launcher/daemon/toolchain/DaemonJvmCriteria.java`
- `platforms/core-runtime/daemon-protocol/src/test/groovy/org/gradle/launcher/daemon/context/DaemonCompatibilitySpecSpec.groovy`
- `platforms/core-runtime/launcher/src/main/java/org/gradle/launcher/cli/converter/LayoutToPropertiesConverter.java`
- `platforms/core-runtime/launcher/src/main/java/org/gradle/tooling/internal/provider/FileSystemWatchingBuildActionRunner.java`
- `platforms/core-runtime/launcher/src/test/groovy/org/gradle/tooling/internal/provider/FileSystemWatchingBuildActionRunnerTest.groovy`
- `platforms/core-runtime/start-parameter/src/main/java/org/gradle/StartParameter.java`
- `platforms/core-runtime/start-parameter/src/main/java/org/gradle/initialization/DirectoryInitScriptFinder.java`
- `platforms/core-runtime/start-parameter/src/main/java/org/gradle/initialization/DistributionInitScriptFinder.java`
- `platforms/core-runtime/start-parameter/src/main/java/org/gradle/initialization/UserHomeInitScriptFinder.java`
- `platforms/core-runtime/start-parameter/src/test/groovy/org/gradle/initialization/DistributionInitScriptFinderTest.groovy`
- `platforms/core-runtime/start-parameter/src/test/groovy/org/gradle/initialization/UserHomeInitScriptFinderTest.groovy`
- `platforms/core-runtime/wrapper-main/src/main/java/org/gradle/wrapper/GradleWrapperMain.java`
- `platforms/core-runtime/wrapper-shared/src/main/java/org/gradle/wrapper/GradleUserHomeLookup.java`
- `platforms/documentation/docs/src/snippets/best-practices/avoidGradlePropertiesInSubProjects-avoid/common/app/gradle.properties`
- `platforms/documentation/docs/src/snippets/best-practices/avoidGradlePropertiesInSubProjects-do/common/gradle.properties`
- `platforms/documentation/docs/src/snippets/best-practices/useTheGradlePropertiesFile-avoid/tests/useTheGradlePropertiesFile-avoid.sample.conf`
- `platforms/documentation/docs/src/snippets/best-practices/useTheGradlePropertiesFile-do/common/gradle.properties`
- `platforms/jvm/jvm-services/src/main/java/org/gradle/jvm/toolchain/JvmVendorSpec.java`
- `platforms/jvm/jvm-services/src/main/java/org/gradle/jvm/toolchain/internal/DefaultJvmVendorSpec.java`
- `platforms/jvm/toolchains-jvm-shared/src/test/groovy/org/gradle/jvm/toolchain/internal/DefaultJvmVendorSpecTest.groovy`
- `platforms/software/version-control/src/main/java/org/gradle/vcs/internal/services/VersionControlRepositoryCacheFactory.java`
- `subprojects/core-api/src/main/java/org/gradle/api/cache/CacheConfigurations.java`
- `subprojects/core-api/src/main/java/org/gradle/api/cache/Cleanup.java`
- `subprojects/core-api/src/main/java/org/gradle/api/cache/MarkingStrategy.java`
- `subprojects/core-api/src/main/java/org/gradle/api/invocation/Gradle.java`
- `subprojects/core-api/src/main/java/org/gradle/api/invocation/GradleLifecycle.java`
- `subprojects/core/src/integTest/groovy/org/gradle/api/internal/cache/CacheConfigurationsIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/invocation/GradleLifecycleIntegrationTest.groovy`
- `subprojects/core/src/main/java/org/gradle/api/internal/cache/DefaultCacheConfigurations.java`
- `subprojects/core/src/main/java/org/gradle/cache/internal/GradleUserHomeCleanupService.java`
- `subprojects/core/src/main/java/org/gradle/cache/internal/GradleUserHomeCleanupServices.java`
- `subprojects/core/src/main/java/org/gradle/initialization/ScriptEvaluatingSettingsProcessor.java`
- `subprojects/core/src/main/java/org/gradle/internal/service/scopes/VirtualFileSystemServices.java`
- `subprojects/core/src/test/groovy/org/gradle/cache/internal/GradleUserHomeCleanupServiceTest.groovy`
