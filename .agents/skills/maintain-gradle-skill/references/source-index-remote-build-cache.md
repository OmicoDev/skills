# Gradle Remote Build Cache

## Documentation

- [Build Cache](https://docs.gradle.org/current/userguide/build_cache.html)
- [Build Cache (Gradle 7.1)](https://docs.gradle.org/7.1/userguide/build_cache.html)
- [Build Cache (Gradle 7.2)](https://docs.gradle.org/7.2/userguide/build_cache.html)
- [Build cache performance](https://docs.gradle.org/current/userguide/build_cache_performance.html)
- [Gradle 4.5 Release Notes](https://docs.gradle.org/4.5/release-notes.html)
- [HTTP Build Cache DSL](https://docs.gradle.org/current/dsl/org.gradle.caching.http.HttpBuildCache.html)
- [Use cases for the build cache](https://docs.gradle.org/current/userguide/build_cache_use_cases.html)

## Source Code

- `platforms/core-execution/build-cache-core/src/integTest/groovy/org/gradle/caching/configuration/internal/BuildCacheCompositeConfigurationIntegrationTest.groovy`
- `platforms/core-execution/build-cache-core/src/integTest/groovy/org/gradle/caching/configuration/internal/BuildCacheConfigurationIntegrationTest.groovy`
- `platforms/core-execution/build-cache-core/src/main/java/org/gradle/caching/configuration/internal/DefaultBuildCacheConfiguration.java`
- `platforms/core-execution/build-cache-core/src/main/java/org/gradle/caching/internal/services/AbstractBuildCacheControllerFactory.java`
- `platforms/core-execution/build-cache-core/src/main/java/org/gradle/caching/internal/services/DefaultBuildCacheControllerFactory.java`
- `platforms/core-execution/build-cache-http/src/integTest/groovy/org/gradle/caching/http/internal/HttpBuildCacheServiceErrorHandlingIntegrationTest.groovy`
- `platforms/core-execution/build-cache-http/src/integTest/groovy/org/gradle/caching/http/internal/HttpBuildCacheServiceIntegrationTest.groovy`
- `platforms/core-execution/build-cache-http/src/integTest/groovy/org/gradle/caching/http/internal/HttpBuildCacheServiceTest.groovy`
- `platforms/core-execution/build-cache-http/src/main/java/org/gradle/caching/http/HttpBuildCache.java`
- `platforms/core-execution/build-cache-http/src/main/java/org/gradle/caching/http/internal/DefaultHttpBuildCacheServiceFactory.java`
- `platforms/core-execution/build-cache-http/src/main/java/org/gradle/caching/http/internal/HttpBuildCacheService.java`
- `platforms/core-execution/build-cache-packaging/src/main/java/org/gradle/caching/internal/packaging/impl/GZipBuildCacheEntryPacker.java`
- `platforms/core-execution/build-cache-packaging/src/main/java/org/gradle/caching/internal/packaging/impl/TarBuildCacheEntryPacker.java`
- `platforms/core-execution/build-cache-spi/src/main/java/org/gradle/caching/BuildCacheEntryReader.java`
- `platforms/core-execution/build-cache-spi/src/main/java/org/gradle/caching/BuildCacheService.java`
- `platforms/core-execution/build-cache/src/integTest/groovy/org/gradle/caching/internal/BuildCacheBuildOperationsIntegrationTest.groovy`
- `platforms/core-execution/build-cache/src/main/java/org/gradle/caching/internal/controller/DefaultBuildCacheController.java`
- `platforms/core-execution/build-cache/src/main/java/org/gradle/caching/internal/controller/service/BaseLocalBuildCacheServiceHandle.java`
- `platforms/core-execution/build-cache/src/main/java/org/gradle/caching/internal/controller/service/BaseRemoteBuildCacheServiceHandle.java`
- `platforms/core-execution/build-cache/src/main/java/org/gradle/caching/internal/controller/service/LoadTarget.java`
- `platforms/core-execution/build-cache/src/main/java/org/gradle/caching/internal/controller/service/OpFiringLocalBuildCacheServiceHandle.java`
- `platforms/core-execution/build-cache/src/main/java/org/gradle/caching/internal/controller/service/OpFiringRemoteBuildCacheServiceHandle.java`
- `platforms/core-execution/build-cache/src/test/groovy/org/gradle/caching/internal/controller/DefaultBuildCacheControllerTest.groovy`
- `platforms/core-execution/build-cache/src/test/groovy/org/gradle/caching/internal/controller/service/LoadTargetTest.groovy`
- `platforms/core-execution/execution/src/main/java/org/gradle/internal/execution/steps/BuildCacheStep.java`
- `subprojects/core/src/integTest/groovy/org/gradle/api/tasks/CacheTaskArchiveErrorIntegrationTest.groovy`
