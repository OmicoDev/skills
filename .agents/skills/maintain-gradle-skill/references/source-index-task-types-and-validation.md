# Gradle Task Types And Validation

## Documentation

- [Advanced Tasks](https://docs.gradle.org/current/userguide/custom_tasks.html)
- [Avoiding Unnecessary Task Configuration](https://docs.gradle.org/current/userguide/task_configuration_avoidance.html)
- [Best Practices for Tasks](https://docs.gradle.org/current/userguide/best_practices_tasks.html)
- [Configuration Cache Requirements for your Build Logic](https://docs.gradle.org/current/userguide/configuration_cache_requirements.html)
- [Dealing with validation problems](https://docs.gradle.org/current/userguide/validation_problems.html)
- [Implementing Custom Tasks](https://docs.gradle.org/current/userguide/implementing_custom_tasks.html)
- [Incremental Build](https://docs.gradle.org/current/userguide/incremental_build.html)

## Source Code

- `platforms/core-configuration/model-reflect/src/test/groovy/org/gradle/internal/reflect/validation/ValidationMessageCheckerTest.groovy`
- `platforms/core-execution/execution/src/main/java/org/gradle/internal/execution/WorkValidationUtils.java`
- `platforms/core-execution/execution/src/main/java/org/gradle/internal/execution/model/annotations/AbstractInputFilePropertyAnnotationHandler.java`
- `platforms/core-execution/execution/src/main/java/org/gradle/internal/execution/model/annotations/InputDirectoryPropertyAnnotationHandler.java`
- `platforms/core-execution/execution/src/main/java/org/gradle/internal/execution/model/annotations/ServiceReferencePropertyAnnotationHandler.java`
- `subprojects/core-api/src/main/java/org/gradle/api/Task.java`
- `subprojects/core-api/src/main/java/org/gradle/api/model/ReplacedBy.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/CacheableTask.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/Classpath.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/CompileClasspath.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/Console.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/Destroys.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/IgnoreEmptyDirectories.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/Input.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/InputDirectory.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/InputFile.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/InputFiles.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/Internal.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/LocalState.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/Nested.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/Optional.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/OutputDirectories.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/OutputDirectory.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/OutputFile.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/OutputFiles.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/PathSensitive.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/PathSensitivity.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/SkipWhenEmpty.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/TaskAction.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/TaskOutputs.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/UntrackedTask.java`
- `subprojects/core-api/src/main/java/org/gradle/work/DisableCachingByDefault.java`
- `subprojects/core-api/src/main/java/org/gradle/work/Incremental.java`
- `subprojects/core-api/src/main/java/org/gradle/work/InputChanges.java`
- `subprojects/core-api/src/main/java/org/gradle/work/NormalizeLineEndings.java`
- `subprojects/core/src/integTest/groovy/org/gradle/api/internal/tasks/TaskCacheabilityReasonIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/services/BuildServiceIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/tasks/AbstractDirectorySensitivityIntegrationSpec.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/tasks/IncrementalInputsIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/tasks/TaskValidationFailureRenderingIntegrationTest.groovy`
- `subprojects/core/src/main/java/org/gradle/api/internal/changedetection/changes/DefaultTaskExecutionModeResolver.java`
- `subprojects/core/src/main/java/org/gradle/api/internal/tasks/execution/DefaultTaskCacheabilityResolver.java`
- `subprojects/core/src/main/java/org/gradle/execution/DefaultWorkValidationWarningRecorder.java`
