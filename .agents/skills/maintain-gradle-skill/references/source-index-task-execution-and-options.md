# Gradle Task Execution And Options

## Documentation

- [Advanced Tasks](https://docs.gradle.org/current/userguide/custom_tasks.html)
- [Best Practices for Tasks](https://docs.gradle.org/current/userguide/best_practices_tasks.html)
- [Command-Line Interface](https://docs.gradle.org/current/userguide/command_line_interface.html)
- [Controlling Task Execution](https://docs.gradle.org/current/userguide/controlling_task_execution.html)
- [Organizing Tasks](https://docs.gradle.org/current/userguide/organizing_tasks.html)

## Source Code

- `subprojects/core-api/src/main/java/org/gradle/api/Task.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/StopExecutionException.java`
- `subprojects/core/src/integTest/groovy/org/gradle/NameValidationIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/tasks/options/MultipleTaskOptionsIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/tasks/options/TaskOptionFailureIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/execution/taskgraph/ParallelTaskExecutionIntegrationTest.groovy`
- `subprojects/core/src/main/java/org/gradle/api/internal/tasks/TaskOptionsGenerator.java`
- `subprojects/core/src/main/java/org/gradle/api/internal/tasks/options/OptionReader.java`
- `subprojects/core/src/main/java/org/gradle/api/tasks/StopActionException.java`
- `subprojects/core/src/test/groovy/org/gradle/api/internal/tasks/options/OptionReaderTest.groovy`
