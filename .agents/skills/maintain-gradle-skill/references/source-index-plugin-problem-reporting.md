# Gradle Plugin Problem Reporting

## Documentation

- [Build Environment Configuration](https://docs.gradle.org/current/userguide/build_environment.html)
- [Command-Line Interface](https://docs.gradle.org/current/userguide/command_line_interface.html)
- [Reporting Plugin Problems with the Problems API](https://docs.gradle.org/current/userguide/reporting_problems.html#sec:generated_html_report)
- [Reporting Plugin Problems with the Problems API](https://docs.gradle.org/current/userguide/reporting_problems.html#sec:receiving_problem_reports)
- [Reporting Plugin Problems with the Problems API](https://docs.gradle.org/current/userguide/reporting_problems.html)

## Source Code

- `platforms/core-execution/worker-process-services/src/main/java/org/gradle/process/internal/worker/DefaultWorkerProblemProtocol.java`
- `platforms/core-execution/workers/src/integTest/groovy/org/gradle/workers/internal/WorkerExecutorProblemsApiIntegrationTest.groovy`
- `platforms/ide/problems-api/src/main/java/org/gradle/api/problems/AdditionalData.java`
- `platforms/ide/problems-api/src/main/java/org/gradle/api/problems/ProblemGroup.java`
- `platforms/ide/problems-api/src/main/java/org/gradle/api/problems/ProblemId.java`
- `platforms/ide/problems-api/src/main/java/org/gradle/api/problems/ProblemReporter.java`
- `platforms/ide/problems-api/src/main/java/org/gradle/api/problems/ProblemSpec.java`
- `platforms/ide/problems-api/src/main/java/org/gradle/api/problems/Problems.java`
- `platforms/ide/problems-api/src/main/java/org/gradle/api/problems/internal/AdditionalDataBuilderFactory.java`
- `platforms/ide/problems-api/src/main/java/org/gradle/api/problems/internal/DefaultProblemBuilder.java`
- `platforms/ide/problems-api/src/test/groovy/org/gradle/api/problems/internal/AdditionalDataBuilderFactoryTest.groovy`
- `platforms/ide/problems-api/src/test/groovy/org/gradle/api/problems/internal/DefaultProblemBuilderTest.groovy`
- `platforms/ide/problems-api/src/test/groovy/org/gradle/api/problems/internal/ProblemIdAndProblemGroupTest.groovy`
- `platforms/ide/tooling-api/src/crossVersionTest/groovy/org/gradle/integtests/tooling/r89/ProblemProgressEventCrossVersionSpec.groovy`
- `platforms/ide/tooling-api/src/main/java/org/gradle/tooling/Failure.java`
- `platforms/ide/tooling-api/src/main/java/org/gradle/tooling/GradleConnectionException.java`
- `platforms/ide/tooling-api/src/main/java/org/gradle/tooling/LongRunningOperation.java`
- `platforms/ide/tooling-api/src/main/java/org/gradle/tooling/events/FailureResult.java`
- `platforms/ide/tooling-api/src/main/java/org/gradle/tooling/events/OperationType.java`
- `platforms/ide/tooling-api/src/main/java/org/gradle/tooling/events/problems/ProblemGroup.java`
- `platforms/ide/tooling-api/src/main/java/org/gradle/tooling/events/problems/ProblemId.java`
- `platforms/ide/tooling-api/src/main/java/org/gradle/tooling/events/problems/ProblemSummariesEvent.java`
- `platforms/ide/tooling-api/src/main/java/org/gradle/tooling/events/problems/ProblemSummary.java`
- `platforms/ide/tooling-api/src/main/java/org/gradle/tooling/events/problems/SingleProblemEvent.java`
