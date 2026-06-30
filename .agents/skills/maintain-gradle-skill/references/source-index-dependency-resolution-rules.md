# Gradle Dependency Resolution Rules

## Documentation

- [Best Practices for Dependencies](https://docs.gradle.org/current/userguide/best_practices_dependencies.html)
- [Component Capabilities](https://docs.gradle.org/current/userguide/component_capabilities.html)
- [Composite Builds (Included Builds)](https://docs.gradle.org/current/userguide/composite_builds.html)
- [How to Exclude Transitive Dependencies in Gradle](https://docs.gradle.org/current/userguide/how_to_exclude_transitive_dependencies.html)
- [How to Use a Local Fork of a Module Dependency with Gradle](https://docs.gradle.org/current/userguide/how_to_use_local_forks.html)
- [Using Resolution Rules](https://docs.gradle.org/current/userguide/resolution_rules.html)

## Source Code

- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/ivy/ComponentSelectionRulesDependencyResolveIntegTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/ivy/ComponentSelectionRulesErrorHandlingIntegTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/ivy/ComponentSelectionRulesProcessingIntegTest.groovy`
- `platforms/software/dependency-management/src/integTest/groovy/org/gradle/integtests/resolve/rules/DependencyResolveRulesDisableGlobalDependencySubstitutionIntegrationTest.groovy`
- `platforms/software/dependency-management/src/main/java/org/gradle/api/internal/artifacts/ivyservice/resolutionstrategy/DefaultCapabilitiesResolution.java`
- `platforms/software/dependency-management/src/test/groovy/org/gradle/api/internal/artifacts/ivyservice/resolutionstrategy/DefaultResolutionStrategySpec.groovy`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/CapabilitiesResolution.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/CapabilityResolutionDetails.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ComponentSelection.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ComponentSelectionRules.java`
- `subprojects/core-api/src/main/java/org/gradle/api/artifacts/ResolutionStrategy.java`
