# Gradle Dependency Version Governance

## Documentation

- [Best Practices for Dependencies](https://docs.gradle.org/current/userguide/best_practices_dependencies.html)
- [Declaring Dependency Constraints](https://docs.gradle.org/current/userguide/dependency_constraints.html)
- [Declaring Versions and Ranges](https://docs.gradle.org/current/userguide/dependency_versions.html)
- [Dependency Resolution Consistency](https://docs.gradle.org/current/userguide/dependency_resolution_consistency.html)
- [How to Align Dependency Versions in Gradle](https://docs.gradle.org/current/userguide/how_to_align_dependency_versions.html)
- [How to Downgrade Transitive Dependencies in Gradle](https://docs.gradle.org/current/userguide/how_to_downgrade_transitive_dependencies.html)
- [How to Prevent Accidental or Eager Dependency Upgrades in Gradle](https://docs.gradle.org/current/userguide/how_to_prevent_accidental_dependency_upgrades.html)
- [How to Troubleshoot Version Catalog Problems in Gradle](https://docs.gradle.org/current/userguide/how_to_fix_version_catalog_problems.html)
- [How to Upgrade Transitive Dependencies in Gradle](https://docs.gradle.org/current/userguide/how_to_upgrade_transitive_dependencies.html)
- [Platforms](https://docs.gradle.org/current/userguide/platforms.html)
- [Upgrading within Gradle 8.x](https://docs.gradle.org/current/userguide/upgrading_version_8.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)
- [Using Catalogs with Platforms](https://docs.gradle.org/current/userguide/centralizing_catalog_platform.html)
- [Version Catalogs](https://docs.gradle.org/current/userguide/version_catalogs.html)

## Source Code

- `platforms/documentation/docs/src/snippets/best-practices/useVersionCatalogs-avoid/kotlin/build.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/useVersionCatalogs-do/kotlin/build.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/versionCatalogNaming-do/common/gradle/libs.versions.toml`
- `platforms/jvm/language-jvm/src/integTest/groovy/org/gradle/integtests/resolve/consistency/JavaProjectResolutionConsistencyIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/catalog/KotlinDslVersionCatalogExtensionIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/catalog/VersionCatalogExtensionIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/strict/StrictVersionConstraintsFeatureInteractionIntegrationTest.groovy`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/configurations/DefaultConfiguration.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/dsl/dependencies/DefaultDependencyHandler.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/catalog/AbstractExternalDependencyFactory.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/catalog/AliasNormalizer.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/catalog/DefaultVersionCatalog.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/catalog/DefaultVersionCatalogBuilder.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/catalog/LibrariesSourceGenerator.java`
- `platforms/software/dependency-management/src/test/groovy/org/gradle/api/internal/catalog/DefaultVersionCatalogBuilderTest.groovy`
- `platforms/software/dependency-management/src/test/groovy/org/gradle/api/internal/catalog/LibrariesSourceGeneratorTest.groovy`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/VersionCatalog.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/VersionCatalogsExtension.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/dsl/DependencyHandler.java`
- `subprojects/core-api/src/main/java/org/gradle/api/initialization/dsl/VersionCatalogBuilder.java`
- `subprojects/core/src/main/java/org/gradle/api/internal/catalog/parser/StrictVersionParser.java`
- `subprojects/core/src/main/java/org/gradle/api/internal/catalog/parser/TomlCatalogFileParser.java`
- `subprojects/core/src/test/groovy/org/gradle/api/internal/catalog/parser/TomlCatalogFileParserTest.groovy`
