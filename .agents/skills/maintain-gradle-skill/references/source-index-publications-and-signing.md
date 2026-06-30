# Gradle Publications And Signing

## Documentation

- [Customizing publishing](https://docs.gradle.org/current/userguide/publishing_customization.html)
- [Gradle Module Metadata](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html)
- [Preparing to Publish Plugins](https://docs.gradle.org/current/userguide/preparing_to_publish.html)
- [Publishing Plugins to the Gradle Plugin Portal](https://docs.gradle.org/current/userguide/publishing_gradle_plugins.html)
- [The Ivy Publish Plugin](https://docs.gradle.org/current/userguide/publishing_ivy.html)
- [The Maven Publish Plugin](https://docs.gradle.org/current/userguide/publishing_maven.html)
- [The Signing Plugin](https://docs.gradle.org/current/userguide/signing_plugin.html)

## Source Code

- `platforms/software/ivy/src/integTest/groovy/org/gradle/api/publish/ivy/IvyPublishJavaIntegTest.groovy`
- `platforms/software/maven/src/integTest/groovy/org/gradle/api/publish/maven/MavenPublishArtifactCustomizationIntegTest.groovy`
- `platforms/software/maven/src/integTest/groovy/org/gradle/api/publish/maven/MavenPublishJavaIntegTest.groovy`
- `platforms/software/maven/src/main/java/org/gradle/api/publish/maven/internal/validation/MavenPublicationErrorChecker.java`
- `platforms/software/publish/src/main/java/org/gradle/api/publish/internal/metadata/ModuleMetadataSpecBuilder.java`
- `platforms/software/publish/src/main/java/org/gradle/api/publish/internal/validation/PublicationErrorChecker.java`
- `platforms/software/publish/src/main/java/org/gradle/api/publish/tasks/GenerateModuleMetadata.java`
