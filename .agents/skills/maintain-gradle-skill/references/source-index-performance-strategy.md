# Gradle Performance Strategy

## Documentation

- [Avoiding Unnecessary Task Configuration](https://docs.gradle.org/current/userguide/task_configuration_avoidance.html)
- [Best Practices for Performance](https://docs.gradle.org/current/userguide/best_practices_performance.html)
- [Build Cache](https://docs.gradle.org/current/userguide/build_cache.html)
- [Build Scan](https://docs.gradle.org/current/userguide/inspect.html)
- [Configuration Cache](https://docs.gradle.org/current/userguide/configuration_cache.html)
- [File System Watching](https://docs.gradle.org/current/userguide/file_system_watching.html)
- [Gradle Daemon](https://docs.gradle.org/current/userguide/gradle_daemon.html)
- [Improve the Performance of Gradle Builds](https://docs.gradle.org/current/userguide/performance.html)
- [Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html)

## Source Code

- `platforms/core-runtime/base-services/src/main/java/org/gradle/internal/work/DefaultWorkerLimits.java`
- `platforms/core-runtime/base-services/src/main/java/org/gradle/internal/work/WorkerLimits.java`
- `platforms/core-runtime/build-profile/src/integTest/groovy/org/gradle/profile/ConfigurationCacheBuildProfileIntegrationTest.groovy`
- `platforms/core-runtime/build-profile/src/integTest/groovy/org/gradle/profile/ProfilingIntegrationTest.groovy`
- `platforms/core-runtime/build-profile/src/main/java/org/gradle/profile/BuildProfile.java`
- `platforms/core-runtime/build-profile/src/main/java/org/gradle/profile/ProfileEventAdapter.java`
- `platforms/core-runtime/build-profile/src/main/java/org/gradle/profile/ProfileReportRenderer.java`
- `platforms/core-runtime/build-profile/src/main/java/org/gradle/profile/ReportGeneratingProfileListener.java`
- `platforms/core-runtime/build-profile/src/test/groovy/org/gradle/profile/BuildProfileTest.groovy`
- `platforms/core-runtime/build-profile/src/test/groovy/org/gradle/profile/ProfileReportRendererTest.groovy`
- `platforms/core-runtime/launcher/src/integTest/groovy/org/gradle/launcher/EnablingParallelExecutionIntegrationTest.groovy`
- `platforms/core-runtime/launcher/src/integTest/groovy/org/gradle/launcher/cli/MaxWorkersIntegrationTest.groovy`
- `platforms/core-runtime/launcher/src/main/java/org/gradle/tooling/internal/provider/FileSystemWatchingBuildActionRunner.java`
- `platforms/core-runtime/launcher/src/test/groovy/org/gradle/tooling/internal/provider/FileSystemWatchingBuildActionRunnerTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/execution/taskgraph/ParallelTaskExecutionIntegrationTest.groovy`
- `subprojects/core/src/main/java/org/gradle/api/internal/tasks/DefaultRealizableTaskCollection.java`
- `subprojects/core/src/main/java/org/gradle/api/internal/tasks/DefaultTaskContainer.java`
- `subprojects/core/src/main/java/org/gradle/api/internal/tasks/TaskStatistics.java`
- `subprojects/core/src/main/java/org/gradle/initialization/ParallelismBuildOptions.java`
- `subprojects/core/src/test/groovy/org/gradle/api/internal/tasks/DefaultRealizableTaskCollectionTest.groovy`
- `subprojects/core/src/test/groovy/org/gradle/api/internal/tasks/DefaultTaskContainerTest.groovy`
