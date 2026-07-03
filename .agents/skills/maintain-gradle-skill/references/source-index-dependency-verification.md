# Gradle Dependency Verification

## Documentation

- [Command-Line Interface](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:dependency_verification_options)
- [Securing Gradle Builds](https://docs.gradle.org/current/userguide/security.html)
- [Upgrading within Gradle 9.x.y](https://docs.gradle.org/current/userguide/upgrading_version_9.html)
- [Verifying Dependencies](https://docs.gradle.org/current/userguide/dependency_verification.html)

## Source Code

- `platforms/core-runtime/start-parameter/src/main/java/org/gradle/api/artifacts/verification/DependencyVerificationMode.java`
- `platforms/core-runtime/start-parameter/src/main/java/org/gradle/initialization/StartParameterBuildOptions.java`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/LenientArtifactViewIntegrationTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/verification/DependencyVerificationIntegrityCheckIntegTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/verification/DependencyVerificationSignatureCheckIntegTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/verification/DependencyVerificationSignatureWriteIntegTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/verification/DependencyVerificationWritingIntegTest.groovy`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/ivyservice/ivyresolve/StartParameterResolutionOverride.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/ivyservice/ivyresolve/verification/ChecksumAndSignatureVerificationOverride.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/ivyservice/ivyresolve/verification/DependencyVerificationOverride.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/ivyservice/ivyresolve/verification/report/DependencyVerificationReportWriter.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/ivyservice/ivyresolve/verification/writer/WriteDependencyVerificationFile.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/ivyservice/resolutionstrategy/DefaultResolutionStrategy.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/verification/model/Checksum.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/verification/serializer/DependencyVerificationsXmlReader.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/verification/signatures/BuildTreeDefinedKeys.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/verification/verifier/DependencyVerificationConfiguration.java`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/verification/verifier/DependencyVerifier.java`
- `platforms/software/dependency-management/src/test/groovy/org/gradle/api/internal/artifacts/ivyservice/resolutionstrategy/DefaultResolutionStrategySpec.groovy`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ResolutionStrategy.java`
