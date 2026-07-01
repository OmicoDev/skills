# Gradle Java Compatibility

## Documentation

- [Compatibility Matrix](https://docs.gradle.org/current/userguide/compatibility.html)

## Source Code

- `platforms/core-execution/worker-main/src/main/java/org/gradle/process/internal/worker/messaging/WorkerConfigSerializer.java`
- `platforms/core-runtime/build-configuration/src/main/java/org/gradle/buildconfiguration/tasks/UpdateDaemonJvm.java`
- `platforms/core-runtime/build-configuration/src/main/java/org/gradle/internal/buildconfiguration/tasks/DaemonJvmPropertiesUtils.java`
- `platforms/core-runtime/build-process-services/src/main/java/org/gradle/internal/jvm/SupportedJavaVersions.java`
- `platforms/core-runtime/build-process-services/src/main/java/org/gradle/internal/jvm/UnsupportedJavaRuntimeException.java`
- `platforms/core-runtime/daemon-protocol/src/main/java/org/gradle/internal/buildconfiguration/DaemonJvmPropertiesDefaults.java`
- `platforms/core-runtime/daemon-protocol/src/main/java/org/gradle/launcher/daemon/toolchain/DaemonJvmCriteria.java`
- `platforms/core-runtime/launcher/src/integTest/groovy/org/gradle/launcher/daemon/DaemonJvmSettingsIntegrationTest.groovy`
- `platforms/core-runtime/launcher/src/main/java/org/gradle/launcher/exec/RootBuildLifecycleBuildActionExecutor.java`
- `platforms/extensibility/plugin-development/src/integTest/groovy/org/gradle/plugin/devel/tasks/ValidatePluginsPart2IntegrationTest.groovy`
- `platforms/extensibility/plugin-development/src/main/java/org/gradle/plugin/devel/tasks/ValidatePlugins.java`
- `platforms/ide/tooling-api/src/main/java/org/gradle/tooling/GradleConnector.java`
- `platforms/jvm/testing-jvm/src/integTest/groovy/org/gradle/testing/AbstractTestTaskIntegrationTest.groovy`
- `platforms/jvm/testing-jvm/src/integTest/groovy/org/gradle/testing/TestTaskJavaVersionIntegrationTest.groovy`
- `platforms/jvm/testing-jvm/src/main/java/org/gradle/api/internal/tasks/testing/TestExecutableUtils.java`
- `platforms/jvm/testing-jvm/src/main/java/org/gradle/api/tasks/testing/Test.java`
