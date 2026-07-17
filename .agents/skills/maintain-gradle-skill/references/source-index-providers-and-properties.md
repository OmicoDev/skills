# Gradle Providers And Properties

## Documentation

- [ADR-0006 - Use of Provider APIs in Gradle](https://github.com/gradle/gradle/blob/master/architecture/standards/0006-use-of-provider-apis-in-gradle.md)
- [Binary Plugins](https://docs.gradle.org/current/userguide/implementing_gradle_plugins_binary.html)
- [Build Environment](https://docs.gradle.org/current/userguide/build_environment.html)
- [Collections](https://docs.gradle.org/current/userguide/collections.html)
- [Configuration Cache Requirements for your Build Logic](https://docs.gradle.org/current/userguide/configuration_cache_requirements.html)
- [Configuring Tasks Lazily](https://docs.gradle.org/current/userguide/lazy_configuration.html)
- [General Gradle Best Practices](https://docs.gradle.org/current/userguide/best_practices_general.html)
- [Gradle Managed Types](https://docs.gradle.org/current/userguide/gradle_managed_types_intermediate.html)
- [Properties and Providers](https://docs.gradle.org/current/userguide/properties_providers.html)
- [Services and Service Injection](https://docs.gradle.org/current/userguide/service_injection.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)

## Source Code

- `platforms/core-configuration/kotlin-dsl/src/main/kotlin/org/gradle/kotlin/dsl/ExtraPropertiesExtensions.kt`
- `platforms/core-configuration/model-core/src/main/java/org/gradle/api/internal/provider/DefaultProviderFactory.java`
- `platforms/core-configuration/model-core/src/main/java/org/gradle/internal/extensibility/DefaultExtraPropertiesExtension.java`
- `platforms/core-configuration/model-core/src/main/java/org/gradle/internal/extensibility/ExtensibleDynamicObject.java`
- `platforms/core-configuration/model-core/src/test/groovy/org/gradle/internal/extensibility/ExtensibleDynamicObjectTest.java`
- `platforms/core-configuration/model-core/src/testFixtures/groovy/org/gradle/api/internal/provider/PropertySpec.groovy`
- `platforms/documentation/docs/src/docs/userguide/reference/runtime-configuration/build_environment.adoc`
- `subprojects/core-api/src/main/java/org/gradle/api/Project.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/dsl/DependencyFactory.java`
- `subprojects/core-api/src/main/java/org/gradle/api/file/BuildLayout.java`
- `subprojects/core-api/src/main/java/org/gradle/api/file/FileSystemLocationProperty.java`
- `subprojects/core-api/src/main/java/org/gradle/api/file/ProjectLayout.java`
- `subprojects/core-api/src/main/java/org/gradle/api/plugins/ExtensionContainer.java`
- `subprojects/core-api/src/main/java/org/gradle/api/plugins/ExtraPropertiesExtension.java`
- `subprojects/core-api/src/main/java/org/gradle/api/provider/HasConfigurableValue.java`
- `subprojects/core-api/src/main/java/org/gradle/api/provider/Property.java`
- `subprojects/core-api/src/main/java/org/gradle/api/provider/Provider.java`
- `subprojects/core-api/src/main/java/org/gradle/api/provider/ProviderFactory.java`
- `subprojects/core-api/src/main/java/org/gradle/api/provider/ValueSource.java`
- `subprojects/core-api/src/main/java/org/gradle/api/provider/ValueSourceParameters.java`
- `subprojects/core-api/src/main/java/org/gradle/api/provider/ValueSourceSpec.java`
- `subprojects/core/src/integTest/groovy/org/gradle/api/ContainerElementServiceInjectionIntegrationTest.groovy`
- `subprojects/core/src/main/java/org/gradle/api/internal/model/DefaultObjectFactory.java`
- `subprojects/core/src/main/java/org/gradle/api/internal/project/DefaultProject.java`
- `subprojects/core/src/main/java/org/gradle/api/internal/properties/DefaultGradlePropertiesController.java`
- `subprojects/core/src/main/java/org/gradle/initialization/ProjectPropertySettingBuildLoader.java`
- `subprojects/core/src/main/java/org/gradle/internal/service/scopes/BuildScopeServices.java`
- `subprojects/core/src/test/groovy/org/gradle/api/internal/properties/DefaultGradlePropertiesControllerTest.groovy`
- `subprojects/core/src/test/groovy/org/gradle/initialization/ProjectPropertySettingBuildLoaderTest.groovy`
