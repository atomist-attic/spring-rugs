# Copyright © 2016 Atomist, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


Feature: NewSpringBootRestService generator should create Spring Boot REST service projects
  The Atomist NewSpringBootRestService Rug generator
  should successfully create Spring Boot REST service projects
  according to its input parameters.


  Scenario: NewSpringBootRestService should create a new project given all valid input
    Given the archive root
    When NewSpringBootRestService is provided all parameters
    Then parameters were valid
    Then the class source file exists
    Then the class source file contains the class name
    Then the class source file contains the package name
    Then the class source file should not contain the original class name
    Then the class source file should not contain the original package name
    Then the class test file exists
    Then the class test file contains the class name
    Then the class test file contains the package name
    Then the class test file should not contain the original class name
    Then the class test file should not contain the original package name
    Then the POM file contains the artifact ID
    Then the POM file contains the version
    Then the README contains the project name
    Then the README contains the description
    Then the README contains help
    Then the README contains Spring Boot
    Then the README contains Maven link
    Then the README contains Maven instructions
    Then the README should not contain Rug information
    Then the props file should exist
    Then the props file contains the server port
    Then the CHANGELOG file should exist
    Then the CHANGELOG file should not contain releases from this project
    Then file at .gitattributes should exist
    Then file at .gitattributes should contain .atomist.yml
    Then file at .travis.yml should not exist
    Then file at CODE_OF_CONDUCT.md should not exist
    Then file at CONTRIBUTING.md should not exist
    Then file at LICENSE should not exist


  Scenario: NewSpringBootRestService without description should create a new project
    Given the archive root
    When NewSpringBootRestService is provided all parameters but description
    Then parameters were valid
    Then the class source file exists
    Then the class test file exists
    Then the POM file contains the artifact ID
    Then the POM file contains the version
    Then the README contains the project name
    Then the props file should exist
    Then the props file contains the server port
    Then the CHANGELOG file should exist
    Then the CHANGELOG file should not contain releases from this project
    Then file at .gitattributes should exist
    Then file at .gitattributes should contain .atomist.yml
    Then file at .travis.yml should not exist
    Then file at CODE_OF_CONDUCT.md should not exist
    Then file at CONTRIBUTING.md should not exist
    Then file at LICENSE should not exist


  Scenario: NewSpringBootRestService should fail when given an invalid parameter
    Given the archive root
    When NewSpringBootRestService for NewSpringBootRestService should fail when given an invalid parameter
    Then parameters were invalid
