# Gradle Project Topology And Build Logic

## Documentation

- [Best Practices for Structuring Builds](https://docs.gradle.org/current/userguide/best_practices_structuring_builds.html)
- [Composite Builds (Included Builds)](https://docs.gradle.org/current/userguide/composite_builds.html)
- [General Gradle Best Practices](https://docs.gradle.org/current/userguide/best_practices_general.html)
- [How to Convert a Single-Project Build into a Multi-Project Build in Gradle](https://docs.gradle.org/current/userguide/how_to_convert_single_build_to_multi_build.html)
- [How to Use a Local Fork of a Module Dependency with Gradle](https://docs.gradle.org/current/userguide/how_to_use_local_forks.html)
- [Multi-Project Builds](https://docs.gradle.org/current/userguide/multi_project_builds.html)
- [Sharing Build Logic using buildSrc](https://docs.gradle.org/current/userguide/sharing_build_logic_between_subprojects.html)
- [Structuring and Organizing Gradle Projects](https://docs.gradle.org/current/userguide/organizing_gradle_projects.html)
- [The Build Init Plugin](https://docs.gradle.org/current/userguide/build_init_plugin.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)

## Source Code

- `platforms/documentation/docs/src/docs/userguide/best-practices/best_practices_general.adoc`
- `platforms/documentation/docs/src/docs/userguide/best-practices/best_practices_structuring_builds.adoc`
- `platforms/documentation/docs/src/docs/userguide/how-to/dependency-management/how_to_use_local_forks.adoc`
- `platforms/documentation/docs/src/docs/userguide/how-to/structuring-builds/how_to_convert_single_build_to_multi_build.adoc`
- `platforms/documentation/docs/src/docs/userguide/reference/core-plugins/build_init_plugin.adoc`
- `platforms/documentation/docs/src/docs/userguide/releases/upgrading/upgrading_version_9.adoc`
- `platforms/documentation/docs/src/docs/userguide/structuring-builds/composite_builds.adoc`
- `platforms/documentation/docs/src/docs/userguide/structuring-builds/multi_project_builds.adoc`
- `platforms/documentation/docs/src/docs/userguide/structuring-builds/organizing_gradle_projects.adoc`
- `platforms/documentation/docs/src/docs/userguide/structuring-builds/sharing_build_logic_between_subprojects.adoc`
- `platforms/documentation/docs/src/snippets/best-practices/avoidEmptyProjects-avoid/kotlin/settings.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/avoidEmptyProjects-do/kotlin/settings.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/favorCompositeBuilds-avoid/kotlin/buildSrc/build.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/favorCompositeBuilds-do/kotlin/settings.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/modularizeYourBuild-avoid/kotlin/settings.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/modularizeYourBuild-do/kotlin/settings.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/nameYourRootProject-avoid/kotlin/settings.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/nameYourRootProject-do/kotlin/settings.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/noSourceInRoot-avoid/kotlin/build.gradle.kts`
- `platforms/documentation/docs/src/snippets/best-practices/noSourceInRoot-do/kotlin/settings.gradle.kts`
- `subprojects/core-api/src/main/java/org/gradle/api/internal/project/ProjectIdentity.java`
- `subprojects/core/src/integTest/groovy/org/gradle/NameValidationIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/initialization/buildsrc/BuildSrcIncludedBuildIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/initialization/buildsrc/DisallowBuildSrcAsNameIntegTest.groovy`
- `subprojects/core/src/main/java/org/gradle/initialization/buildsrc/BuildSrcDetector.java`
- `subprojects/core/src/test/groovy/org/gradle/api/internal/project/DefaultProjectSpec.groovy`
- `subprojects/core/src/test/groovy/org/gradle/initialization/buildsrc/BuildSrcDetectorTest.groovy`
