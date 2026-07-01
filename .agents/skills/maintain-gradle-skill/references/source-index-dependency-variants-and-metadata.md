# Gradle Dependency Variants And Metadata

## Documentation

- [Capabilities](https://docs.gradle.org/current/userguide/component_capabilities.html)
- [Gradle Module Metadata](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html)
- [How to Create Feature Variants for a Library in Gradle](https://docs.gradle.org/current/userguide/how_to_create_feature_variants_of_a_library.html)
- [Variant Selection and Attribute Matching](https://docs.gradle.org/current/userguide/variant_aware_resolution.html)
- [Variants and Attributes](https://docs.gradle.org/current/userguide/variant_attributes.html)

## Source Code

- `platforms/jvm/language-jvm/src/main/java/org/gradle/api/plugins/FeatureSpec.java`
- `platforms/jvm/plugins-java-base/src/main/java/org/gradle/api/plugins/JavaPluginExtension.java`
- `platforms/jvm/plugins-java-base/src/main/java/org/gradle/api/plugins/internal/DefaultJavaFeatureSpec.java`
- `platforms/jvm/plugins-java-base/src/main/java/org/gradle/api/plugins/internal/DefaultJavaPluginExtension.java`
- `platforms/jvm/plugins-java-base/src/main/java/org/gradle/api/plugins/jvm/internal/DefaultJvmLanguageUtilities.java`
- `platforms/jvm/plugins-java-library/src/integTest/groovy/org/gradle/java/JavaLibraryCrossProjectTargetJvmVersionIntegrationTest.groovy`
- `platforms/jvm/plugins-java-library/src/integTest/groovy/org/gradle/java/JavaLibraryPublishedTargetJvmVersionIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/attributes/DependenciesAttributesIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/attributes/MultipleVariantSelectionIntegrationTest.groovy`
- `platforms/software/software-diagnostics/src/main/java/org/gradle/api/tasks/diagnostics/OutgoingVariantsReportTask.java`
- `platforms/software/software-diagnostics/src/main/java/org/gradle/api/tasks/diagnostics/ResolvableConfigurationsReportTask.java`
- `subprojects/core-api/src/main/java/org/gradle/api/attributes/java/TargetJvmVersion.java`
