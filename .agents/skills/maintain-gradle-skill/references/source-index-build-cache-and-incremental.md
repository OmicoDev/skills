# Gradle Build Cache And Incremental Work

## Documentation

- [Best Practices for Performance](https://docs.gradle.org/current/userguide/best_practices_performance.html)
- [Build Cache](https://docs.gradle.org/current/userguide/build_cache.html)
- [Build cache performance](https://docs.gradle.org/current/userguide/build_cache_performance.html)
- [Debugging and diagnosing Build Cache misses](https://docs.gradle.org/current/userguide/build_cache_debugging.html)
- [Important concepts](https://docs.gradle.org/current/userguide/build_cache_concepts.html)
- [Incremental Build](https://docs.gradle.org/current/userguide/incremental_build.html)
- [Solving common problems](https://docs.gradle.org/current/userguide/common_caching_problems.html)
- [Use cases for the build cache](https://docs.gradle.org/current/userguide/build_cache_use_cases.html)

## Source Code

- `platforms/core-execution/build-cache-core/src/main/java/org/gradle/caching/internal/services/BuildCacheControllerFactory.java`
- `platforms/core-execution/build-cache-core/src/main/java/org/gradle/caching/internal/services/DefaultBuildCacheControllerFactory.java`
- `platforms/core-execution/build-cache-core/src/main/java/org/gradle/caching/local/internal/DirectoryBuildCacheServiceFactory.java`
- `platforms/core-execution/build-cache-local/src/integTest/groovy/org/gradle/caching/BuildCacheLocalCacheIntegrationTest.groovy`
- `platforms/core-execution/build-cache-spi/src/main/java/org/gradle/caching/BuildCacheService.java`
- `platforms/core-execution/build-cache/src/main/java/org/gradle/caching/internal/controller/DefaultBuildCacheController.java`
- `platforms/core-execution/build-cache/src/test/groovy/org/gradle/caching/internal/controller/DefaultBuildCacheControllerTest.groovy`
- `platforms/core-execution/execution/src/main/java/org/gradle/internal/execution/caching/CachingDisabledReasonCategory.java`
- `platforms/core-execution/execution/src/main/java/org/gradle/internal/execution/caching/impl/DefaultCachingStateFactory.java`
- `platforms/core-execution/execution/src/main/java/org/gradle/internal/execution/steps/AbstractResolveCachingStateStep.java`
- `platforms/core-execution/execution/src/main/java/org/gradle/internal/execution/steps/BuildCacheStep.java`
- `platforms/core-execution/execution/src/main/java/org/gradle/internal/execution/steps/HandleStaleOutputsStep.java`
- `platforms/core-execution/execution/src/main/java/org/gradle/internal/execution/steps/ResolveChangesStep.java`
- `platforms/core-execution/execution/src/main/java/org/gradle/internal/execution/steps/ResolveImmutableCachingStateStep.java`
- `platforms/core-execution/execution/src/main/java/org/gradle/internal/execution/steps/ResolveInputChangesStep.java`
- `platforms/core-execution/execution/src/main/java/org/gradle/internal/execution/steps/ResolveMutableCachingStateStep.java`
- `platforms/core-execution/execution/src/main/java/org/gradle/internal/execution/steps/SkipUpToDateStep.java`
- `platforms/core-execution/normalization-api/src/main/java/org/gradle/normalization/InputNormalization.java`
- `platforms/core-execution/normalization-api/src/main/java/org/gradle/normalization/PropertiesFileNormalization.java`
- `platforms/core-execution/normalization-api/src/main/java/org/gradle/normalization/RuntimeClasspathNormalization.java`
- `platforms/core-execution/normalization/src/integTest/groovy/org/gradle/normalization/ConfigureRuntimeClasspathNormalizationIntegrationTest.groovy`
- `platforms/core-execution/normalization/src/test/groovy/org/gradle/normalization/internal/DefaultRuntimeClasspathNormalizationTest.groovy`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/LocalState.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/TaskOutputs.java`
- `subprojects/core/src/integTest/groovy/org/gradle/api/internal/changedetection/rules/OverlappingOutputsIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/tasks/CachedCustomTaskExecutionIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/tasks/CachedTaskExecutionIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/tasks/UntrackedTaskIntegrationTest.groovy`
- `subprojects/core/src/main/java/org/gradle/api/internal/changedetection/changes/DefaultTaskExecutionModeResolver.java`
- `subprojects/core/src/main/java/org/gradle/api/internal/tasks/execution/DefaultTaskCacheabilityResolver.java`
- `subprojects/core/src/test/groovy/org/gradle/api/internal/changedetection/changes/DefaultTaskExecutionModeResolverTest.groovy`
- `subprojects/core/src/test/groovy/org/gradle/api/internal/tasks/execution/DefaultTaskCacheabilityResolverTest.groovy`
