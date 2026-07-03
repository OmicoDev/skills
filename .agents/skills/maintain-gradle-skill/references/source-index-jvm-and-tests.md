# Gradle JVM And Tests

## Documentation

- [Best Practices for Dependencies](https://docs.gradle.org/current/userguide/best_practices_dependencies.html)
- [Best Practices for Testing](https://docs.gradle.org/current/userguide/best_practices_testing.html)
- [Build Environment Configuration](https://docs.gradle.org/current/userguide/build_environment.html)
- [Java Test Fixtures](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)
- [Testing in Java & JVM projects](https://docs.gradle.org/current/userguide/java_testing.html)
- [The Application Plugin](https://docs.gradle.org/current/userguide/application_plugin.html)
- [The Checkstyle Plugin](https://docs.gradle.org/current/userguide/checkstyle_plugin.html)
- [The CodeNarc Plugin](https://docs.gradle.org/current/userguide/codenarc_plugin.html)
- [The Groovy Plugin](https://docs.gradle.org/current/userguide/groovy_plugin.html)
- [The JaCoCo Plugin](https://docs.gradle.org/current/userguide/jacoco_plugin.html)
- [The JaCoCo Report Aggregation Plugin](https://docs.gradle.org/current/userguide/jacoco_report_aggregation_plugin.html)
- [The Java Library Plugin](https://docs.gradle.org/current/userguide/java_library_plugin.html)
- [The Java Plugin](https://docs.gradle.org/current/userguide/java_plugin.html)
- [The JVM Test Suite Plugin](https://docs.gradle.org/current/userguide/jvm_test_suite_plugin.html)
- [The PMD Plugin](https://docs.gradle.org/current/userguide/pmd_plugin.html)
- [The Scala Plugin](https://docs.gradle.org/current/userguide/scala_plugin.html)
- [The Test Report Aggregation Plugin](https://docs.gradle.org/current/userguide/test_report_aggregation_plugin.html)
- [Toolchains for JVM projects](https://docs.gradle.org/current/userguide/toolchains.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)

## Source Code

- `architecture/build-execution-model.md`
- `platforms/core-execution/Work Validation.md`
- `platforms/core-runtime/process-services/src/main/java/org/gradle/process/internal/DefaultJavaForkOptions.java`
- `platforms/core-runtime/process-services/src/main/java/org/gradle/process/internal/JvmOptions.java`
- `platforms/documentation/docs/src/docs/userguide/best-practices/best_practices_testing.adoc`
- `platforms/documentation/docs/src/docs/userguide/reference/platforms/jvm/java_testing.adoc`
- `platforms/documentation/docs/src/docs/userguide/reference/platforms/jvm/jvm_test_suite_plugin.adoc`
- `platforms/documentation/docs/src/docs/userguide/reference/platforms/jvm/test_report_aggregation_plugin.adoc`
- `platforms/jvm/jacoco/src/main/java/org/gradle/testing/jacoco/plugins/JacocoPlugin.java`
- `platforms/jvm/jacoco/src/main/java/org/gradle/testing/jacoco/plugins/JacocoReportAggregationPlugin.java`
- `platforms/jvm/language-java/src/integTest/groovy/org/gradle/api/tasks/JavaExecIntegrationTest.groovy`
- `platforms/jvm/language-java/src/main/java/org/gradle/api/tasks/JavaExec.java`
- `platforms/jvm/plugins-jvm-test-suite/src/main/java/org/gradle/api/plugins/JvmTestSuitePlugin.java`
- `platforms/jvm/plugins-jvm-test-suite/src/main/java/org/gradle/api/plugins/jvm/JvmTestSuite.java`
- `platforms/jvm/plugins-test-report-aggregation/src/main/java/org/gradle/api/plugins/TestReportAggregationPlugin.java`
- `platforms/jvm/testing-jvm/src/integTest/groovy/org/gradle/testing/AbstractTestFilteringIntegrationTest.groovy`
- `platforms/jvm/testing-jvm/src/integTest/groovy/org/gradle/testing/AbstractTestOutputListenerIntegrationTest.groovy`
- `platforms/jvm/testing-jvm/src/integTest/groovy/org/gradle/testing/fixture/TestNGCoverage.groovy`
- `platforms/jvm/testing-jvm/src/integTest/groovy/org/gradle/testing/junit/junit4/AbstractJUnit4TestListenerIntegrationTest.groovy`
- `platforms/jvm/testing-jvm/src/integTest/groovy/org/gradle/testing/testng/TestNGDryRunFilteringIntegrationTest.groovy`
- `platforms/jvm/testing-jvm/src/integTest/groovy/org/gradle/testing/testsuites/JUnitOptionsIntegrationTest.groovy`
- `platforms/jvm/testing-jvm/src/main/java/org/gradle/api/internal/tasks/testing/junitplatform/JUnitPlatformTestFramework.java`
- `platforms/jvm/testing-jvm/src/main/java/org/gradle/api/internal/tasks/testing/testng/TestNGTestFramework.java`
- `platforms/jvm/testing-jvm/src/main/java/org/gradle/api/tasks/testing/Test.java`
- `platforms/software/testing-base/src/main/java/org/gradle/api/tasks/testing/AbstractTestTask.java`
- `subprojects/core-api/src/main/java/org/gradle/process/JavaForkOptions.java`
