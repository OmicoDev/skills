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

- `subprojects/core-api/src/main/java/org/gradle/api/tasks/LocalState.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/TaskOutputs.java`
- `subprojects/core/src/integTest/groovy/org/gradle/api/internal/changedetection/rules/OverlappingOutputsIntegrationTest.groovy`
