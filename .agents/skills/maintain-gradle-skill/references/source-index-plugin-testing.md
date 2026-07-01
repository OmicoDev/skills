# Gradle Plugin Testing

## Documentation

- [Best Practices for Testing](https://docs.gradle.org/current/userguide/best_practices_testing.html)
- [Build Cache](https://docs.gradle.org/current/userguide/build_cache.html)
- [Gradle Plugin Development Plugin](https://docs.gradle.org/current/userguide/java_gradle_plugin.html)
- [Initialization Scripts and Init Plugins](https://docs.gradle.org/current/userguide/init_scripts.html)
- [Testing Build Logic with TestKit](https://docs.gradle.org/current/userguide/test_kit.html)
- [Testing Plugins](https://docs.gradle.org/current/userguide/testing_gradle_plugins.html)
- [The JVM Test Suite Plugin](https://docs.gradle.org/current/userguide/jvm_test_suite_plugin.html)
- [Upgrading from Gradle 6.x to 7.0](https://docs.gradle.org/current/userguide/upgrading_version_6.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)

## Source Code

- `platforms/extensibility/plugin-development/src/integTest/groovy/org/gradle/plugin/devel/plugins/JavaGradlePluginPluginTestKitSetupIntegrationTest.groovy`
- `platforms/extensibility/plugin-development/src/integTest/groovy/org/gradle/plugin/devel/tasks/PublishedPluginsStricterValidationIntegrationSpec.groovy`
- `platforms/extensibility/plugin-development/src/integTest/groovy/org/gradle/plugin/devel/tasks/ValidatePluginsPart1IntegrationTest.groovy`
- `platforms/extensibility/plugin-development/src/main/java/org/gradle/plugin/devel/GradlePluginDevelopmentExtension.java`
- `platforms/extensibility/plugin-development/src/main/java/org/gradle/plugin/devel/plugins/JavaGradlePluginPlugin.java`
- `platforms/extensibility/plugin-development/src/main/java/org/gradle/plugin/devel/tasks/PluginUnderTestMetadata.java`
- `platforms/extensibility/plugin-development/src/main/java/org/gradle/plugin/devel/tasks/ValidatePlugins.java`
- `platforms/extensibility/test-kit/src/integTest/groovy/org/gradle/testkit/TestKitDependencyClassVisibilityIntegrationTest.groovy`
- `platforms/extensibility/test-kit/src/integTest/groovy/org/gradle/testkit/runner/GradleRunnerBuildFailureIntegrationTest.groovy`
- `platforms/extensibility/test-kit/src/integTest/groovy/org/gradle/testkit/runner/GradleRunnerCaptureOutputIntegrationTest.groovy`
- `platforms/extensibility/test-kit/src/integTest/groovy/org/gradle/testkit/runner/GradleRunnerConfigurationIntegrationTest.groovy`
- `platforms/extensibility/test-kit/src/integTest/groovy/org/gradle/testkit/runner/GradleRunnerConventionalPluginClasspathInjectionIntegrationTest.groovy`
- `platforms/extensibility/test-kit/src/integTest/groovy/org/gradle/testkit/runner/GradleRunnerEnvironmentVariablesIntegrationTest.groovy`
- `platforms/extensibility/test-kit/src/integTest/groovy/org/gradle/testkit/runner/GradleRunnerManualPluginClasspathInjectionIntegrationTest.groovy`
- `platforms/extensibility/test-kit/src/integTest/groovy/org/gradle/testkit/runner/GradleRunnerMechanicalFailureIntegrationTest.groovy`
- `platforms/extensibility/test-kit/src/integTest/groovy/org/gradle/testkit/runner/GradleRunnerPluginClasspathInjectionIntegrationTest.groovy`
- `platforms/extensibility/test-kit/src/integTest/groovy/org/gradle/testkit/runner/GradleRunnerResultIntegrationTest.groovy`
- `platforms/extensibility/test-kit/src/integTest/groovy/org/gradle/testkit/runner/GradleRunnerUnsupportedFeatureFailureIntegrationTest.groovy`
- `platforms/extensibility/test-kit/src/integTest/groovy/org/gradle/testkit/runner/enduser/GradleRunnerConsoleInputEndUserIntegrationTest.groovy`
- `platforms/extensibility/test-kit/src/integTest/groovy/org/gradle/testkit/runner/enduser/GradleRunnerDefaultTestKitDirIntegrationTest.groovy`
- `platforms/extensibility/test-kit/src/integTest/groovy/org/gradle/testkit/runner/enduser/GradleRunnerPluginClasspathInjectionEndUserIntegrationTest.groovy`
- `platforms/extensibility/test-kit/src/integTest/groovy/org/gradle/testkit/runner/jvm/GradleRunnerCliGradlePropertyFileDaemonJvmIntegrationTest.groovy`
- `platforms/extensibility/test-kit/src/integTest/groovy/org/gradle/testkit/runner/jvm/GradleRunnerExplicitDaemonJvmIntegrationTest.groovy`
- `platforms/extensibility/test-kit/src/integTest/groovy/org/gradle/testkit/runner/jvm/GradleRunnerGradlePropertiesFileDaemonJvmIntegrationTest.groovy`
- `platforms/extensibility/test-kit/src/integTest/groovy/org/gradle/testkit/runner/jvm/GradleRunnerImplicitDaemonJvmIntegrationTest.groovy`
- `platforms/extensibility/test-kit/src/integTest/groovy/org/gradle/testkit/runner/jvm/GradleRunnerToolchainDaemonJvmIntegrationTest.groovy`
- `platforms/extensibility/test-kit/src/main/java/org/gradle/testkit/runner/BuildResult.java`
- `platforms/extensibility/test-kit/src/main/java/org/gradle/testkit/runner/GradleRunner.java`
- `platforms/extensibility/test-kit/src/main/java/org/gradle/testkit/runner/UnexpectedBuildFailure.java`
- `platforms/extensibility/test-kit/src/main/java/org/gradle/testkit/runner/UnexpectedBuildResultException.java`
- `platforms/extensibility/test-kit/src/main/java/org/gradle/testkit/runner/UnexpectedBuildSuccess.java`
- `platforms/extensibility/test-kit/src/main/java/org/gradle/testkit/runner/internal/DefaultBuildResult.java`
- `platforms/extensibility/test-kit/src/main/java/org/gradle/testkit/runner/internal/DefaultGradleRunner.java`
- `platforms/extensibility/test-kit/src/main/java/org/gradle/testkit/runner/internal/FeatureCheckBuildResult.java`
- `platforms/extensibility/test-kit/src/main/java/org/gradle/testkit/runner/internal/PluginUnderTestMetadataReading.java`
- `platforms/extensibility/test-kit/src/main/java/org/gradle/testkit/runner/internal/feature/BuildResultOutputFeatureCheck.java`
- `platforms/extensibility/test-kit/src/main/java/org/gradle/testkit/runner/internal/feature/TestKitFeature.java`
- `platforms/extensibility/test-kit/src/test/groovy/org/gradle/testkit/runner/internal/DefaultBuildResultTest.groovy`
- `platforms/extensibility/test-kit/src/test/groovy/org/gradle/testkit/runner/internal/DefaultGradleRunnerTest.groovy`
- `platforms/extensibility/test-kit/src/test/groovy/org/gradle/testkit/runner/internal/FeatureCheckBuildResultTest.groovy`
- `platforms/extensibility/test-kit/src/test/groovy/org/gradle/testkit/runner/internal/feature/BuildResultOutputFeatureCheckTest.groovy`
