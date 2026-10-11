# Gradle Dependency Repositories

## Documentation

- [3. Declaring repositories](https://docs.gradle.org/current/userguide/declaring_repositories.html)
- [Best Practices for Dependencies](https://docs.gradle.org/current/userguide/best_practices_dependencies.html)
- [Centralizing Repository Declarations](https://docs.gradle.org/current/userguide/centralizing_repositories.html)
- [Dependency Caching](https://docs.gradle.org/current/userguide/dependency_caching.html)
- [ExclusiveContentRepository](https://docs.gradle.org/current/javadoc/org/gradle/api/artifacts/repositories/ExclusiveContentRepository.html)
- [Filtering Repository Content](https://docs.gradle.org/current/userguide/filtering_repository_content.html)
- [Metadata Formats](https://docs.gradle.org/current/userguide/supported_metadata_formats.html)
- [Repository Types](https://docs.gradle.org/current/userguide/supported_repository_types.html)
- [Supported Protocols](https://docs.gradle.org/current/userguide/supported_repository_protocols.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)

## Source Code

- `platforms/documentation/docs/src/snippets/best-practices/contentFiltering-avoid/kotlin/settings.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/contentFiltering-do/kotlin/settings.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/contentFilteringExclusive-do/kotlin/settings.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/settingsRepositories-avoid/kotlin/build.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/settingsRepositories-do/kotlin/settings.gradle.kts`
- `platforms/software/dependency-management/README.md`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/ExclusiveRepositoryContentFilteringIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/RepositoriesDeclaredInSettingsIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/RepositoryContentFilteringIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/RepositoryHandlerMapOverloadsDeprecationIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/http/HttpAuthenticationDependencyResolutionIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/maven/MavenBrokenRemoteResolveIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/maven/MavenDynamicResolveIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/maven/MavenGradleMetadataRedirectionIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/rocache/ReadOnlyCacheValidationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/suppliers/CustomVersionListerIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/suppliers/CustomVersionListerWithSupplierIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/suppliers/DynamicRevisionRemoteResolveWithMetadataSupplierIntegrationTest.groovy`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/dsl/DefaultRepositoryHandler.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/ivyservice/DefaultArtifactCaches.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/ivyservice/ivyresolve/ConnectionFailureRepositoryDisabler.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/ivyservice/ivyresolve/DefaultMetadataProvider.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/ivyservice/ivyresolve/DynamicVersionResolver.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/ivyservice/ivyresolve/ErrorHandlingModuleComponentRepository.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/mvnsettings/DefaultLocalMavenRepositoryLocator.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/mvnsettings/DefaultMavenFileLocations.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/mvnsettings/DefaultMavenSettingsProvider.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/repositories/DefaultMavenArtifactRepository.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/repositories/transport/NetworkingIssueVerifier.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/internal/management/DefaultDependencyResolutionManagement.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/internal/resolve/ResolveExceptionAnalyzer.java`
- `platforms/software/dependency-management/src/test/groovy/org/gradle/api/internal/artifacts/ivyservice/ivyresolve/ConnectionFailureRepositoryDisablerTest.groovy`
- `platforms/software/dependency-management/src/test/groovy/org/gradle/api/internal/artifacts/ivyservice/ivyresolve/DefaultMetadataProviderTest.groovy`
- `platforms/software/dependency-management/src/test/groovy/org/gradle/api/internal/artifacts/ivyservice/ivyresolve/ErrorHandlingModuleComponentRepositoryTest.groovy`
- `platforms/software/dependency-management/src/test/groovy/org/gradle/api/internal/artifacts/mvnsettings/DefaultLocalMavenRepositoryLocatorTest.groovy`
- `platforms/software/dependency-management/src/test/groovy/org/gradle/api/internal/artifacts/repositories/DefaultMavenArtifactRepositoryTest.groovy`
- `platforms/software/dependency-management/src/test/groovy/org/gradle/api/internal/artifacts/repositories/DefaultRepositoryContentDescriptorTest.groovy`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ComponentMetadataBuilder.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ComponentMetadataListerDetails.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ComponentMetadataSupplier.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ComponentMetadataSupplierDetails.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ComponentMetadataVersionLister.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/dsl/RepositoryHandler.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/repositories/ExclusiveContentRepository.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/repositories/MavenArtifactRepository.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/repositories/MetadataSupplierAware.java`
- `subprojects/core-api/src/main/java/org/gradle/api/initialization/Settings.java`
- `subprojects/core-api/src/main/java/org/gradle/api/initialization/resolve/RepositoriesMode.java`
- `subprojects/core-api/src/main/java/org/gradle/util/internal/MavenUtil.java`
