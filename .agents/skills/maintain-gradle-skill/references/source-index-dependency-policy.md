# Gradle Dependency Policy

## Documentation

- [Best Practices for Dependencies](https://docs.gradle.org/current/userguide/best_practices_dependencies.html)
- [Declaring dependencies](https://docs.gradle.org/current/userguide/declaring_dependencies.html)
- [Declaring Versions and Ranges](https://docs.gradle.org/current/userguide/dependency_versions.html)
- [Dependency Configurations](https://docs.gradle.org/current/userguide/dependency_configurations.html)
- [Dependency Resolution Consistency](https://docs.gradle.org/current/userguide/dependency_resolution_consistency.html)
- [JVM Test Suite Plugin](https://docs.gradle.org/current/userguide/jvm_test_suite_plugin.html)
- [Platforms](https://docs.gradle.org/current/userguide/platforms.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)
- [Using Resolution Rules](https://docs.gradle.org/current/userguide/resolution_rules.html)
- [Version Catalogs](https://docs.gradle.org/current/userguide/version_catalogs.html)
- [Viewing and Debugging Dependencies](https://docs.gradle.org/current/userguide/viewing_debugging_dependencies.html)

## Source Code

- `platforms/jvm/java-platform/src/main/java/org/gradle/api/plugins/JavaPlatformPlugin.java`
- `platforms/jvm/plugins-java-base/src/main/java/org/gradle/api/plugins/jvm/internal/DefaultJvmFeature.java`
- `platforms/jvm/plugins-java/src/integTest/groovy/org/gradle/api/plugins/JavaPluginIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/ProjectDependencyNotationDeprecationIntegrationTest.groovy`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/DefaultDependencyFactory.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/DefaultProjectDependencyFactory.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/notations/DependencyConstraintProjectNotationConverter.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/notations/DependencyProjectNotationConverter.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/dsl/Dependencies.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/dsl/DependencyFactory.java`
- `subprojects/core/src/integTest/groovy/org/gradle/NameValidationIntegrationTest.groovy`
