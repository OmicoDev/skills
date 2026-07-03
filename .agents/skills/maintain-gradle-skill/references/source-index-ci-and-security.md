# Gradle CI And Security

## Documentation

- [Best Practices for Security](https://docs.gradle.org/current/userguide/best_practices_security.html)
- [Gradle Docker Images](https://docs.gradle.org/current/userguide/docker.html)
- [Gradle on CI / CD Systems](https://docs.gradle.org/current/userguide/gradle_on_ci.html)
- [Gradle on GitHub Actions](https://docs.gradle.org/current/userguide/github-actions.html)
- [Gradle on GitLab CI](https://docs.gradle.org/current/userguide/gitlab-ci.html)
- [Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html)
- [Publishing Plugins to the Gradle Plugin Portal](https://docs.gradle.org/current/userguide/publishing_gradle_plugins.html)
- [Securing Gradle Builds](https://docs.gradle.org/current/userguide/security.html)
- [Supported Repository Protocols](https://docs.gradle.org/current/userguide/supported_repository_protocols.html)
- [The Maven Publish Plugin](https://docs.gradle.org/current/userguide/publishing_maven.html)
- [Verifying Dependencies](https://docs.gradle.org/current/userguide/dependency_verification.html)

## Source Code

- `platforms/core-runtime/files/src/main/java/org/gradle/internal/file/PathTraversalChecker.java`
- `platforms/core-runtime/wrapper-main/src/integTest/groovy/org/gradle/integtests/WrapperChecksumVerificationTest.groovy`
- `platforms/core-runtime/wrapper-main/src/integTest/groovy/org/gradle/integtests/WrapperConcurrentDownloadTest.groovy`
- `platforms/core-runtime/wrapper-shared/src/main/java/org/gradle/internal/file/locking/ExclusiveFileAccessManager.java`
- `platforms/core-runtime/wrapper-shared/src/main/java/org/gradle/util/internal/WrapperCredentials.java`
- `platforms/core-runtime/wrapper-shared/src/main/java/org/gradle/wrapper/Download.java`
- `platforms/core-runtime/wrapper-shared/src/main/java/org/gradle/wrapper/Install.java`
- `platforms/core-runtime/wrapper-shared/src/main/java/org/gradle/wrapper/PathAssembler.java`
- `platforms/core-runtime/wrapper-shared/src/main/java/org/gradle/wrapper/WrapperConfiguration.java`
- `platforms/core-runtime/wrapper-shared/src/main/java/org/gradle/wrapper/WrapperExecutor.java`
- `platforms/core-runtime/wrapper-shared/src/test/groovy/org/gradle/internal/file/PathTraversalCheckerTest.groovy`
- `platforms/core-runtime/wrapper-shared/src/test/groovy/org/gradle/util/internal/WrapperCredentialsTest.groovy`
- `platforms/core-runtime/wrapper-shared/src/test/groovy/org/gradle/wrapper/InstallTest.groovy`
- `platforms/core-runtime/wrapper-shared/src/test/groovy/org/gradle/wrapper/WrapperExecutorTest.groovy`
