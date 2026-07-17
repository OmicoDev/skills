# Gradle Scripts And Conventions

## Documentation

- [A Groovy Build Script Primer](https://docs.gradle.org/current/userguide/groovy_build_script_primer.html)
- [ADR-0010 - Gradle properties naming](https://github.com/gradle/gradle/blob/master/architecture/standards/0010-gradle-properties-naming.md)
- [Best Practices for Structuring Builds](https://docs.gradle.org/current/userguide/best_practices_structuring_builds.html)
- [Creating and Registering Tasks](https://docs.gradle.org/current/userguide/writing_tasks_intermediate.html)
- [General Gradle Best Practices](https://docs.gradle.org/current/userguide/best_practices_general.html)
- [Gradle Kotlin DSL Primer](https://docs.gradle.org/current/userguide/kotlin_dsl.html)
- [Gradle Managed Types](https://docs.gradle.org/current/userguide/gradle_managed_types_intermediate.html)
- [Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html)
- [Pre-compiled Script Plugins](https://docs.gradle.org/current/userguide/implementing_gradle_plugins_precompiled.html)
- [Properties and Providers](https://docs.gradle.org/current/userguide/properties_providers.html)
- [Public Gradle APIs](https://docs.gradle.org/current/userguide/public_apis.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)
- [Version Catalogs](https://docs.gradle.org/current/userguide/version_catalogs.html)
- [Working with Plugins](https://docs.gradle.org/current/userguide/plugins_intermediate.html)
- [Writing Build Scripts](https://docs.gradle.org/current/userguide/writing_build_scripts_intermediate.html)

## Source Code

- `platforms/core-configuration/domain-object-collections/src/main/java/org/gradle/api/internal/DefaultDomainObjectCollection.java`
- `platforms/core-configuration/domain-object-collections/src/test/groovy/org/gradle/api/internal/DefaultDomainObjectCollectionTest.groovy`
- `platforms/core-configuration/kotlin-dsl-integ-tests/src/integTest/kotlin/org/gradle/kotlin/dsl/plugins/precompiled/PrecompiledScriptPluginAccessorsTest.kt`
- `platforms/core-configuration/kotlin-dsl-provider-plugins/src/main/kotlin/org/gradle/kotlin/dsl/provider/plugins/precompiled/tasks/GeneratePrecompiledScriptPluginAccessors.kt`
- `platforms/core-configuration/kotlin-dsl/src/integTest/kotlin/org/gradle/kotlin/dsl/integration/KotlinDslDelegatedPropertiesDeprecationIntegrationTest.kt`
- `platforms/core-configuration/kotlin-dsl/src/main/kotlin/org/gradle/kotlin/dsl/ProjectExtensions.kt`
- `platforms/core-configuration/kotlin-dsl/src/main/kotlin/org/gradle/kotlin/dsl/precompile/v1/PrecompiledScriptTemplates.kt`
- `platforms/documentation/docs/src/snippets/best-practices/avoidInternal-avoid/kotlin/build.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/avoidInternal-do/kotlin/build.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/useConventionPlugins-avoid/kotlin/project-a/build.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/useConventionPlugins-do/kotlin/build-logic/src/main/kotlin/my.java-library.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/usePluginsBlock-avoid/kotlin/build.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/usePluginsBlock-do/kotlin/build.gradle.kts`
- `platforms/extensibility/plugin-development/src/integTest/groovy/org/gradle/plugin/devel/plugins/PrecompiledGroovyPluginsIntegrationTest.groovy`
- `platforms/extensibility/plugin-development/src/main/java/org/gradle/plugin/devel/internal/precompiled/GeneratePluginAdaptersTask.java`
- `platforms/extensibility/plugin-development/src/main/java/org/gradle/plugin/devel/internal/precompiled/PrecompiledGroovyScript.java`
- `platforms/extensibility/plugin-development/src/main/java/org/gradle/plugin/devel/internal/precompiled/PrecompiledScriptTarget.java`
- `platforms/extensibility/plugin-development/src/test/groovy/org/gradle/plugin/devel/internal/precompiled/PrecompiledGroovyScriptTest.groovy`
- `subprojects/core-api/src/main/java/org/gradle/api/DomainObjectCollection.java`
- `subprojects/core-api/src/main/java/org/gradle/api/Project.java`
- `subprojects/core-api/src/main/java/org/gradle/api/provider/ProviderFactory.java`
- `subprojects/core/src/integTest/groovy/org/gradle/api/internal/project/GetPropertiesDeprecationIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/internal/project/ParentProjectPropertyLookupIntegrationTest.groovy`
- `subprojects/core/src/main/java/org/gradle/api/internal/FeaturePreviews.java`
- `subprojects/core/src/main/java/org/gradle/api/internal/project/DefaultProject.java`
- `subprojects/core/src/main/java/org/gradle/groovy/scripts/BasicScript.java`
