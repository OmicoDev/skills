# Gradle Tooling API

## Documentation

- [Gradle & Third-party Tools](https://docs.gradle.org/current/userguide/third_party_integration.html)
- [Gradle 9.4 Release Notes](https://docs.gradle.org/9.4.0/release-notes.html)
- [Gradle Build Environment](https://docs.gradle.org/9.6.1/userguide/build_environment.html)
- [Improve the Performance of Gradle Builds](https://docs.gradle.org/9.6.1/userguide/performance.html#sec:configure_tooling_api_actions_parallelism)
- [Isolated Projects](https://docs.gradle.org/9.6.1/userguide/isolated_projects.html#sec:parallel_model_building)
- [Tooling API](https://docs.gradle.org/current/userguide/tooling_api.html)

## Source Code

- `platforms/core-configuration/configuration-cache/src/integTest/groovy/org/gradle/internal/cc/impl/isolated/IsolatedProjectsToolingApiKotlinDslIntegrationTest.groovy`
- `platforms/core-configuration/configuration-cache/src/main/kotlin/org/gradle/internal/buildtree/control/BuildModelParametersProvider.kt`
- `platforms/core-configuration/configuration-cache/src/test/groovy/org/gradle/internal/buildtree/BuildModelParametersProviderTest.groovy`
- `platforms/core-configuration/kotlin-dsl-tooling-builders/src/crossVersionTest/groovy/org/gradle/kotlin/dsl/tooling/builders/r68/KotlinDslDefaultScriptsModelCrossVersionSpec.groovy`
- `platforms/core-configuration/kotlin-dsl-tooling-builders/src/crossVersionTest/groovy/org/gradle/kotlin/dsl/tooling/builders/r68/KotlinDslGivenScriptsModelCrossVersionSpec.groovy`
- `platforms/core-configuration/kotlin-dsl-tooling-builders/src/main/kotlin/org/gradle/kotlin/dsl/tooling/builders/KotlinDslScriptsModelBuilder.kt`
- `platforms/core-configuration/kotlin-dsl-tooling-builders/src/main/kotlin/org/gradle/kotlin/dsl/tooling/builders/internal/IsolatedProjectsSafeKotlinDslScriptsModelBuilder.kt`
- `platforms/core-configuration/kotlin-dsl-tooling-builders/src/main/kotlin/org/gradle/kotlin/dsl/tooling/builders/internal/KotlinScriptingModelBuildersRegistrant.kt`
- `platforms/core-configuration/kotlin-dsl-tooling-builders/src/testFixtures/groovy/org/gradle/kotlin/dsl/tooling/fixtures/KotlinScriptModelParameters.groovy`
- `platforms/core-runtime/start-parameter/src/main/java/org/gradle/initialization/StartParameterBuildOptions.java`
- `platforms/ide/tooling-api-builders/src/main/java/org/gradle/tooling/internal/provider/runner/DefaultBuildController.java`
- `platforms/ide/tooling-api-builders/src/main/java/org/gradle/tooling/internal/provider/runner/DefaultInternalFetchModelResult.java`
- `platforms/ide/tooling-api/src/crossVersionTest/groovy/org/gradle/integtests/tooling/r61/InvalidateVirtualFileSystemAfterChangeCrossVersionSpec.groovy`
- `platforms/ide/tooling-api/src/crossVersionTest/groovy/org/gradle/integtests/tooling/r68/CompositeBuildTestLauncherCrossVersionSpec.groovy`
- `platforms/ide/tooling-api/src/crossVersionTest/groovy/org/gradle/integtests/tooling/r930/ResilientGradleBuildBuilderCrossVersionSpec.groovy`
- `platforms/ide/tooling-api/src/crossVersionTest/groovy/org/gradle/integtests/tooling/r940/ParallelActionExecutionCrossVersionSpec.groovy`
- `platforms/ide/tooling-api/src/main/java/org/gradle/tooling/BuildController.java`
- `platforms/ide/tooling-api/src/main/java/org/gradle/tooling/BuildLauncher.java`
- `platforms/ide/tooling-api/src/main/java/org/gradle/tooling/FetchModelResult.java`
- `platforms/ide/tooling-api/src/main/java/org/gradle/tooling/GradleConnector.java`
- `platforms/ide/tooling-api/src/main/java/org/gradle/tooling/LongRunningOperation.java`
- `platforms/ide/tooling-api/src/main/java/org/gradle/tooling/ModelBuilder.java`
- `platforms/ide/tooling-api/src/main/java/org/gradle/tooling/ProjectConnection.java`
- `platforms/ide/tooling-api/src/main/java/org/gradle/tooling/TestLauncher.java`
- `platforms/ide/tooling-api/src/main/java/org/gradle/tooling/internal/consumer/DefaultFetchModelResult.java`
- `platforms/ide/tooling-api/src/main/java/org/gradle/tooling/internal/consumer/connection/FetchAwareBuildControllerAdapter.java`
- `platforms/ide/tooling-api/src/main/java/org/gradle/tooling/model/kotlin/dsl/KotlinDslModelsParameters.java`
- `platforms/ide/tooling-api/src/main/java/org/gradle/tooling/model/kotlin/dsl/KotlinDslScriptsModel.java`
- `subprojects/core-api/src/main/java/org/gradle/tooling/provider/model/ToolingModelBuilderRegistry.java`
