# Gradle External Processes

## Documentation

- [Compatibility Matrix](https://docs.gradle.org/current/userguide/compatibility.html)
- [Configuration Cache Requirements for your Build Logic](https://docs.gradle.org/current/userguide/configuration_cache_requirements.html)
- [Implementing Custom Tasks](https://docs.gradle.org/current/userguide/implementing_custom_tasks.html)
- [Services and Service Injection](https://docs.gradle.org/current/userguide/service_injection.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)

## Source Code

- `platforms/core-runtime/process-services-base/src/main/java/org/gradle/process/internal/DefaultExecHandle.java`
- `platforms/core-runtime/process-services-base/src/main/java/org/gradle/process/internal/ExecHandleRunner.java`
- `platforms/core-runtime/process-services-base/src/main/java/org/gradle/process/internal/ExecHandleShutdownHookAction.java`
- `platforms/core-runtime/process-services/src/integTest/groovy/org/gradle/process/internal/CancellationIntegrationTest.groovy`
- `platforms/core-runtime/process-services/src/integTest/groovy/org/gradle/process/internal/DestroyForkedProcessesIntegrationTest.groovy`
- `subprojects/core-api/src/main/java/org/gradle/api/provider/ProviderFactory.java`
- `subprojects/core-api/src/main/java/org/gradle/api/provider/ValueSource.java`
- `subprojects/core-api/src/main/java/org/gradle/process/BaseExecSpec.java`
- `subprojects/core-api/src/main/java/org/gradle/process/ExecOperations.java`
- `subprojects/core-api/src/main/java/org/gradle/process/ExecOutput.java`
- `subprojects/core-api/src/main/java/org/gradle/process/ExecSpec.java`
- `subprojects/core-api/src/main/java/org/gradle/process/ProcessForkOptions.java`
