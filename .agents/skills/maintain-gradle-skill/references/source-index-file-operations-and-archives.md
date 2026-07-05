# Gradle File Operations And Archives

## Documentation

- [Configuration Cache Requirements for your Build Logic](https://docs.gradle.org/current/userguide/configuration_cache_requirements.html)
- [Implementing Custom Tasks](https://docs.gradle.org/current/userguide/implementing_custom_tasks.html)
- [Important concepts](https://docs.gradle.org/current/userguide/build_cache_concepts.html)
- [The Application Plugin](https://docs.gradle.org/current/userguide/application_plugin.html)
- [The Base Plugin](https://docs.gradle.org/current/userguide/base_plugin.html)
- [The Distribution Plugin](https://docs.gradle.org/current/userguide/distribution_plugin.html)
- [The Ear Plugin](https://docs.gradle.org/current/userguide/ear_plugin.html)
- [The Java Library Distribution Plugin](https://docs.gradle.org/current/userguide/java_library_distribution_plugin.html)
- [The War Plugin](https://docs.gradle.org/current/userguide/war_plugin.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)
- [Working With Files](https://docs.gradle.org/current/userguide/working_with_files.html)

## Source Code

- `platforms/core-configuration/file-operations/src/main/java/org/gradle/api/internal/file/copy/SyncCopyActionDecorator.java`
- `platforms/jvm/plugins-application/src/main/java/org/gradle/api/internal/plugins/StartScriptTemplateBindingFactory.java`
- `platforms/jvm/plugins-application/src/main/java/org/gradle/jvm/application/tasks/CreateStartScripts.java`
- `platforms/jvm/plugins-application/src/test/groovy/org/gradle/api/internal/plugins/StartScriptGeneratorTest.groovy`
- `platforms/jvm/plugins-application/src/test/groovy/org/gradle/api/tasks/application/CreateStartScriptsTest.groovy`
- `subprojects/core-api/src/main/java/org/gradle/api/file/CopySpec.java`
- `subprojects/core-api/src/main/java/org/gradle/api/file/DuplicatesStrategy.java`
- `subprojects/core-api/src/main/java/org/gradle/api/file/FileCopyDetails.java`
- `subprojects/core-api/src/main/java/org/gradle/api/file/SyncSpec.java`
- `subprojects/core/src/integTest/groovy/org/gradle/api/tasks/ArchiveTaskPermissionsIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/tasks/CopyTaskIntegrationSpec.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/tasks/ReproducibleArchivesIntegrationTest.groovy`
- `subprojects/core/src/integTest/groovy/org/gradle/api/tasks/bundling/ArchiveIntegrationTest.groovy`
- `subprojects/core/src/main/java/org/gradle/api/tasks/Copy.java`
- `subprojects/core/src/main/java/org/gradle/api/tasks/Sync.java`
- `subprojects/core/src/main/java/org/gradle/api/tasks/bundling/AbstractArchiveTask.java`
