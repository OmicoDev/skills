# Gradle Build Services And Lifecycle Work

## Documentation

- [Configuration Cache Requirements for your Build Logic](https://docs.gradle.org/current/userguide/configuration_cache_requirements.html)
- [Dataflow Actions](https://docs.gradle.org/current/userguide/dataflow_actions.html)
- [Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html)
- [Services and Service Injection](https://docs.gradle.org/current/userguide/service_injection.html)
- [Using Shared Build Services](https://docs.gradle.org/current/userguide/build_services.html)

## Source Code

- `subprojects/core-api/src/main/java/org/gradle/api/Task.java`
- `subprojects/core-api/src/main/java/org/gradle/api/services/BuildServiceRegistration.java`
- `subprojects/core-api/src/main/java/org/gradle/api/services/BuildServiceSpec.java`
- `subprojects/core-api/src/main/java/org/gradle/api/services/ServiceReference.java`
- `subprojects/core/src/integTest/groovy/org/gradle/api/services/BuildServiceIntegrationTest.groovy`
- `subprojects/core/src/main/java/org/gradle/api/services/internal/BuildServiceProviderNagger.java`
