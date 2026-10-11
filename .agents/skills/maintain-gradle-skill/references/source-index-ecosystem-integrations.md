# Gradle Ecosystem Integrations

## Documentation

- [Building C++ projects](https://docs.gradle.org/current/userguide/building_cpp_projects.html)
- [Building native software](https://docs.gradle.org/current/userguide/native_software.html)
- [Building Swift projects](https://docs.gradle.org/current/userguide/building_swift_projects.html)
- [C++ Application](https://docs.gradle.org/current/userguide/cpp_application_plugin.html)
- [C++ Library](https://docs.gradle.org/current/userguide/cpp_library_plugin.html)
- [C++ Unit Test](https://docs.gradle.org/current/userguide/cpp_unit_test_plugin.html)
- [Configuration Cache Requirements for your Build Logic](https://docs.gradle.org/current/userguide/configuration_cache_requirements.html)
- [Developing Parallel Tasks](https://docs.gradle.org/current/userguide/worker_api.html)
- [Migrating Builds From Apache Ant](https://docs.gradle.org/current/userguide/migrating_from_ant.html)
- [Migrating Builds From Apache Maven](https://docs.gradle.org/current/userguide/migrating_from_maven.html)
- [Services and Service Injection](https://docs.gradle.org/current/userguide/service_injection.html)
- [Swift Application](https://docs.gradle.org/current/userguide/swift_application_plugin.html)
- [Swift Library](https://docs.gradle.org/current/userguide/swift_library_plugin.html)
- [Test Event Reporting API](https://docs.gradle.org/current/userguide/test_reporting_api.html)
- [TestEventReporter](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/TestEventReporter.html)
- [TestEventReporterFactory](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/TestEventReporterFactory.html)
- [The Eclipse Plugins](https://docs.gradle.org/current/userguide/eclipse_plugin.html)
- [The IDEA Plugin](https://docs.gradle.org/current/userguide/idea_plugin.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)
- [Using Ant from Gradle](https://docs.gradle.org/current/userguide/ant.html)
- [Visual Studio](https://docs.gradle.org/current/userguide/visual_studio_plugin.html)
- [Xcode](https://docs.gradle.org/current/userguide/xcode_plugin.html)
- [XCTest](https://docs.gradle.org/current/userguide/xctest_plugin.html)

## Source Code

- `platforms/documentation/docs/src/snippets/integration/customTest/groovy/src/main/java/com/example/CustomTest.java`
- `platforms/ide/base-ide-plugins/src/main/java/org/gradle/plugins/ide/internal/IdePlugin.java`
- `platforms/ide/ide-plugins/src/integTest/groovy/org/gradle/plugins/ide/eclipse/EclipseIntegrationTest.groovy`
- `platforms/ide/ide-plugins/src/integTest/groovy/org/gradle/plugins/ide/idea/IdeaMultiModuleIntegrationTest.groovy`
- `platforms/ide/ide-plugins/src/main/java/org/gradle/plugins/ide/eclipse/EclipseWtpPlugin.java`
- `platforms/ide/ide-plugins/src/main/java/org/gradle/plugins/ide/idea/GenerateIdeaModule.java`
- `platforms/ide/ide-plugins/src/main/java/org/gradle/plugins/ide/internal/tooling/EclipseModelBuilder.java`
- `platforms/ide/ide-plugins/src/test/groovy/org/gradle/plugins/ide/internal/tooling/eclipse/EclipseModelBuilderTest.groovy`
- `platforms/ide/ide/src/main/java/org/gradle/plugins/ide/eclipse/GenerateEclipseClasspath.java`
- `platforms/ide/ide/src/main/java/org/gradle/plugins/ide/eclipse/model/EclipseClasspath.java`
- `platforms/ide/ide/src/main/java/org/gradle/plugins/ide/eclipse/model/EclipseProject.java`
- `platforms/ide/ide/src/main/java/org/gradle/plugins/ide/eclipse/model/internal/WtpClasspathAttributeSupport.java`
- `platforms/ide/ide/src/main/java/org/gradle/plugins/ide/internal/IdeDeprecations.java`
- `platforms/ide/ide/src/testFixtures/groovy/org/gradle/plugins/ide/fixtures/ExpectedIdeDeprecations.groovy`
- `platforms/ide/tooling-api/src/crossVersionTest/groovy/org/gradle/plugins/ide/tooling/r214/ToolingApiEclipseModelWtpClasspathAttributesCrossVersionSpec.groovy`
- `platforms/native/language-native/src/main/java/org/gradle/language/cpp/internal/DefaultCppLibrary.java`
- `platforms/native/language-native/src/main/java/org/gradle/language/plugins/NativeBasePlugin.java`
- `platforms/native/language-native/src/test/groovy/org/gradle/language/plugins/NativeBasePluginTest.groovy`
- `platforms/software/ant-api/src/main/java/org/gradle/api/AntBuilder.java`
- `platforms/software/testing-base/src/integTest/groovy/org/gradle/testing/TestEventReporterIntegrationTest.groovy`
- `platforms/software/testing-base/src/main/java/org/gradle/api/internal/tasks/testing/DefaultRootTestEventReporter.java`
- `platforms/software/testing-base/src/main/java/org/gradle/api/internal/tasks/testing/DefaultTestEventReporterFactory.java`
- `platforms/software/testing-base/src/main/java/org/gradle/api/internal/tasks/testing/LifecycleTrackingGroupTestEventReporter.java`
- `platforms/software/testing-base/src/main/java/org/gradle/api/internal/tasks/testing/LifecycleTrackingTestEventReporter.java`
- `platforms/software/testing-base/src/main/java/org/gradle/api/tasks/testing/GroupTestEventReporter.java`
- `platforms/software/testing-base/src/main/java/org/gradle/api/tasks/testing/TestEventReporter.java`
- `platforms/software/testing-base/src/main/java/org/gradle/api/tasks/testing/TestEventReporterFactory.java`
- `subprojects/core-api/src/main/java/org/gradle/api/file/FileCollection.java`
