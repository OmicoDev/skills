# Gradle Commands And Evidence

## Documentation

- [Build Environment Configuration](https://docs.gradle.org/current/userguide/build_environment.html)
- [Build Scan](https://docs.gradle.org/current/userguide/inspect.html)
- [Command-Line Interface](https://docs.gradle.org/current/userguide/command_line_interface.html)
- [Gradle 7.5 dependencyInsight CLI option rename](https://docs.gradle.org/7.5/userguide/upgrading_version_7.html)
- [Gradle 7.6 individual task rerun](https://docs.gradle.org/7.6/release-notes.html)
- [Gradle 8.0.1 no-rebuild restoration](https://docs.gradle.org/8.0.1/release-notes.html)
- [Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html)
- [Logging and Output](https://docs.gradle.org/current/userguide/logging.html)
- [The Build Dashboard Plugin](https://docs.gradle.org/current/userguide/build_dashboard_plugin.html)
- [The Project Report Plugin](https://docs.gradle.org/current/userguide/project_report_plugin.html)
- [Understanding Tasks](https://docs.gradle.org/current/userguide/more_about_tasks.html)
- [Viewing and Debugging Dependencies](https://docs.gradle.org/current/userguide/viewing_debugging_dependencies.html)

## Source Code

- `platforms/core-configuration/base-diagnostics/src/integTest/groovy/org/gradle/api/tasks/diagnostics/HelpTaskIntegrationTest.groovy`
- `platforms/core-configuration/base-diagnostics/src/integTest/groovy/org/gradle/api/tasks/diagnostics/TaskGraphIntegrationTest.groovy`
- `platforms/core-configuration/base-diagnostics/src/integTest/groovy/org/gradle/api/tasks/diagnostics/TaskReportTaskIntegrationTest.groovy`
- `platforms/core-configuration/base-diagnostics/src/main/java/org/gradle/api/tasks/diagnostics/TaskReportTask.java`
- `platforms/core-configuration/base-diagnostics/src/main/java/org/gradle/api/tasks/diagnostics/internal/TaskDetails.java`
- `platforms/core-configuration/base-diagnostics/src/main/java/org/gradle/api/tasks/diagnostics/internal/TaskReportRenderer.java`
- `platforms/core-configuration/base-diagnostics/src/main/java/org/gradle/configuration/TaskDetailPrinter.java`
- `platforms/core-configuration/base-diagnostics/src/main/java/org/gradle/configuration/TaskDetailsModel.java`
- `platforms/core-runtime/daemon-services/src/main/java/org/gradle/api/internal/tasks/userinput/NonInteractiveUserInputHandler.java`
- `platforms/core-runtime/logging/src/integTest/groovy/org/gradle/internal/logging/console/ConsoleNoColorIntegrationTest.groovy`
- `platforms/core-runtime/logging/src/main/java/org/gradle/internal/logging/LoggingConfigurationBuildOptions.java`
- `platforms/core-runtime/logging/src/main/java/org/gradle/internal/logging/sink/OutputEventRenderer.java`
- `platforms/core-runtime/start-parameter/src/main/java/org/gradle/initialization/StartParameterBuildOptions.java`
- `platforms/ide/problems-api/src/integTest/groovy/org/gradle/api/problems/ProblemsServiceIntegrationTest.groovy`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/ivyservice/resolveengine/artifact/ResolvedArtifactsGraphVisitor.java`
- `platforms/software/software-diagnostics/src/integTest/groovy/org/gradle/api/tasks/diagnostics/DependencyInsightReportTaskIntegrationTest.groovy`
- `platforms/software/software-diagnostics/src/integTest/groovy/org/gradle/api/tasks/diagnostics/OutgoingVariantsReportTaskIntegrationTest.groovy`
- `platforms/software/software-diagnostics/src/integTest/groovy/org/gradle/api/tasks/diagnostics/ResolvableConfigurationsReportTaskIntegrationTest.groovy`
- `platforms/software/software-diagnostics/src/main/java/org/gradle/api/tasks/diagnostics/DependencyInsightReportTask.java`
- `platforms/software/software-diagnostics/src/main/java/org/gradle/api/tasks/diagnostics/OutgoingVariantsReportTask.java`
- `platforms/software/software-diagnostics/src/main/java/org/gradle/api/tasks/diagnostics/ResolvableConfigurationsReportTask.java`
- `subprojects/core/src/integTest/groovy/org/gradle/api/ConfigurationOnDemandIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/internal/tasks/userinput/UserInputHandlingIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/tasks/CachedTaskExecutionIntegrationTest.groovy`
- `subprojects/core/src/main/java/org/gradle/api/internal/tasks/TaskOptionsGenerator.java`
- `subprojects/core/src/main/java/org/gradle/internal/execution/TaskGraphBuildExecutionAction.java`
