# Gradle Model Boundaries

## Documentation

- [Avoiding Unnecessary Task Configuration](https://docs.gradle.org/current/userguide/task_configuration_avoidance.html)
- [Build Environment Configuration](https://docs.gradle.org/current/userguide/build_environment.html)
- [Build Execution Model](https://github.com/gradle/gradle/blob/master/architecture/build-execution-model.md)
- [Build Lifecycle](https://docs.gradle.org/current/userguide/build_lifecycle.html)
- [Build State Model](https://github.com/gradle/gradle/blob/master/architecture/build-state-model.md)
- [Dataflow Actions](https://docs.gradle.org/current/userguide/dataflow_actions.html)
- [Dependency Configurations](https://docs.gradle.org/current/userguide/dependency_configurations.html)
- [Gradle Runtimes](https://github.com/gradle/gradle/blob/master/architecture/runtimes.md)
- [Initialization Scripts and Init Plugins](https://docs.gradle.org/current/userguide/init_scripts.html)
- [Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html)
- [Lazy vs Eager Evaluation](https://docs.gradle.org/current/userguide/lazy_eager_evaluation.html)
- [Toolchains for JVM projects](https://docs.gradle.org/current/userguide/toolchains.html)
- [Variant Selection and Attribute Matching](https://docs.gradle.org/current/userguide/variant_aware_resolution.html)

## Source Code

- `platforms/core-configuration/configuration-cache/src/integTest/groovy/org/gradle/internal/cc/impl/isolated/IsolatedProjectsBuildStateAccessIntegrationTest.groovy`
- `platforms/core-runtime/base-services/src/main/java/org/gradle/api/IsolatedAction.java`
- `subprojects/composite-builds/src/main/java/org/gradle/composite/internal/DefaultBuildTreeLocalComponentProvider.java`
- `subprojects/core-api/src/main/java/org/gradle/api/Project.java`
- `subprojects/core-api/src/main/java/org/gradle/api/invocation/Gradle.java`
- `subprojects/core-api/src/main/java/org/gradle/api/invocation/GradleLifecycle.java`
- `subprojects/core-api/src/test/groovy/org/gradle/api/internal/project/ProjectIdentityTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/build/event/BuildEventsIntegrationTest.groovy`
- `subprojects/core/src/main/java/org/gradle/api/internal/project/DefaultProjectState.java`
- `subprojects/core/src/main/java/org/gradle/api/internal/project/DefaultProjectStateRegistry.java`
- `subprojects/core/src/main/java/org/gradle/api/internal/project/ProjectState.java`
- `subprojects/core/src/main/java/org/gradle/internal/build/BuildState.java`
- `subprojects/core/src/main/java/org/gradle/internal/build/BuildStateRegistry.java`
