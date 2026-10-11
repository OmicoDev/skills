# Gradle Dependency Policy

## Documentation

- [Best Practices for Dependencies](https://docs.gradle.org/current/userguide/best_practices_dependencies.html)
- [Best Practices for Tasks](https://docs.gradle.org/current/userguide/best_practices_tasks.html)
- [Configuration API](https://docs.gradle.org/current/javadoc/org/gradle/api/artifacts/Configuration.html)
- [ConfigurationContainer API](https://docs.gradle.org/current/javadoc/org/gradle/api/artifacts/ConfigurationContainer.html)
- [Creating Dependency Configurations](https://docs.gradle.org/current/userguide/declaring_configurations.html)
- [Declaring dependencies](https://docs.gradle.org/current/userguide/declaring_dependencies.html)
- [Declaring Versions and Ranges](https://docs.gradle.org/current/userguide/dependency_versions.html)
- [Dependency Configurations](https://docs.gradle.org/current/userguide/dependency_configurations.html)
- [Dependency Resolution Consistency](https://docs.gradle.org/current/userguide/dependency_resolution_consistency.html)
- [DependencyFactory API](https://docs.gradle.org/current/javadoc/org/gradle/api/artifacts/dsl/DependencyFactory.html)
- [DependencyHandler API](https://docs.gradle.org/current/javadoc/org/gradle/api/artifacts/dsl/DependencyHandler.html)
- [JVM Test Suite Plugin](https://docs.gradle.org/current/userguide/jvm_test_suite_plugin.html)
- [Platforms](https://docs.gradle.org/current/userguide/platforms.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)
- [Using Resolution Rules](https://docs.gradle.org/current/userguide/resolution_rules.html)
- [Version Catalogs](https://docs.gradle.org/current/userguide/version_catalogs.html)
- [Viewing and Debugging Dependencies](https://docs.gradle.org/current/userguide/viewing_debugging_dependencies.html)

## Source Code

- `platforms/core-runtime/base-services/src/main/java/org/gradle/util/internal/NameValidator.java`
- `platforms/documentation/docs/src/docs/userguide/best-practices/best_practices_dependencies.adoc`
- `platforms/documentation/docs/src/docs/userguide/best-practices/best_practices_tasks.adoc`
- `platforms/documentation/docs/src/docs/userguide/reference/dependency-management/declaring-dependencies/declaring_configurations.adoc`
- `platforms/documentation/docs/src/docs/userguide/releases/upgrading/upgrading_version_9.adoc`
- `platforms/documentation/docs/src/snippets/best-practices/avoidDuplicateDependencies-avoid/kotlin/build.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/avoidDuplicateDependencies-do/kotlin/build.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/avoidResolvingConfigurationsManually-avoid/kotlin/app/build.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/avoidResolvingConfigurationsManually-do/kotlin/app/build.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/kotlinStdLib-avoid/kotlin/build.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/kotlinStdLib-do/kotlin/build.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/useGavString-avoid/kotlin/build.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/useGavString-do/kotlin/build.gradle.kts`
- `platforms/jvm/java-platform/src/main/java/org/gradle/api/plugins/JavaPlatformPlugin.java`
- `platforms/jvm/plugins-java-base/src/integTest/groovy/org/gradle/api/plugins/JavaBasePluginTest.groovy`
- `platforms/jvm/plugins-java-base/src/main/java/org/gradle/api/plugins/JavaBasePlugin.java`
- `platforms/jvm/plugins-java-base/src/main/java/org/gradle/api/plugins/jvm/internal/DefaultJvmFeature.java`
- `platforms/jvm/plugins-java/src/integTest/groovy/org/gradle/api/plugins/JavaPluginIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/ProjectDependencyNotationDeprecationIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/RootComponentResolutionIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/api/ConfigurationRoleUsageIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/api/MultiStringDependencyNotationIntegrationTest.groovy`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/DefaultDependencyFactory.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/DefaultProjectDependencyFactory.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/configurations/DefaultConfiguration.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/configurations/DefaultConfigurationContainer.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/configurations/DefaultConsumableConfiguration.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/configurations/DefaultDependencyScopeConfiguration.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/configurations/DefaultResolvableConfiguration.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/ivyservice/resolveengine/graph/builder/ModuleResolveState.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/notations/DependencyConstraintProjectNotationConverter.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/notations/DependencyMapNotationConverter.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/notations/DependencyProjectNotationConverter.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/Configuration.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ConfigurationContainer.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/dsl/Dependencies.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/dsl/DependencyFactory.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/dsl/DependencyHandler.java`
- `subprojects/core/src/integTest/groovy/org/gradle/NameValidationIntegrationTest.groovy`
- `subprojects/core/src/test/groovy/org/gradle/util/internal/NameValidatorTest.groovy`
