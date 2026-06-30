# Gradle Dependency Metadata Rules

## Documentation

- [Capabilities](https://docs.gradle.org/current/userguide/component_capabilities.html)
- [Modifying Dependency Metadata](https://docs.gradle.org/current/userguide/component_metadata_rules.html)
- [Resolving Specific Artifacts](https://docs.gradle.org/current/userguide/resolving_specific_artifacts.html)
- [Variants and Attributes](https://docs.gradle.org/current/userguide/variant_attributes.html)

## Source Code

- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/rules/AdditionalVariantsMetadataRulesIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/rules/ComponentMetadataRulesCachingIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/rules/ComponentMetadataRulesErrorHandlingIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/rules/ComponentMetadataRulesInSettingsIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/rules/ComponentMetadataRulesInjectionIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/rules/ComponentMetadataRulesMissingMetadataIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/rules/VariantFilesMetadataRulesIntegrationTest.groovy`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/repositories/AbstractArtifactRepository.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/repositories/DefaultFlatDirArtifactRepository.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ComponentMetadataDetails.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ComponentMetadataRule.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ComponentMetadataSupplier.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/MutableVariantFilesMetadata.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/VariantMetadata.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/dsl/ComponentMetadataHandler.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/repositories/RepositoryResourceAccessor.java`
- `subprojects/core-api/src/main/java/org/gradle/api/initialization/resolve/RulesMode.java`
