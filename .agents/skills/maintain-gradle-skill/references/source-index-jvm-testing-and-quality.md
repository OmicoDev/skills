# Gradle JVM Testing And Quality

## Documentation

- [Best Practices for Testing](https://docs.gradle.org/current/userguide/best_practices_testing.html)
- [Gradle 9.4.1 Release Notes](https://docs.gradle.org/9.4.1/release-notes.html)
- [Java Test Fixtures](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)
- [JUnit 5.12 TestReporter API](https://docs.junit.org/5.12.0/api/org.junit.jupiter.api/org/junit/jupiter/api/TestReporter.html)
- [Testing in Java & JVM projects (Gradle 9.6.1)](https://docs.gradle.org/9.6.1/userguide/java_testing.html)
- [The Checkstyle Plugin](https://docs.gradle.org/current/userguide/checkstyle_plugin.html)
- [The CodeNarc Plugin](https://docs.gradle.org/current/userguide/codenarc_plugin.html)
- [The JaCoCo Plugin (Gradle 9.6.1)](https://docs.gradle.org/9.6.1/userguide/jacoco_plugin.html)
- [The JaCoCo Report Aggregation Plugin](https://docs.gradle.org/current/userguide/jacoco_report_aggregation_plugin.html)
- [The JVM Test Suite Plugin](https://docs.gradle.org/current/userguide/jvm_test_suite_plugin.html)
- [The PMD Plugin](https://docs.gradle.org/current/userguide/pmd_plugin.html)
- [The Test Report Aggregation Plugin](https://docs.gradle.org/current/userguide/test_report_aggregation_plugin.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)

## Source Code

- `platforms/core-execution/Work Validation.md`
- `platforms/core-runtime/process-services/src/main/java/org/gradle/process/internal/DefaultJavaForkOptions.java`
- `platforms/core-runtime/process-services/src/main/java/org/gradle/process/internal/JvmOptions.java`
- `platforms/documentation/docs/src/docs/userguide/best-practices/best_practices_testing.adoc`
- `platforms/documentation/docs/src/docs/userguide/reference/platforms/jvm/java_testing.adoc`
- `platforms/documentation/docs/src/docs/userguide/reference/platforms/jvm/jvm_test_suite_plugin.adoc`
- `platforms/documentation/docs/src/docs/userguide/reference/platforms/jvm/test_report_aggregation_plugin.adoc`
- `platforms/jvm/jacoco-workers/src/main/java/org/gradle/internal/jacoco/AntJacocoCheck.java`
- `platforms/jvm/jacoco/src/integTest/groovy/org/gradle/testing/jacoco/plugins/JacocoCachingIntegrationTest.groovy`
- `platforms/jvm/jacoco/src/integTest/groovy/org/gradle/testing/jacoco/plugins/JacocoPluginMultiVersionIntegrationTest.groovy`
- `platforms/jvm/jacoco/src/integTest/groovy/org/gradle/testing/jacoco/plugins/rules/JacocoPluginCoverageVerificationIntegrationTest.groovy`
- `platforms/jvm/jacoco/src/main/java/org/gradle/internal/jacoco/rules/JacocoViolationRulesContainerImpl.java`
- `platforms/jvm/jacoco/src/main/java/org/gradle/testing/jacoco/plugins/JacocoPlugin.java`
- `platforms/jvm/jacoco/src/main/java/org/gradle/testing/jacoco/plugins/JacocoReportAggregationPlugin.java`
- `platforms/jvm/jacoco/src/main/java/org/gradle/testing/jacoco/tasks/JacocoCoverageVerification.java`
- `platforms/jvm/jacoco/src/main/java/org/gradle/testing/jacoco/tasks/JacocoReportBase.java`
- `platforms/jvm/language-java/src/integTest/groovy/org/gradle/api/tasks/JavaExecIntegrationTest.groovy`
- `platforms/jvm/language-java/src/main/java/org/gradle/api/tasks/JavaExec.java`
- `platforms/jvm/plugins-jvm-test-suite/src/main/java/org/gradle/api/plugins/JvmTestSuitePlugin.java`
- `platforms/jvm/plugins-jvm-test-suite/src/main/java/org/gradle/api/plugins/jvm/JvmTestSuite.java`
- `platforms/jvm/plugins-test-report-aggregation/src/main/java/org/gradle/api/plugins/TestReportAggregationPlugin.java`
- `platforms/jvm/testing-jvm-infrastructure/src/main/java/org/gradle/api/internal/tasks/testing/junitplatform/JUnitPlatformTestDefinitionProcessor.java`
- `platforms/jvm/testing-jvm-infrastructure/src/main/java/org/gradle/api/internal/tasks/testing/junitplatform/JUnitPlatformTestExecutionListener.java`
- `platforms/jvm/testing-jvm/src/integTest/groovy/org/gradle/testing/AbstractTestFilteringIntegrationTest.groovy`
- `platforms/jvm/testing-jvm/src/integTest/groovy/org/gradle/testing/AbstractTestOutputListenerIntegrationTest.groovy`
- `platforms/jvm/testing-jvm/src/integTest/groovy/org/gradle/testing/fixture/TestNGCoverage.groovy`
- `platforms/jvm/testing-jvm/src/integTest/groovy/org/gradle/testing/junit/junit4/AbstractJUnit4TestListenerIntegrationTest.groovy`
- `platforms/jvm/testing-jvm/src/integTest/groovy/org/gradle/testing/junit/jupiter/JUnitJupiterTestMetadataListenerIntegrationTest.groovy`
- `platforms/jvm/testing-jvm/src/integTest/groovy/org/gradle/testing/junit/platform/JUnitPlatformReportEntryIntegrationTest.groovy`
- `platforms/jvm/testing-jvm/src/integTest/groovy/org/gradle/testing/nonclassbased/IncorrectSetupNonClassBasedTestingIntegrationTest.groovy`
- `platforms/jvm/testing-jvm/src/integTest/groovy/org/gradle/testing/nonclassbased/NonClassBasedTestingIntegrationTest.groovy`
- `platforms/jvm/testing-jvm/src/integTest/groovy/org/gradle/testing/nonclassbased/ParallelNonClassBasedTestExecutionIntegrationTest.groovy`
- `platforms/jvm/testing-jvm/src/integTest/groovy/org/gradle/testing/testng/TestNGDryRunFilteringIntegrationTest.groovy`
- `platforms/jvm/testing-jvm/src/integTest/groovy/org/gradle/testing/testsuites/JUnitOptionsIntegrationTest.groovy`
- `platforms/jvm/testing-jvm/src/main/java/org/gradle/api/internal/tasks/testing/detection/DefaultTestExecuter.java`
- `platforms/jvm/testing-jvm/src/main/java/org/gradle/api/internal/tasks/testing/junitplatform/JUnitPlatformTestFramework.java`
- `platforms/jvm/testing-jvm/src/main/java/org/gradle/api/internal/tasks/testing/testng/TestNGTestFramework.java`
- `platforms/jvm/testing-jvm/src/main/java/org/gradle/api/tasks/testing/Test.java`
- `platforms/software/testing-base-infrastructure/src/main/java/org/gradle/api/tasks/testing/TestFileAttachmentDataEvent.java`
- `platforms/software/testing-base-infrastructure/src/main/java/org/gradle/api/tasks/testing/TestKeyValueDataEvent.java`
- `platforms/software/testing-base/src/main/java/org/gradle/api/internal/tasks/testing/junit/result/JUnitXmlResultWriter.java`
- `platforms/software/testing-base/src/main/java/org/gradle/api/internal/tasks/testing/report/generic/GenericPageRenderer.java`
- `platforms/software/testing-base/src/main/java/org/gradle/api/internal/tasks/testing/report/generic/PerRootTabRenderer.java`
- `platforms/software/testing-base/src/main/java/org/gradle/api/tasks/testing/AbstractTestTask.java`
- `platforms/software/testing-base/src/main/java/org/gradle/api/tasks/testing/TestMetadataListener.java`
- `platforms/software/testing-base/src/test/groovy/org/gradle/api/internal/tasks/testing/junit/result/JUnitXmlResultWriterSpec.groovy`
- `subprojects/core-api/src/main/java/org/gradle/process/JavaForkOptions.java`
