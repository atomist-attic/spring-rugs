/*
 * Copyright © 2016 Atomist, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Project } from "@atomist/rug/model/Project";
import { Given, ProjectScenarioWorld, Then, When } from "@atomist/rug/test/project/Core";

const projectName = "MyService";
const artifactId = "foo";
const rootPackage = "com.foo.bar";
const version = "0.0.1";
const serviceClassName = "MyTest";
const propsFile = "src/main/resources/application.properties";
const groupId = "somegroup";
const pomPath = "pom.xml";
const readmePath = "README.md";
const description = "And now for something completely different";
const srcPath = "src/main/java/com/foo/bar/" + serviceClassName + "Application.java";
const testPath = "src/test/java/com/foo/bar/" + serviceClassName + "ApplicationTests.java";

When("NewSpringBootRestService is provided all parameters", (p, world) => {
    const psworld = world as ProjectScenarioWorld;
    const generator = psworld.generator("NewSpringBootRestService");
    psworld.generateWith(generator, projectName, {
        artifactId,
        rootPackage,
        version,
        serviceClassName,
        groupId,
        description,
    });
});

Then("the class source file exists", (p, world) => {
    return p.fileExists(srcPath);
});

Then("the class source file contains the class name", (p, world) => {
    return p.fileContains(srcPath, `public class ${serviceClassName}Application `);
});

Then("the class source file contains the package name", (p, world) => {
    return p.fileContains(srcPath, `package ${rootPackage}`);
});

Then("the class source file should not contain the original class name", (p, world) => {
    return !p.fileContains(srcPath, "SpringRestApplication");
});

Then("the class source file should not contain the original package name", (p, world) => {
    return !p.fileContains(srcPath, "com.atomist.springrest");
});

Then("the class test file exists", (p, world) => {
    return p.fileExists(testPath);
});

Then("the class test file contains the class name", (p, world) => {
    return p.fileContains(testPath, `public class ${serviceClassName}ApplicationTests `);
});

Then("the class test file contains the package name", (p, world) => {
    return p.fileContains(testPath, `package ${rootPackage}`);
});

Then("the class test file should not contain the original class name", (p, world) => {
    return !p.fileContains(testPath, "SpringRestApplicationTests");
});

Then("the class test file should not contain the original package name", (p, world) => {
    return !p.fileContains(testPath, "com.atomist.springrest");
});

Then("the class test file exists", (p, world) => {
    return p.fileExists(testPath);
});

Then("the POM file contains the artifact ID", (p, world) => {
    return p.fileContains(pomPath, artifactId);
});

Then("the POM file contains the version", (p, world) => {
    return p.fileContains(pomPath, version);
});

Then("the README contains the project name", (p, world) => {
    return p.fileContains(readmePath, projectName);
});

Then("the README contains the description", (p, world) => {
    return p.fileContains(readmePath, description);
});

Then("the README contains help", (p, world) => {
    return p.fileContains(readmePath, "Need Help?");
});

Then("the README contains Spring Boot", (p, world) => {
    return p.fileContains(readmePath, "[Spring Boot]");
});

Then("the README contains Maven link", (p, world) => {
    return p.fileContains(readmePath, "[Maven][mvn]");
});

Then("the README contains Maven instructions", (p, world) => {
    return p.fileContains(readmePath, "mvn spring-boot:run");
});

Then("the README should not contain Rug information", (p, world) => {
    return !p.fileContains(readmePath, "## Rug");
});

Then("the props file should exist", (p, world) => {
    return p.fileExists(propsFile);
});

Then("the props file contains the server port", (p, world) => {
    return p.fileContains(propsFile, "server.port=8080");
});

Then("the LICENSE file should not exist", (p, world) => {
    return !p.fileExists("LICENSE");
});

Then("the CHANGELOG file should exist", (p, world) => {
    return p.fileExists("CHANGELOG.md");
});

Then("the CHANGELOG file should not contain releases from this project", (p, world) => {
    return !p.fileContains("CHANGELOG.md", "0.3.0");
});

Then("the code of conduct file should not exist", (p, world) => {
    return !p.fileExists("CODE_OF_CONDUCT.md");
});

Then("the Travis CI configuration should not exist", (p, world) => {
    return !p.fileExists(".travis.yml");
});

When("NewSpringBootRestService is provided all parameters but description", (p, world) => {
    const psworld = world as ProjectScenarioWorld;
    const generator = psworld.generator("NewSpringBootRestService");
    psworld.generateWith(generator, projectName, {
        artifactId,
        rootPackage,
        version,
        serviceClassName,
        groupId,
    });
});

When("NewSpringBootRestService for NewSpringBootRestService should fail when given an invalid parameter",
    (p, world) => {
        const psworld = world as ProjectScenarioWorld;
        const generator = psworld.generator("NewSpringBootRestService");
        const badVersion = "not.valid.version";
        psworld.generateWith(generator, projectName, {
            artifactId,
            rootPackage,
            version: badVersion,
            serviceClassName,
            groupId,
            description,
        });
    });
