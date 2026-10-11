# Gradle Worker API And Worker Daemons

## Documentation

- [Build Environment Configuration](https://docs.gradle.org/current/userguide/build_environment.html)
- [Command-Line Interface](https://docs.gradle.org/current/userguide/command_line_interface.html)
- [Configuration Cache Requirements for your Build Logic](https://docs.gradle.org/current/userguide/configuration_cache_requirements.html)
- [Dealing with validation problems](https://docs.gradle.org/current/userguide/validation_problems.html)
- [Developing Parallel Tasks](https://docs.gradle.org/current/userguide/worker_api.html)
- [Implementing Custom Tasks](https://docs.gradle.org/current/userguide/implementing_custom_tasks.html)
- [Services and Service Injection](https://docs.gradle.org/current/userguide/service_injection.html)
- [Upgrading from Gradle 5.x to 6.0](https://docs.gradle.org/current/userguide/upgrading_version_5.html)
- [Upgrading from Gradle 7.x to 8.0](https://docs.gradle.org/current/userguide/upgrading_version_7.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)
- [Using Shared Build Services](https://docs.gradle.org/current/userguide/build_services.html)

## Source Code

- `platforms/core-configuration/model-core/src/main/java/org/gradle/internal/isolated/IsolationScheme.java`
- `platforms/core-execution/daemon-server-worker/src/main/java/org/gradle/workers/WorkAction.java`
- `platforms/core-execution/daemon-server-worker/src/main/java/org/gradle/workers/WorkParameters.java`
- `platforms/core-execution/daemon-server-worker/src/main/java/org/gradle/workers/internal/DefaultActionExecutionSpecFactory.java`
- `platforms/core-execution/daemon-server-worker/src/main/java/org/gradle/workers/internal/DefaultWorkerServer.java`
- `platforms/core-execution/daemon-server-worker/src/main/java/org/gradle/workers/internal/WorkerProcessIsolationProblemsServiceProvider.java`
- `platforms/core-execution/workers/src/integTest/groovy/org/gradle/workers/internal/WorkQueueIntegrationTest.groovy`
- `platforms/core-execution/workers/src/integTest/groovy/org/gradle/workers/internal/WorkerDaemonFailureLoggingIntegrationTest.groovy`
- `platforms/core-execution/workers/src/integTest/groovy/org/gradle/workers/internal/WorkerDaemonLifecycleTest.groovy`
- `platforms/core-execution/workers/src/integTest/groovy/org/gradle/workers/internal/WorkerExecutorErrorHandlingIntegrationTest.groovy`
- `platforms/core-execution/workers/src/integTest/groovy/org/gradle/workers/internal/WorkerExecutorIntegrationTest.groovy`
- `platforms/core-execution/workers/src/integTest/groovy/org/gradle/workers/internal/WorkerExecutorJdkVersionsIntegrationTest.groovy`
- `platforms/core-execution/workers/src/integTest/groovy/org/gradle/workers/internal/WorkerExecutorNestingIntegrationTest.groovy`
- `platforms/core-execution/workers/src/integTest/groovy/org/gradle/workers/internal/WorkerExecutorParallelIntegrationTest.groovy`
- `platforms/core-execution/workers/src/integTest/groovy/org/gradle/workers/internal/WorkerExecutorParametersIntegrationTest.groovy`
- `platforms/core-execution/workers/src/integTest/groovy/org/gradle/workers/internal/WorkerExecutorProblemsApiIntegrationTest.groovy`
- `platforms/core-execution/workers/src/integTest/groovy/org/gradle/workers/internal/WorkerExecutorServicesIntegrationTest.groovy`
- `platforms/core-execution/workers/src/main/java/org/gradle/workers/ClassLoaderWorkerSpec.java`
- `platforms/core-execution/workers/src/main/java/org/gradle/workers/ProcessWorkerSpec.java`
- `platforms/core-execution/workers/src/main/java/org/gradle/workers/WorkQueue.java`
- `platforms/core-execution/workers/src/main/java/org/gradle/workers/WorkerExecutionException.java`
- `platforms/core-execution/workers/src/main/java/org/gradle/workers/WorkerExecutor.java`
- `platforms/core-execution/workers/src/main/java/org/gradle/workers/internal/DaemonForkOptions.java`
- `platforms/core-execution/workers/src/main/java/org/gradle/workers/internal/DefaultWorkerExecutor.java`
- `platforms/core-execution/workers/src/main/java/org/gradle/workers/internal/IsolatedClassloaderWorkerFactory.java`
- `platforms/core-execution/workers/src/main/java/org/gradle/workers/internal/NoIsolationWorkerFactory.java`
- `platforms/core-execution/workers/src/main/java/org/gradle/workers/internal/WorkerDaemonClient.java`
- `platforms/core-execution/workers/src/main/java/org/gradle/workers/internal/WorkerDaemonClientCancellationHandler.java`
- `platforms/core-execution/workers/src/main/java/org/gradle/workers/internal/WorkerDaemonClientsManager.java`
- `platforms/core-execution/workers/src/test/groovy/org/gradle/workers/internal/DaemonForkOptionsTest.groovy`
- `platforms/core-execution/workers/src/test/groovy/org/gradle/workers/internal/WorkerDaemonClientsManagerTest.groovy`
- `platforms/core-runtime/classpath/src/main/java/org/gradle/internal/classpath/ClasspathTransformerCacheFactory.java`
- `platforms/core-runtime/classpath/src/main/java/org/gradle/internal/classpath/DefaultCachedClasspathTransformer.java`
- `platforms/core-runtime/classpath/src/test/groovy/org/gradle/internal/classpath/DefaultCachedClasspathTransformerTest.groovy`
- `platforms/core-runtime/process-services/src/main/java/org/gradle/process/internal/EffectiveJavaForkOptions.java`
- `platforms/core-runtime/process-services/src/test/groovy/org/gradle/process/internal/EffectiveJavaForkOptionsTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/tasks/TaskTimeoutIntegrationTest.groovy`
