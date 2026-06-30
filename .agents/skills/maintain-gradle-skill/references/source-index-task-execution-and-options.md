# Gradle Task Execution And Options

## Documentation

- [Advanced Tasks](https://docs.gradle.org/current/userguide/custom_tasks.html)
- [Best Practices for Tasks](https://docs.gradle.org/current/userguide/best_practices_tasks.html)
- [Command-Line Interface](https://docs.gradle.org/current/userguide/command_line_interface.html)
- [Controlling Task Execution](https://docs.gradle.org/current/userguide/controlling_task_execution.html)
- [Organizing Tasks](https://docs.gradle.org/current/userguide/organizing_tasks.html)

## Source Code

- `platforms/core-configuration/base-diagnostics/src/integTest/groovy/org/gradle/api/tasks/diagnostics/TaskGraphIntegrationTest.groovy`
- `platforms/core-configuration/base-diagnostics/src/integTest/groovy/org/gradle/api/tasks/diagnostics/TaskReportTaskIntegrationTest.groovy`
- `platforms/core-configuration/base-diagnostics/src/main/java/org/gradle/api/tasks/diagnostics/TaskReportTask.java`
- `platforms/core-configuration/base-diagnostics/src/main/java/org/gradle/api/tasks/diagnostics/internal/TaskDetails.java`
- `platforms/core-configuration/base-diagnostics/src/main/java/org/gradle/api/tasks/diagnostics/internal/TaskReportRenderer.java`
- `platforms/core-runtime/start-parameter/src/main/java/org/gradle/StartParameter.java`
- `platforms/core-runtime/start-parameter/src/main/java/org/gradle/initialization/StartParameterBuildOptions.java`
- `subprojects/core-api/src/main/java/org/gradle/api/Task.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/StopExecutionException.java`
- `subprojects/core/src/integTest/groovy/org/gradle/NameValidationIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/TaskProvenanceReportingIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/tasks/options/MultipleTaskOptionsIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/tasks/options/TaskOptionFailureIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/execution/taskgraph/ParallelTaskExecutionIntegrationTest.groovy`
- `subprojects/core/src/main/java/org/gradle/api/internal/tasks/TaskOptionsGenerator.java`
- `subprojects/core/src/main/java/org/gradle/api/internal/tasks/TaskProvenanceUtil.java`
- `subprojects/core/src/main/java/org/gradle/api/internal/tasks/options/OptionReader.java`
- `subprojects/core/src/main/java/org/gradle/api/tasks/StopActionException.java`
- `subprojects/core/src/main/java/org/gradle/internal/execution/TaskGraphBuildExecutionAction.java`
- `subprojects/core/src/test/groovy/org/gradle/api/internal/tasks/TaskProvenanceUtilTest.groovy`
- `subprojects/core/src/test/groovy/org/gradle/api/internal/tasks/options/OptionReaderTest.groovy`
