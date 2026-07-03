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

- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/RepositoryContentFilteringIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/RepositoryHandlerMapOverloadsDeprecationIntegrationTest.groovy`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/dsl/DefaultRepositoryHandler.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/repositories/DefaultMavenArtifactRepository.java`
- `platforms/software/dependency-management/src/test/groovy/org/gradle/api/internal/artifacts/repositories/DefaultMavenArtifactRepositoryTest.groovy`
- `platforms/software/dependency-management/src/test/groovy/org/gradle/api/internal/artifacts/repositories/DefaultRepositoryContentDescriptorTest.groovy`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ComponentMetadataSupplier.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ComponentMetadataVersionLister.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/dsl/RepositoryHandler.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/repositories/MavenArtifactRepository.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/repositories/MetadataSupplierAware.java`
- `subprojects/core-api/src/main/java/org/gradle/api/initialization/resolve/RepositoriesMode.java`
