# Gradle Migration Execution

## Documentation

- [Avoiding Unnecessary Task Configuration](https://docs.gradle.org/current/userguide/task_configuration_avoidance.html)
- [Migrating build logic from Groovy to Kotlin](https://docs.gradle.org/current/userguide/migrating_from_groovy_to_kotlin_dsl.html)
- [Migrating Builds From Apache Ant](https://docs.gradle.org/current/userguide/migrating_from_ant.html)
- [Migrating Builds From Apache Maven](https://docs.gradle.org/current/userguide/migrating_from_maven.html)
- [The Build Init Plugin](https://docs.gradle.org/current/userguide/build_init_plugin.html)
- [The Feature Lifecycle](https://docs.gradle.org/current/userguide/feature_lifecycle.html)
- [Upgrading from Gradle 4.x to 5.0](https://docs.gradle.org/current/userguide/upgrading_version_4.html)
- [Upgrading from Gradle 5.x to 6.0](https://docs.gradle.org/current/userguide/upgrading_version_5.html)
- [Upgrading from Gradle 6.x to 7.0](https://docs.gradle.org/current/userguide/upgrading_version_6.html)
- [Upgrading from Gradle 7.x to 8.0](https://docs.gradle.org/current/userguide/upgrading_version_7.html)
- [Upgrading to Gradle 9.0.0](https://docs.gradle.org/current/userguide/upgrading_major_version_9.html)
- [Upgrading within Gradle 8.x](https://docs.gradle.org/current/userguide/upgrading_version_8.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)
- [Using Ant from Gradle](https://docs.gradle.org/current/userguide/ant.html)

## Source Code

- `platforms/software/build-init/src/integTest/groovy/org/gradle/buildinit/plugins/MavenConversionDynamicPomIntegrationTest.groovy`
- `platforms/software/build-init/src/integTest/groovy/org/gradle/buildinit/plugins/MavenConversionIntegrationTest.groovy`
- `platforms/software/build-init/src/main/java/org/gradle/buildinit/InsecureProtocolOption.java`
- `platforms/software/build-init/src/main/java/org/gradle/unexported/buildinit/plugins/internal/maven/Dependency.java`
- `platforms/software/build-init/src/main/java/org/gradle/unexported/buildinit/plugins/internal/maven/ExternalDependency.java`
- `platforms/software/build-init/src/main/java/org/gradle/unexported/buildinit/plugins/internal/maven/Maven2Gradle.java`
- `platforms/software/build-init/src/main/java/org/gradle/unexported/buildinit/plugins/internal/maven/Maven2GradleWorkAction.java`
- `platforms/software/build-init/src/main/java/org/gradle/unexported/buildinit/plugins/internal/maven/MavenProjectsCreator.java`
- `platforms/software/build-init/src/main/java/org/gradle/unexported/buildinit/plugins/internal/maven/PomProjectInitDescriptor.java`
- `platforms/software/build-init/src/main/java/org/gradle/unexported/buildinit/plugins/internal/maven/ProjectDependency.java`
- `platforms/software/build-init/src/test/groovy/org/gradle/buildinit/plugins/internal/maven/MavenProjectsCreatorSpec.groovy`
