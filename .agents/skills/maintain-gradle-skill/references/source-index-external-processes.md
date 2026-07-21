# Gradle External Processes

## Documentation

- [Compatibility Matrix](https://docs.gradle.org/current/userguide/compatibility.html)
- [Configuration Cache Requirements for your Build Logic (Gradle 9.6.1)](https://docs.gradle.org/9.6.1/userguide/configuration_cache_requirements.html)
- [Implementing Custom Tasks](https://docs.gradle.org/current/userguide/implementing_custom_tasks.html)
- [Services and Service Injection](https://docs.gradle.org/current/userguide/service_injection.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)

## Source Code

- `platforms/core-configuration/configuration-cache/src/integTest/groovy/org/gradle/internal/cc/impl/ConfigurationCacheValueSourceIntegrationTest.groovy`
- `platforms/core-configuration/configuration-cache/src/integTest/groovy/org/gradle/internal/cc/impl/fixtures/ExternalProcessFixture.groovy`
- `platforms/core-configuration/configuration-cache/src/integTest/groovy/org/gradle/internal/cc/impl/inputs/process/ProcessInBuildScriptIntegrationTest.groovy`
- `platforms/core-configuration/configuration-cache/src/integTest/groovy/org/gradle/internal/cc/impl/inputs/process/ProcessInInitScriptIntegrationTest.groovy`
- `platforms/core-configuration/configuration-cache/src/integTest/groovy/org/gradle/internal/cc/impl/inputs/process/ProcessInPluginIntegrationTest.groovy`
- `platforms/core-configuration/configuration-cache/src/main/kotlin/org/gradle/internal/cc/impl/InstrumentedInputAccessListener.kt`
- `platforms/core-configuration/configuration-cache/src/main/kotlin/org/gradle/internal/cc/impl/initialization/ConfigurationCacheProblemsListener.kt`
- `platforms/core-configuration/model-core/src/integTest/groovy/org/gradle/api/provider/ProcessOutputProviderIntegrationTest.groovy`
- `platforms/core-configuration/model-core/src/main/java/org/gradle/api/internal/provider/DefaultProviderFactory.java`
- `platforms/core-configuration/model-core/src/main/java/org/gradle/api/internal/provider/sources/process/DefaultExecOutput.java`
- `platforms/core-configuration/model-core/src/main/java/org/gradle/api/internal/provider/sources/process/ProcessOutputProviderFactory.java`
- `platforms/core-configuration/model-core/src/main/java/org/gradle/api/internal/provider/sources/process/ProcessOutputValueSource.java`
- `platforms/core-runtime/classpath/src/main/java/org/gradle/internal/classpath/Instrumented.java`
- `platforms/core-runtime/process-services-base/src/main/java/org/gradle/process/internal/DefaultExecHandle.java`
- `platforms/core-runtime/process-services-base/src/main/java/org/gradle/process/internal/ExecHandleRunner.java`
- `platforms/core-runtime/process-services-base/src/main/java/org/gradle/process/internal/ExecHandleShutdownHookAction.java`
- `platforms/core-runtime/process-services/src/integTest/groovy/org/gradle/process/internal/CancellationIntegrationTest.groovy`
- `platforms/core-runtime/process-services/src/integTest/groovy/org/gradle/process/internal/DestroyForkedProcessesIntegrationTest.groovy`
- `platforms/core-runtime/process-services/src/main/java/org/gradle/process/internal/DefaultExecActionFactory.java`
- `subprojects/core-api/src/main/java/org/gradle/api/provider/ProviderFactory.java`
- `subprojects/core-api/src/main/java/org/gradle/api/provider/ValueSource.java`
- `subprojects/core-api/src/main/java/org/gradle/process/BaseExecSpec.java`
- `subprojects/core-api/src/main/java/org/gradle/process/ExecOperations.java`
- `subprojects/core-api/src/main/java/org/gradle/process/ExecOutput.java`
- `subprojects/core-api/src/main/java/org/gradle/process/ExecSpec.java`
- `subprojects/core-api/src/main/java/org/gradle/process/ProcessForkOptions.java`
