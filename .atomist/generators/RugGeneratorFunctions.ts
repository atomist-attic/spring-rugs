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

import { Project } from '@atomist/rug/model/Core';
import { File } from '@atomist/rug/model/File';
import { PathExpressionEngine } from '@atomist/rug/tree/PathExpression';
import { Pom } from '@atomist/rug/model/Pom';
import { JavaSource } from '@atomist/rug/model/JavaSource';
import { JavaType } from '@atomist/rug/model/JavaType';

/**
 * Remove content from README specific to this project.
 *
 * @param project      Project whose README should be cleaned.
 * @param description  Brief description of newly created project.
 * @param owner        GitHub owner of newly created project.
 */
export function cleanReadMe(project: Project, description: string, owner: string): void {
    let readMe: File = project.findFile("README.md");
    readMe.replace("# Atomist 'spring-boot-rest-service'", "# " + project.name);
    readMe.regexpReplace("This .*?Rug.*? project contains a generator for a .*?Spring Boot[\\s\\S]*?\n## Spring Boot REST Service\n", `This project contains a [Spring Boot][boot] [REST][rest] service for ${description}.`);
    readMe.replace("spring-boot-rest-service", project.name);
    readMe.replace("atomist-rugs", owner);
}

/**
 * Remove content from CHANGELOG specific to this project.
 *
 * @param project  Project whose README should be cleaned.
 * @param owner    GitHub owner of newly created project.
 */
export function cleanChangeLog(project: Project, owner: string): void {
    let changeLog: File = project.findFile("CHANGELOG.md");
    changeLog.regexpReplace("\\d+\\.\\d+\\.\\d+\\.\\.\\.HEAD\n\n[\\S\\s]*## \\[0\\.1\\.0\\]", "0.1.0...HEAD\n\n## [0.1.0]");
    changeLog.regexpReplace("\n### Added[\\S\\s]*", "\nAdded\n\n-   Everything\n");
    changeLog.replace("spring-boot-rest-service", project.name);
    changeLog.replace("atomist-rugs", owner);
}

/**
 * Remove files specific to this project.
 *
 * @param project  Project whose README should be cleaned.
 */
export function removeUnnecessaryFiles(project: Project): void {
    let toDelete: string[] = ["LICENSE", "CODE_OF_CONDUCT.md", ".travis.yml"];
    for (let f of toDelete) {
        project.deleteFile(f);
    }
}

/**
 * Update the pom.xml with new project information.
 *
 * @param project      Project whose POM should be cleaned.
 * @param artifactId   Maven artifact identifier.
 * @param groupId      Maven group identifier.
 * @param version      Project version.
 * @param description  Brief description of newly created project.
 */
export function updatePom(project: Project, artifactId: string, groupId: string, version: string, description: string): void {
    let eng: PathExpressionEngine = project.context.pathExpressionEngine;
    eng.with<Pom>(project, "/Pom()", pom => {
        pom.setArtifactId(artifactId);
        pom.setGroupId(groupId);
        pom.setProjectName(project.name);
        pom.setVersion(version);
        pom.setDescription(description);
    });
}

/**
 * Move files from on Java package to another.
 *
 * @param project      Project whose README should be cleaned.
 * @param oldPackage   Name of package to move from.
 * @param newPackage   Name of package to move to.
 */
export function movePackage(project: Project, oldPackage: string, newPackage: string): void {
    let eng: PathExpressionEngine = project.context.pathExpressionEngine;
    eng.with<JavaSource>(project, `//JavaSource()[.pkg()='${oldPackage}']`, j => {
        j.movePackage(newPackage);
    });
}

/**
 * Rename all instances of a Java Class.  This method is somewhat
 * surgical when replacing appearances in Java code but brutal when
 * replacing appearances elsewhere, i.e., it uses `Project.replace()`.
 *
 * @param project    Project whose README should be cleaned.
 * @param oldClass   Name of class to move from.
 * @param newClass   Name of class to move to.
 */
export function renameClass(project: Project, oldClass: string, newClass: string): void {
    let eng: PathExpressionEngine = project.context.pathExpressionEngine;
    eng.with<JavaType>(project, `//JavaType()`, j => {
        if (j.name.indexOf(oldClass) >= 0) {
            j.renameByReplace(oldClass, newClass);
        }
    });
    project.replace(oldClass, newClass);
}
