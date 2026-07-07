# Gradle Dependency Locking

## Documentation

- [Configuration Cache Debugging](https://docs.gradle.org/current/userguide/configuration_cache_debugging.html)
- [How to Prevent Accidental or Eager Dependency Upgrades in Gradle](https://docs.gradle.org/current/userguide/how_to_prevent_accidental_dependency_upgrades.html)
- [Locking Versions](https://docs.gradle.org/current/userguide/dependency_locking.html)
- [Upgrading from 8 to 9](https://docs.gradle.org/current/userguide/upgrading_version_8.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)

## Source Code

- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/BeforeResolveIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/ConfigurationCacheDependencyResolutionFeaturesIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/locking/AbstractLockingIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/locking/DependencyLockingStrictModeIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/locking/LockingInteractionsIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/locking/MixedDependencyLockingIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/locking/MultiProjectDependencyLockingIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/locking/UsingLockingOnNonProjectConfigurationsIntegrationTest.groovy`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/ivyservice/ResolutionExecutor.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/internal/locking/DefaultDependencyLockingProvider.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/internal/locking/DependencyLockingGraphVisitor.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/internal/locking/LockFileReaderWriter.java`
- `platforms/software/dependency-management/src/test/groovy/org/gradle/internal/locking/DefaultDependencyLockingProviderTest.groovy`
- `platforms/software/dependency-management/src/test/groovy/org/gradle/internal/locking/LockFileReaderWriterTest.groovy`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ResolutionStrategy.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ResolvableDependencies.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/dsl/DependencyLockingHandler.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/dsl/LockMode.java`
