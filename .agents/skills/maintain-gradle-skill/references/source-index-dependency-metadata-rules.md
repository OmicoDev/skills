# Gradle Dependency Metadata Rules

## Documentation

- [Capabilities](https://docs.gradle.org/current/userguide/component_capabilities.html)
- [Modifying Dependency Metadata](https://docs.gradle.org/current/userguide/component_metadata_rules.html)
- [Resolving Specific Artifacts](https://docs.gradle.org/current/userguide/resolving_specific_artifacts.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)
- [Variants and Attributes](https://docs.gradle.org/current/userguide/variant_attributes.html)

## Source Code

- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/ParallelDownloadsIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/ivy/ComponentSelectionRulesErrorHandlingIntegTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/ivy/ComponentSelectionRulesProcessingIntegTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/rules/AdditionalVariantsMetadataRulesIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/rules/ComponentMetadataRulesCachingIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/rules/ComponentMetadataRulesErrorHandlingIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/rules/ComponentMetadataRulesInSettingsIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/rules/ComponentMetadataRulesInjectionIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/rules/ComponentMetadataRulesIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/rules/ComponentMetadataRulesMissingMetadataIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/rules/VariantFilesMetadataRulesIntegrationTest.groovy`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/dsl/DefaultComponentMetadataHandler.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/ivyservice/resolutionstrategy/DefaultComponentSelectionRules.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/repositories/AbstractArtifactRepository.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/repositories/DefaultFlatDirArtifactRepository.java`
- `platforms/software/dependency-management/src/test/groovy/org/gradle/api/internal/artifacts/dsl/DefaultComponentMetadataHandlerTest.groovy`
- `platforms/software/dependency-management/src/test/groovy/org/gradle/internal/component/external/model/AbstractDependencyMetadataRulesTest.groovy`
- `platforms/software/dependency-management/src/test/groovy/org/gradle/internal/component/external/model/VariantFilesMetadataRulesTest.groovy`
- `platforms/software/dependency-management/src/test/groovy/org/gradle/internal/resolve/caching/ComponentMetadataRuleExecutorTest.groovy`
- `platforms/software/dependency-management/src/test/groovy/org/gradle/internal/resolve/caching/CrossBuildCachingRuleExecutorTest.groovy`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ComponentMetadataDetails.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ComponentMetadataRule.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ComponentMetadataSupplier.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/MutableVariantFilesMetadata.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/VariantMetadata.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/dsl/ComponentMetadataHandler.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/repositories/RepositoryResourceAccessor.java`
- `subprojects/core-api/src/main/java/org/gradle/api/initialization/resolve/RulesMode.java`
