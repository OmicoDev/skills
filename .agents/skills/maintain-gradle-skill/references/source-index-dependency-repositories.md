# Gradle Dependency Repositories

## Documentation

- [Best Practices for Dependencies](https://docs.gradle.org/current/userguide/best_practices_dependencies.html)
- [Centralizing Repositories](https://docs.gradle.org/current/userguide/centralizing_repositories.html)
- [Declaring repositories](https://docs.gradle.org/current/userguide/declaring_repositories.html)
- [Dependency Caching](https://docs.gradle.org/current/userguide/dependency_caching.html)
- [Filtering Repository Content](https://docs.gradle.org/current/userguide/filtering_repository_content.html)
- [Supported Metadata Formats](https://docs.gradle.org/current/userguide/supported_metadata_formats.html)
- [Supported Repository Types](https://docs.gradle.org/current/userguide/supported_repository_types.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)

## Source Code

- `platforms/documentation/docs/src/snippets/best-practices/contentFiltering-avoid/kotlin/settings.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/contentFiltering-do/kotlin/settings.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/contentFilteringExclusive-do/kotlin/settings.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/settingsRepositories-avoid/kotlin/build.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/settingsRepositories-do/kotlin/settings.gradle.kts`
- `platforms/software/dependency-management/README.md`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/RepositoryContentFilteringIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/RepositoryHandlerMapOverloadsDeprecationIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/maven/MavenDynamicResolveIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/maven/MavenGradleMetadataRedirectionIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/suppliers/CustomVersionListerIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/suppliers/CustomVersionListerWithSupplierIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/suppliers/DynamicRevisionRemoteResolveWithMetadataSupplierIntegrationTest.groovy`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/dsl/DefaultRepositoryHandler.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/repositories/DefaultMavenArtifactRepository.java`
- `platforms/software/dependency-management/src/test/groovy/org/gradle/api/internal/artifacts/ivyservice/ivyresolve/DefaultMetadataProviderTest.groovy`
- `platforms/software/dependency-management/src/test/groovy/org/gradle/api/internal/artifacts/repositories/DefaultMavenArtifactRepositoryTest.groovy`
- `platforms/software/dependency-management/src/test/groovy/org/gradle/api/internal/artifacts/repositories/DefaultRepositoryContentDescriptorTest.groovy`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ComponentMetadataBuilder.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ComponentMetadataListerDetails.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ComponentMetadataSupplier.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ComponentMetadataSupplierDetails.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ComponentMetadataVersionLister.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/dsl/RepositoryHandler.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/repositories/MavenArtifactRepository.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/repositories/MetadataSupplierAware.java`
- `subprojects/core-api/src/main/java/org/gradle/api/initialization/resolve/RepositoriesMode.java`
