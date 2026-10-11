# Gradle Plugins, Services, And Diagnostics

## Documentation

- [Avoiding Unnecessary Task Configuration](https://docs.gradle.org/current/userguide/task_configuration_avoidance.html)
- [Best Practices for Structuring Builds](https://docs.gradle.org/current/userguide/best_practices_structuring_builds.html)
- [Binary Plugin Development](https://docs.gradle.org/current/userguide/developing_binary_plugin_advanced.html)
- [Binary Plugins](https://docs.gradle.org/current/userguide/implementing_gradle_plugins_binary.html)
- [BuildFeature API](https://docs.gradle.org/current/javadoc/org/gradle/api/configuration/BuildFeature.html)
- [BuildFeatures API](https://docs.gradle.org/current/javadoc/org/gradle/api/configuration/BuildFeatures.html)
- [Convention Plugins](https://docs.gradle.org/current/userguide/implementing_gradle_plugins_convention.html)
- [Customizing publishing](https://docs.gradle.org/current/userguide/publishing_customization.html)
- [General Gradle Best Practices](https://docs.gradle.org/current/userguide/best_practices_general.html)
- [Gradle Plugin Development Plugin](https://docs.gradle.org/current/userguide/java_gradle_plugin.html)
- [Introduction to Plugins](https://docs.gradle.org/current/userguide/plugins.html)
- [Pre-compiled Script Plugins](https://docs.gradle.org/current/userguide/implementing_gradle_plugins_precompiled.html)
- [Public Gradle APIs](https://docs.gradle.org/current/userguide/public_apis.html)
- [Services and Service Injection](https://docs.gradle.org/current/userguide/service_injection.html)
- [The Feature Lifecycle](https://docs.gradle.org/current/userguide/feature_lifecycle.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)
- [ValidatePlugins API](https://docs.gradle.org/current/javadoc/org/gradle/plugin/devel/tasks/ValidatePlugins.html)

## Source Code

- `platforms/core-configuration/model-core/src/main/java/org/gradle/internal/isolated/IsolationScheme.java`
- `platforms/core-configuration/model-core/src/test/groovy/org/gradle/internal/isolated/IsolationSchemeTest.groovy`
- `platforms/documentation/docs/src/snippets/best-practices/dontAssumePluginOrder-avoid/kotlin/buildSrc/src/main/kotlin/MyPlugin.kt`
- `platforms/documentation/docs/src/snippets/best-practices/dontAssumePluginOrder-do/kotlin/buildSrc/src/main/kotlin/MyPlugin.kt`
- `platforms/extensibility/plugin-development/src/integTest/groovy/org/gradle/plugin/devel/plugins/JavaGradlePluginPluginIntegrationTest.groovy`
- `platforms/extensibility/plugin-development/src/integTest/groovy/org/gradle/plugin/devel/tasks/PublishedPluginsStricterValidationIntegrationSpec.groovy`
- `platforms/extensibility/plugin-development/src/integTest/groovy/org/gradle/plugin/devel/tasks/ValidatePluginsPart1IntegrationTest.groovy`
- `platforms/extensibility/plugin-development/src/integTest/groovy/org/gradle/plugin/devel/variants/GradlePluginWithVariantsPublicationIntegrationTest.groovy`
- `platforms/extensibility/plugin-development/src/main/java/org/gradle/initialization/buildsrc/GradlePluginApiVersionAttributeConfigurationAction.java`
- `platforms/extensibility/plugin-development/src/main/java/org/gradle/plugin/devel/plugins/JavaGradlePluginPlugin.java`
- `platforms/extensibility/plugin-development/src/main/java/org/gradle/plugin/devel/tasks/ValidatePlugins.java`
- `platforms/jvm/plugins-java/src/main/java/org/gradle/api/plugins/JavaPlugin.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/dsl/dependencies/GradlePluginVariantsSupport.java`
- `platforms/software/dependency-management/src/test/groovy/org/gradle/api/internal/artifacts/dsl/dependencies/GradlePluginVariantsSupportTest.groovy`
- `platforms/software/reporting/src/main/java/org/gradle/api/reporting/ReportingExtension.java`
- `subprojects/core-api/src/main/java/org/gradle/api/DomainObjectCollection.java`
- `subprojects/core-api/src/main/java/org/gradle/api/Project.java`
- `subprojects/core-api/src/main/java/org/gradle/api/attributes/plugin/GradlePluginApiVersion.java`
- `subprojects/core-api/src/main/java/org/gradle/api/configuration/BuildFeature.java`
- `subprojects/core-api/src/main/java/org/gradle/api/configuration/BuildFeatures.java`
- `subprojects/core-api/src/main/java/org/gradle/api/internal/parameters/NoneParameters.java`
- `subprojects/core-api/src/main/java/org/gradle/api/plugins/PluginContainer.java`
- `subprojects/core-api/src/main/java/org/gradle/api/plugins/PluginManager.java`
- `subprojects/core/src/integTest/groovy/org/gradle/api/configuration/BuildFeaturesIntegrationTest.groovy`
- `subprojects/core/src/main/java/org/gradle/api/internal/configuration/DefaultBuildFeatures.java`
