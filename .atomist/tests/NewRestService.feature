Feature: Create new Spring Rest projects
    Test creation of
    new projects
    using Spring Boot/MVC REST support.

Scenario: new service should pass smoke test with pom
 Given an empty project
 When run Spring Rest generator
 Then we have a POM
 Then we don't have a CODE_OF_CONDUCT
