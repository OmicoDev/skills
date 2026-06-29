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

- `subprojects/core-api/src/main/java/org/gradle/api/tasks/CacheableTask.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/InputDirectory.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/InputFile.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/InputFiles.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/OutputDirectory.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/OutputFile.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/PathSensitive.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/PathSensitivity.java`
- `subprojects/core-api/src/main/java/org/gradle/api/tasks/TaskOutputs.java`
- `subprojects/core-api/src/main/java/org/gradle/work/DisableCachingByDefault.java`
