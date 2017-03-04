Feature: Create new Spring Rest projects
    Test creation of
    new projects
    using Spring Boot/MVC REST support.

Scenario: new service should pass smoke test
 Given an empty project
 When run Spring Rest generator
 Then we have a POM
