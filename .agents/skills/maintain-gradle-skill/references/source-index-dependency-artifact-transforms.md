# Gradle Dependency Artifact Transforms

## Documentation

- [Artifact Transforms](https://docs.gradle.org/current/userguide/artifact_transforms.html)
- [Artifact Views](https://docs.gradle.org/current/userguide/artifact_views.html)
- [Build Cache](https://docs.gradle.org/current/userguide/build_cache.html)
- [Dealing with validation problems](https://docs.gradle.org/current/userguide/validation_problems.html)
- [Debugging and diagnosing Build Cache misses](https://docs.gradle.org/current/userguide/build_cache_debugging.html)
- [Using Shared Build Services](https://docs.gradle.org/current/userguide/build_services.html)

## Source Code

- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/LenientArtifactViewIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/transform/ArtifactTransformCachingIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/transform/ArtifactTransformIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/transform/ArtifactTransformParallelIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/transform/ArtifactTransformValuesInjectionIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/transform/ArtifactTransformWithDependenciesIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/transform/CrashingBuildsArtifactTransformIntegrationTest.groovy`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/transform/DefaultTransformOutputs.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/transform/TransformationChainsDisambiguator.java`
- `platforms/software/software-diagnostics/src/integTest/groovy/org/gradle/api/tasks/diagnostics/ArtifactTransformsReportTaskIntegrationTest.groovy`
- `platforms/software/software-diagnostics/src/main/java/org/gradle/api/tasks/diagnostics/artifact/transforms/ArtifactTransformReports.java`
- `platforms/software/software-diagnostics/src/main/java/org/gradle/api/tasks/diagnostics/internal/artifact/transforms/model/ArtifactTransformReportModelFactory.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ArtifactCollection.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ArtifactView.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/transform/TransformAction.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/transform/TransformOutputs.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/transform/TransformParameters.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/transform/TransformSpec.java`
