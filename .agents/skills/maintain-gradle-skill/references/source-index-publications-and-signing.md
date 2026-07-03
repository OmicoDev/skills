# Gradle Publications And Signing

## Documentation

- [Customizing publishing](https://docs.gradle.org/current/userguide/publishing_customization.html)
- [Gradle Module Metadata](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html)
- [Preparing to Publish Plugins](https://docs.gradle.org/current/userguide/preparing_to_publish.html)
- [Publishing Plugins to the Gradle Plugin Portal](https://docs.gradle.org/current/userguide/publishing_gradle_plugins.html)
- [The Ivy Publish Plugin](https://docs.gradle.org/current/userguide/publishing_ivy.html)
- [The Maven Publish Plugin](https://docs.gradle.org/current/userguide/publishing_maven.html)
- [The Signing Plugin](https://docs.gradle.org/current/userguide/signing_plugin.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)

## Source Code

- `platforms/software/ivy/src/integTest/groovy/org/gradle/api/publish/ivy/IvyPublishJavaIntegTest.groovy`
- `platforms/software/maven/src/integTest/groovy/org/gradle/api/publish/maven/AbstractMavenPublishJavaIntegTest.groovy`
- `platforms/software/maven/src/integTest/groovy/org/gradle/api/publish/maven/MavenPublishArtifactCustomizationIntegTest.groovy`
- `platforms/software/maven/src/integTest/groovy/org/gradle/api/publish/maven/MavenPublishJavaIntegTest.groovy`
- `platforms/software/maven/src/main/java/org/gradle/api/publish/maven/internal/publication/DefaultMavenPublication.java`
- `platforms/software/maven/src/main/java/org/gradle/api/publish/maven/internal/validation/MavenPublicationErrorChecker.java`
- `platforms/software/maven/src/main/java/org/gradle/api/publish/maven/plugins/MavenPublishPlugin.java`
- `platforms/software/publish/src/main/java/org/gradle/api/publish/internal/DefaultPublishingExtension.java`
- `platforms/software/publish/src/main/java/org/gradle/api/publish/internal/component/ConfigurationVariantMapping.java`
- `platforms/software/publish/src/main/java/org/gradle/api/publish/internal/component/DefaultAdhocSoftwareComponent.java`
- `platforms/software/publish/src/main/java/org/gradle/api/publish/internal/metadata/ModuleMetadataSpecBuilder.java`
- `platforms/software/publish/src/main/java/org/gradle/api/publish/internal/validation/PublicationErrorChecker.java`
- `platforms/software/publish/src/main/java/org/gradle/api/publish/internal/versionmapping/DefaultVariantVersionMappingStrategy.java`
- `platforms/software/publish/src/main/java/org/gradle/api/publish/internal/versionmapping/DefaultVersionMappingStrategy.java`
- `platforms/software/publish/src/main/java/org/gradle/api/publish/plugins/PublishingPlugin.java`
- `platforms/software/publish/src/main/java/org/gradle/api/publish/tasks/GenerateModuleMetadata.java`
- `platforms/software/signing/src/main/java/org/gradle/plugins/signing/Sign.java`
- `platforms/software/signing/src/main/java/org/gradle/plugins/signing/SigningExtension.java`
- `platforms/software/signing/src/main/java/org/gradle/plugins/signing/SigningPlugin.java`
- `platforms/software/signing/src/main/java/org/gradle/plugins/signing/signatory/internal/pgp/InMemoryPgpSignatoryProvider.java`
- `platforms/software/signing/src/test/groovy/org/gradle/plugins/signing/SignOperationWithV6KeySpec.groovy`
- `platforms/software/signing/src/test/groovy/org/gradle/plugins/signing/SigningPublicationsSpec.groovy`
