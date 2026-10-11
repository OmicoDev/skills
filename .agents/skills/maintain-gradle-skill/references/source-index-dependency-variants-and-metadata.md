# Gradle Dependency Variants And Metadata

## Documentation

- [Capabilities](https://docs.gradle.org/current/userguide/component_capabilities.html)
- [FeatureSpec](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/FeatureSpec.html)
- [Gradle Module Metadata](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html)
- [How to Create Feature Variants for a Library in Gradle](https://docs.gradle.org/current/userguide/how_to_create_feature_variants_of_a_library.html)
- [JavaPluginExtension](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaPluginExtension.html)
- [ResolvableConfigurationsReportTask](https://docs.gradle.org/current/dsl/org.gradle.api.tasks.diagnostics.ResolvableConfigurationsReportTask.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)
- [Variant Selection and Attribute Matching](https://docs.gradle.org/current/userguide/variant_aware_resolution.html)
- [Variants and Attributes](https://docs.gradle.org/current/userguide/variant_attributes.html)

## Source Code

- `platforms/jvm/language-jvm/src/main/java/org/gradle/api/plugins/FeatureSpec.java`
- `platforms/jvm/plugins-java-base/src/integTest/groovy/org/gradle/api/plugins/JavaBasePluginIntegrationTest.groovy`
- `platforms/jvm/plugins-java-base/src/main/java/org/gradle/api/plugins/JavaPluginExtension.java`
- `platforms/jvm/plugins-java-base/src/main/java/org/gradle/api/plugins/internal/DefaultJavaFeatureSpec.java`
- `platforms/jvm/plugins-java-base/src/main/java/org/gradle/api/plugins/internal/DefaultJavaPluginExtension.java`
- `platforms/jvm/plugins-java-base/src/main/java/org/gradle/api/plugins/jvm/internal/DefaultJvmLanguageUtilities.java`
- `platforms/jvm/plugins-java-library/src/integTest/groovy/org/gradle/java/JavaLibraryCrossProjectTargetJvmVersionIntegrationTest.groovy`
- `platforms/jvm/plugins-java-library/src/integTest/groovy/org/gradle/java/JavaLibraryFeaturePublishingIntegrationTest.groovy`
- `platforms/jvm/plugins-java-library/src/integTest/groovy/org/gradle/java/JavaLibraryPublishedTargetJvmVersionIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/attributes/AbstractConfigurationAttributesResolveIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/attributes/AttributeContainerIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/attributes/DependenciesAttributesIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/attributes/ExclusiveVariantsIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/attributes/MultipleVariantSelectionIntegrationTest.groovy`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/configurations/DefaultConfiguration.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/configurations/VariantIdentityUniquenessVerifier.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/attributes/matching/MultipleCandidateMatcher.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/internal/component/local/model/DefaultLocalComponentGraphResolveState.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/internal/component/model/GraphVariantSelector.java`
- `platforms/software/dependency-management/src/test/groovy/org/gradle/api/internal/attributes/matching/DefaultAttributeMatcherTest.groovy`
- `platforms/software/ivy/src/integTest/groovy/org/gradle/api/publish/ivy/IvyPublishFeaturesJavaIntegTest.groovy`
- `platforms/software/software-diagnostics/src/integTest/groovy/org/gradle/api/tasks/diagnostics/OutgoingVariantsReportTaskIntegrationTest.groovy`
- `platforms/software/software-diagnostics/src/integTest/groovy/org/gradle/api/tasks/diagnostics/ResolvableConfigurationsReportTaskIntegrationTest.groovy`
- `platforms/software/software-diagnostics/src/main/java/org/gradle/api/tasks/diagnostics/OutgoingVariantsReportTask.java`
- `platforms/software/software-diagnostics/src/main/java/org/gradle/api/tasks/diagnostics/ResolvableConfigurationsReportTask.java`
- `platforms/software/software-diagnostics/src/main/java/org/gradle/api/tasks/diagnostics/internal/configurations/model/ConfigurationReportModelFactory.java`
- `platforms/software/software-diagnostics/src/main/java/org/gradle/api/tasks/diagnostics/internal/configurations/renderer/ConsoleConfigurationReportRenderer.java`
- `platforms/software/software-diagnostics/src/main/java/org/gradle/api/tasks/diagnostics/internal/configurations/spec/AbstractConfigurationReportSpec.java`
- `platforms/software/software-diagnostics/src/main/java/org/gradle/api/tasks/diagnostics/internal/configurations/spec/ResolvableConfigurationsSpec.java`
- `subprojects/core-api/src/main/java/org/gradle/api/attributes/java/TargetJvmVersion.java`
- `subprojects/core/src/main/java/org/gradle/api/internal/attributes/DefaultMutableAttributeContainer.java`
- `subprojects/core/src/main/java/org/gradle/api/internal/attributes/UsageCompatibilityHandler.java`
