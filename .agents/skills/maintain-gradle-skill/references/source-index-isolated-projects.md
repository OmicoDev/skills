# Gradle Isolated Projects

## Documentation

- [Configuration Cache](https://docs.gradle.org/current/userguide/configuration_cache.html)
- [Improve the Performance of Gradle Builds](https://docs.gradle.org/current/userguide/performance.html)
- [Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html)
- [Sharing Build Logic using buildSrc](https://docs.gradle.org/current/userguide/sharing_build_logic_between_subprojects.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)
- [Using Shared Build Services](https://docs.gradle.org/current/userguide/build_services.html)

## Source Code

- `platforms/core-configuration/configuration-cache/src/integTest/groovy/org/gradle/internal/cc/impl/isolated/IsolatedProjectsBuildStateAccessIntegrationTest.groovy`
- `platforms/core-configuration/configuration-cache/src/integTest/groovy/org/gradle/internal/cc/impl/isolated/IsolatedProjectsTaskPathDependencyIntegrationTest.groovy`
- `platforms/core-configuration/configuration-cache/src/integTest/groovy/org/gradle/internal/cc/impl/isolated/IsolatedProjectsToolingApiInvocationValidationIntegrationTest.groovy`
- `platforms/core-configuration/configuration-cache/src/main/kotlin/org/gradle/internal/cc/impl/ProblemReportingCrossBuildModelAccess.kt`
- `platforms/core-runtime/base-services/src/main/java/org/gradle/api/IsolatedAction.java`
- `subprojects/core-api/src/main/java/org/gradle/api/invocation/GradleLifecycle.java`
- `subprojects/core-api/src/main/java/org/gradle/api/project/IsolatedProject.java`
- `subprojects/core/src/main/java/org/gradle/api/internal/project/CrossBuildModelAccess.java`
- `subprojects/core/src/main/java/org/gradle/api/internal/project/DefaultCrossBuildModelAccess.java`
