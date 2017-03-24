/*
 * Copyright © 2017 Atomist, Inc.
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

import { PopulateProject } from '@atomist/rug/operations/ProjectGenerator'
import { Project } from '@atomist/rug/model/Core'
import { Pattern } from '@atomist/rug/operations/RugOperation'
import { Generator, Parameter, Tags } from '@atomist/rug/operations/Decorators'
import { File } from '@atomist/rug/model/File'
import { cleanReadMe, cleanChangeLog, removeUnnecessaryFiles, updatePom, movePackage, renameClass } from './RugGeneratorFunctions'

/**
 * Atomist Rug generator for creating a new Spring Boot REST service
 * project.
 */
@Generator("NewSpringBootRestService", "create a new Spring Boot Rest Service project")
@Tags("java", "spring", "spring-boot", "spring-rest")
export class NewSpringBootRestService implements PopulateProject {

    @Parameter({
        displayName: "Maven Artifact ID",
        description: "Maven artifact identifier, i.e., the name of the jar without the version, it is often the same as the project name",
        pattern: "^[a-z][-a-z0-9_]*$", // Ideally this should be looking up artifactId as a common pattern
        validInput: "a valid Maven artifact ID, which starts with a lower-case letter and contains only alphanumeric, -, and _ characters",
        minLength: 1,
        maxLength: 50,
        required: false
    })
    artifactId: string = "myartifact";

    @Parameter({
        displayName: "Maven Group ID",
        description: "Maven group identifier, often used to provide a namespace for your project, e.g., com.pany.team",
        pattern: Pattern.group_id,
        validInput: "a valid Maven group ID, which starts with a letter, -, or _ and contains only alphanumeric, -, and _ characters and may having leading period separated identifiers starting with letters or underscores and containing only alphanumeric and _ characters.",
        minLength: 1,
        maxLength: 50,
        required: false
    })
    groupId: string = "mygroup";

    @Parameter({
        displayName: "Version",
        description: "initial version of the project, e.g., 1.2.3-SNAPSHOT",
        pattern: Pattern.semantic_version,
        validInput: "a valid semantic version, http://semver.org",
        minLength: 1,
        maxLength: 50,
        required: false
    })
    version: string = "0.1.0-SNAPSHOT";

    @Parameter({
        displayName: "Project Description",
        description: "short descriptive text describing the new project",
        pattern: Pattern.any,
        validInput: "free text",
        minLength: 1,
        maxLength: 100,
        required: false
    })
    description: string = "My new project"

    @Parameter({
        displayName: "Root Package",
        description: "root package for your generated source, often this will be namespaced under the group ID",
        pattern: Pattern.java_package,
        validInput: "a valid Java package name, which consists of period-separated identifiers which have only alphanumeric characters, $ and _ and do not start with a number",
        minLength: 1,
        maxLength: 50,
        required: false
    })
    rootPackage: string = "com.myorg";

    @Parameter({
        displayName: "Class Name",
        description: "name for the service class",
        pattern: Pattern.java_class,
        validInput: "a valid Java class name, which contains only alphanumeric characters, $ and _ and does not start with a number",
        minLength: 1,
        maxLength: 50,
        required: false
    })
    serviceClassName: string = "Test";

    populate(project: Project) {
        cleanReadMe(project, this.description, this.groupId);
        cleanChangeLog(project, this.groupId);
        removeUnnecessaryFiles(project);
        updatePom(project, this.artifactId, this.groupId, this.version, this.description);
        movePackage(project, "com.atomist.springrest", this.rootPackage);
        renameClass(project, "SpringRest", this.serviceClassName);
    }
}

export const newSpringBootRestService = new NewSpringBootRestService();
