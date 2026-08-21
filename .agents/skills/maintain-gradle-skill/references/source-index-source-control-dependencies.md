# Gradle Source Control Dependencies

## Documentation

- [Command-Line Interface](https://docs.gradle.org/current/userguide/command_line_interface.html)
- [Configuration Cache Status (Gradle 9.6.1)](https://docs.gradle.org/9.6.1/userguide/configuration_cache_status.html)
- [GitVersionControlSpec API](https://docs.gradle.org/current/javadoc/org/gradle/vcs/git/GitVersionControlSpec.html)
- [How to Use a Local Fork](https://docs.gradle.org/current/userguide/how_to_use_local_forks.html)
- [Locking Versions](https://docs.gradle.org/current/userguide/dependency_locking.html)
- [SourceControl API](https://docs.gradle.org/current/javadoc/org/gradle/vcs/SourceControl.html)
- [VcsMappings API](https://docs.gradle.org/current/javadoc/org/gradle/vcs/VcsMappings.html)
- [VersionControlRepository API](https://docs.gradle.org/current/javadoc/org/gradle/vcs/VersionControlRepository.html)

## Source Code

- `platforms/core-configuration/configuration-cache/src/main/kotlin/org/gradle/internal/cc/impl/ConfigurationCacheState.kt`
- `platforms/documentation/docs/src/docs/userguide/reference/dependency-management/dependency-management/dependency_locking.adoc`
- `platforms/software/version-control/src/integTest/groovy/org/gradle/vcs/git/internal/SourceDependencyCleanupIntegrationTest.groovy`
- `platforms/software/version-control/src/integTest/groovy/org/gradle/vcs/internal/GitVcsIntegrationTest.groovy`
- `platforms/software/version-control/src/integTest/groovy/org/gradle/vcs/internal/GitVersionSelectionIntegrationTest.groovy`
- `platforms/software/version-control/src/integTest/groovy/org/gradle/vcs/internal/NestedSourceDependencyIntegrationTest.groovy`
- `platforms/software/version-control/src/integTest/groovy/org/gradle/vcs/internal/OfflineSourceDependencyIntegrationTest.groovy`
- `platforms/software/version-control/src/integTest/groovy/org/gradle/vcs/internal/SourceDependencyBuildLookupIntegrationTest.groovy`
- `platforms/software/version-control/src/integTest/groovy/org/gradle/vcs/internal/SourceDependencyConfigurationCacheIntegrationTest.groovy`
- `platforms/software/version-control/src/integTest/groovy/org/gradle/vcs/internal/SourceDependencyIncludedBuildIntegrationTest.groovy`
- `platforms/software/version-control/src/main/java/org/gradle/vcs/git/GitVersionControlSpec.java`
- `platforms/software/version-control/src/main/java/org/gradle/vcs/git/internal/GitVersionControlSystem.java`
- `platforms/software/version-control/src/main/java/org/gradle/vcs/internal/DefaultSourceControl.java`
- `platforms/software/version-control/src/main/java/org/gradle/vcs/internal/DefaultVcsMappingsStore.java`
- `platforms/software/version-control/src/main/java/org/gradle/vcs/internal/DefaultVersionControlRepository.java`
- `platforms/software/version-control/src/main/java/org/gradle/vcs/internal/resolver/DefaultVcsVersionWorkingDirResolver.java`
- `platforms/software/version-control/src/main/java/org/gradle/vcs/internal/resolver/OfflineVcsVersionWorkingDirResolver.java`
- `platforms/software/version-control/src/main/java/org/gradle/vcs/internal/resolver/OncePerBuildInvocationVcsVersionWorkingDirResolver.java`
- `platforms/software/version-control/src/main/java/org/gradle/vcs/internal/resolver/PersistentVcsMetadataCache.java`
- `platforms/software/version-control/src/main/java/org/gradle/vcs/internal/resolver/VcsDependencyResolver.java`
- `platforms/software/version-control/src/main/java/org/gradle/vcs/internal/resolver/VcsVersionSelectionCache.java`
- `platforms/software/version-control/src/main/java/org/gradle/vcs/internal/services/DefaultVersionControlRepositoryFactory.java`
- `platforms/software/version-control/src/main/java/org/gradle/vcs/internal/services/VersionControlRepositoryCacheFactory.java`
- `platforms/software/version-control/src/test/groovy/org/gradle/vcs/fixtures/GitFileRepositoryTest.groovy`
- `platforms/software/version-control/src/test/groovy/org/gradle/vcs/git/internal/GitVersionControlSystemSpec.groovy`
- `platforms/software/version-control/src/testFixtures/java/org/gradle/vcs/fixtures/GitFileRepository.java`
- `subprojects/composite-builds/src/main/java/org/gradle/composite/internal/DefaultIncludedBuildRegistry.java`
- `subprojects/core-api/src/main/java/org/gradle/vcs/SourceControl.java`
- `subprojects/core-api/src/main/java/org/gradle/vcs/VcsMappings.java`
- `subprojects/core-api/src/main/java/org/gradle/vcs/VersionControlRepository.java`
- `subprojects/core-api/src/main/java/org/gradle/vcs/VersionControlSpec.java`
- `subprojects/core/src/main/java/org/gradle/cache/internal/BuildScopeCacheDir.java`
