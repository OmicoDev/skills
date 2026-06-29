# Gradle Dependency Artifact Selection

## Documentation

- [Artifact Resolution](https://docs.gradle.org/current/userguide/artifact_resolution.html)
- [Artifact Views](https://docs.gradle.org/current/userguide/artifact_views.html)
- [How to Share Artifacts Between Projects with Gradle](https://docs.gradle.org/current/userguide/how_to_share_outputs_between_projects.html)
- [Resolving Specific Artifacts](https://docs.gradle.org/current/userguide/resolving_specific_artifacts.html)
- [Upgrading from 8 to 9](https://docs.gradle.org/current/userguide/upgrading_version_8.html)

## Source Code

- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/UnsafeConfigurationResolutionDeprecationIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/attributes/ArtifactViewArtifactSelectionIntegrationTest.groovy`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ArtifactCollection.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ArtifactView.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/LenientConfiguration.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ResolvableDependencies.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/dsl/DependencyHandler.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/query/ArtifactResolutionQuery.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/result/ResolvedArtifactResult.java`
