# Gradle Build Services And Lifecycle Work

## Documentation

- [Build Lifecycle](https://docs.gradle.org/current/userguide/build_lifecycle.html)
- [Configuration Cache Requirements for your Build Logic](https://docs.gradle.org/current/userguide/configuration_cache_requirements.html)
- [Dataflow Actions](https://docs.gradle.org/current/userguide/dataflow_actions.html)
- [Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html)
- [Services and Service Injection](https://docs.gradle.org/current/userguide/service_injection.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)
- [Using Shared Build Services](https://docs.gradle.org/current/userguide/build_services.html)

## Source Code

- `platforms/core-configuration/configuration-cache/src/integTest/groovy/org/gradle/internal/cc/impl/ConfigurationCacheFlowScopeIntegrationTest.groovy`
- `platforms/core-configuration/configuration-cache/src/integTest/groovy/org/gradle/internal/cc/impl/ConfigurationCacheUnsupportedTypesIntegrationTest.groovy`
- `platforms/core-configuration/core-flow-services-api/src/main/java/org/gradle/api/flow/BuildWorkResult.java`
- `platforms/core-configuration/core-flow-services-api/src/main/java/org/gradle/api/flow/FlowAction.java`
- `platforms/core-configuration/core-flow-services-api/src/main/java/org/gradle/api/flow/FlowActionSpec.java`
- `platforms/core-configuration/core-flow-services-api/src/main/java/org/gradle/api/flow/FlowParameters.java`
- `platforms/core-configuration/core-flow-services-api/src/main/java/org/gradle/api/flow/FlowProviders.java`
- `platforms/core-configuration/core-flow-services-api/src/main/java/org/gradle/api/flow/FlowScope.java`
- `platforms/core-configuration/flow-services/src/integTest/groovy/org/gradle/internal/flow/services/FlowScopeIntegrationTest.groovy`
- `platforms/core-configuration/flow-services/src/main/kotlin/org/gradle/internal/flow/services/BuildFlowScope.kt`
- `platforms/core-configuration/flow-services/src/main/kotlin/org/gradle/internal/flow/services/DefaultFlowProviders.kt`
- `platforms/core-configuration/flow-services/src/main/kotlin/org/gradle/internal/flow/services/FlowParametersInstantiator.kt`
- `platforms/core-configuration/flow-services/src/main/kotlin/org/gradle/internal/flow/services/FlowScheduler.kt`
- `platforms/core-configuration/flow-services/src/main/kotlin/org/gradle/internal/flow/services/FlowServices.kt`
- `subprojects/core-api/src/main/java/org/gradle/api/Task.java`
- `subprojects/core-api/src/main/java/org/gradle/api/services/BuildServiceRegistration.java`
- `subprojects/core-api/src/main/java/org/gradle/api/services/BuildServiceRegistry.java`
- `subprojects/core-api/src/main/java/org/gradle/api/services/BuildServiceSpec.java`
- `subprojects/core-api/src/main/java/org/gradle/api/services/ServiceReference.java`
- `subprojects/core-api/src/main/java/org/gradle/build/event/BuildEventsListenerRegistry.java`
- `subprojects/core/src/integTest/groovy/org/gradle/api/services/BuildServiceIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/services/BuildServiceParallelExecutionIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/build/event/BuildEventsParallelIntegrationTest.groovy`
- `subprojects/core/src/main/java/org/gradle/api/services/internal/BuildServiceProviderNagger.java`
- `subprojects/core/src/main/java/org/gradle/api/services/internal/DefaultBuildServicesRegistry.java`
- `subprojects/core/src/main/java/org/gradle/api/services/internal/RegisteredBuildServiceProvider.java`
- `subprojects/core/src/main/java/org/gradle/internal/service/scopes/BuildScopeServices.java`
- `subprojects/core/src/test/groovy/org/gradle/api/services/internal/DefaultBuildServicesRegistryTest.groovy`
