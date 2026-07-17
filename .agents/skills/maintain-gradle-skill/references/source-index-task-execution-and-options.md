# Gradle Task Execution And Options

## Documentation

- [Advanced Tasks](https://docs.gradle.org/current/userguide/custom_tasks.html)
- [Best Practices for Tasks](https://docs.gradle.org/current/userguide/best_practices_tasks.html)
- [Command-Line Interface](https://docs.gradle.org/current/userguide/command_line_interface.html)
- [Controlling Task Execution](https://docs.gradle.org/current/userguide/controlling_task_execution.html)
- [Organizing Tasks](https://docs.gradle.org/current/userguide/organizing_tasks.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)

## Source Code

- `platforms/core-configuration/base-diagnostics/src/integTest/groovy/org/gradle/api/tasks/diagnostics/TaskGraphIntegrationTest.groovy`
- `platforms/core-configuration/base-diagnostics/src/integTest/groovy/org/gradle/api/tasks/diagnostics/TaskReportTaskIntegrationTest.groovy`
- `platforms/core-configuration/base-diagnostics/src/main/java/org/gradle/api/tasks/diagnostics/TaskReportTask.java`
- `platforms/core-configuration/base-diagnostics/src/main/java/org/gradle/api/tasks/diagnostics/internal/TaskDetails.java`
- `platforms/core-configuration/base-diagnostics/src/main/java/org/gradle/api/tasks/diagnostics/internal/TaskReportRenderer.java`
- `platforms/core-configuration/model-core/src/main/java/org/gradle/api/internal/tasks/DefaultTaskDependency.java`
- `platforms/core-runtime/start-parameter/src/main/java/org/gradle/StartParameter.java`
- `platforms/core-runtime/start-parameter/src/main/java/org/gradle/initialization/StartParameterBuildOptions.java`
- `platforms/documentation/docs/src/snippets/best-practices/avoidDependsOn-avoid/kotlin/build.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/avoidDependsOn-do/kotlin/build.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/groupTasks-avoid/kotlin/app/build.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/groupTasks-do/kotlin/app/build.gradle.kts`
- `platforms/ide/tooling-api/src/crossVersionTest/groovy/org/gradle/integtests/tooling/r68/CompositeBuildTaskExecutionCrossVersionSpec.groovy`
- `platforms/jvm/plugins-java/src/integTest/groovy/org/gradle/integtests/JavaProjectIntegrationTest.groovy`
- `platforms/jvm/plugins-java/src/main/java/org/gradle/api/plugins/JavaPlugin.java`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/ConfigurationBuildDependenciesIntegrationTest.groovy`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/configurations/DefaultConfiguration.java`
- `subprojects/composite-builds/src/integTest/groovy/org/gradle/integtests/composite/CompositeBuildTaskExecutionIntegrationTest.groovy`
- `subprojects/core-api/src/main/java/org/gradle/api/Task.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/Configuration.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/StopExecutionException.java`
- `subprojects/core/src/integTest/groovy/org/gradle/NameValidationIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/TaskProvenanceReportingIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/tasks/GradleBuildTaskIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/tasks/TaskDependencyIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/tasks/options/MultipleTaskOptionsIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/tasks/options/TaskOptionFailureIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/tasks/options/TaskOptionIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/execution/taskgraph/ParallelTaskExecutionIntegrationTest.groovy`
- `subprojects/core/src/main/java/org/gradle/api/internal/tasks/TaskOptionsGenerator.java`
- `subprojects/core/src/main/java/org/gradle/api/internal/tasks/TaskProvenanceUtil.java`
- `subprojects/core/src/main/java/org/gradle/api/internal/tasks/options/BooleanOptionElement.java`
- `subprojects/core/src/main/java/org/gradle/api/internal/tasks/options/OptionReader.java`
- `subprojects/core/src/main/java/org/gradle/api/tasks/GradleBuild.java`
- `subprojects/core/src/main/java/org/gradle/api/tasks/StopActionException.java`
- `subprojects/core/src/main/java/org/gradle/execution/plan/MissingTaskDependencyDetector.java`
- `subprojects/core/src/main/java/org/gradle/initialization/ProjectPropertySettingBuildLoader.java`
- `subprojects/core/src/main/java/org/gradle/internal/execution/TaskGraphBuildExecutionAction.java`
- `subprojects/core/src/test/groovy/org/gradle/api/internal/tasks/TaskProvenanceUtilTest.groovy`
- `subprojects/core/src/test/groovy/org/gradle/api/internal/tasks/options/OptionReaderTest.groovy`
