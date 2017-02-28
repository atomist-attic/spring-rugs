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
import { PathExpression, PathExpressionEngine } from '@atomist/rug/tree/PathExpression'
import { File } from '@atomist/rug/model/File'

@Generator("NewSpringBootRestService", "create a new Spring Boot Rest Service project")
@Tags("documentation", "java", "spring", "spring-boot", "spring-rest") 
class NewSpringBootRestService implements PopulateProject {

    // this is only necessary to avoid https://github.com/atomist/rug-resolver/issues/17
    @Parameter({
        displayName: "Project Name",
        description: "name of project to be created",
        pattern: Pattern.project_name,
        validInput: "a valid GitHub project name consisting of alphanumeric, ., -, and _ characters",
        minLength: 1,
        maxLength: 100
    })
    project_name: string;

    @Parameter({
        displayName: "Maven Artifact ID",
        description: "Maven artifact identifier, i.e., the name of the jar without the version, it is often the same as the project name",
        pattern: "^[a-z][-a-z0-9_]*$", // Ideally this should be looking up artifact_id as a common pattern
        validInput: "a valid Maven artifact ID, which starts with a lower-case letter and contains only alphanumeric, -, and _ characters",
        minLength: 1,
        maxLength: 21,
        required: false
    })
    artifact_id: string = "myartifact";

    @Parameter({
        displayName: "Group ID",
        description: "Maven group identifier, often used to provide a namespace for your project, e.g., com.pany.team",
        pattern: "^[a-z][-a-z0-9_]*$", // Ideally this should be looking up artifact_id as a common pattern
        validInput: "a valid Maven group ID, which starts with a letter, -, or _ and contains only alphanumeric, -, and _ characters and may having leading period separated identifiers starting with letters or underscores and containing only alphanumeric and _ characters.",
        minLength: 1,
        maxLength: 21,
        required: false
    })
    group_id: string = "mygroup";

    @Parameter({
        displayName: "Version",
        description: "initial version of the project, e.g., 1.2.3-SNAPSHOT",
        pattern: Pattern.semantic_version,
        validInput: "a valid semantic version, http://semver.org",
        minLength: 1,
        maxLength: 21,
        required: false
    })
    version: string = "0.1.0-SNAPSHOT";

    @Parameter({
        displayName: "Project Description",
        description: "short descriptive text describing the new project",
        pattern: Pattern.any,
        validInput: "free text",
        minLength: 1,
        maxLength: 50,
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
    root_package: string = "com.myorg";

    @Parameter({
        displayName: "Class Name",
        description: "name for the service class",
        pattern: Pattern.java_class,
        validInput: "a valid Java class name, which contains only alphanumeric characters, $ and _ and does not start with a number",
        minLength: 1,
        maxLength: 50,
        required: false
    })
    service_class_name: string = "com.myorg";

    populate(project: Project) {

        this.switchREADME(project);

        this.pomParameterizer(project);

        this.packageMove(project, this.root_package);

        this.renameServiceClass(project, this.service_class_name)

        this.addCreationDateToReadme(project)

        this.tidyProject(project);
    }

    switchREADME(project) {
        project.merge("readme.vm", "README.md", {"project_name": this.project_name, "description": this.description});
    }

    pomParameterizer(project) {
        project.editWith("atomist-rugs.common-editors.PomParameterizer", {
            "artifact_id": this.artifact_id, 
            "group_id": this.group_id,
            "version": this.version,
            "name": this.project_name,
            "description": this.description
        });
    }

    packageMove(project, new_package) {
        let old_package = "com.atomist.springrest"

        project.editWith("atomist-rugs.common-editors.PackageMove", {
            "old_package": old_package, 
            "new_package": new_package
        });
    }

    renameServiceClass(project, new_class_name) {
        let old_class_name = "SpringRest"

        project.editWith("atomist-rugs.common-editors.ClassRenamer", {
            "old_class": old_class_name, 
            "new_class": new_class_name
        });
    }

    addCreationDateToReadme(project) {
        let eng: PathExpressionEngine = project.context().pathExpressionEngine();

        let readmePathExpression = new PathExpression<Project, File>(
            "/*[@name='README.md']");

        let readmeFile: File = eng.scalar(project, readmePathExpression);

        readmeFile.replace("{{creation_date}}", new Date().toISOString().split('T')[0]);
    }

    tidyProject(project) {
        project.editWith("atomist-rugs.common-editors.RemoveChangeLog", {});
        project.editWith("atomist-rugs.common-editors.RemoveApacheSoftwareLicense20",{})
        project.editWith("atomist-rugs.common-editors.RemoveCodeOfConduct",{})
    }
}

export const newSpringBootRestService = new NewSpringBootRestService();
