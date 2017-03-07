import { Project } from "@atomist/rug/model/Core"
import { ProjectGenerator } from "@atomist/rug/operations/ProjectGenerator"
import { Given, When, Then, Result, ProjectScenarioWorld } from "@atomist/rug/test/Core"

import { NewSpringBootRestService } from "../editors/NewSpringBootRestService"

When("run Spring Rest generator", (p, world) => {
  let psworld = world as ProjectScenarioWorld
  let generator = psworld.generator("NewSpringBootRestService")
  psworld.generateWith(generator, {})
})

Then("we have a POM", p => p.fileExists("pom.xml"))
Then("we don't have a CODE_OF_CONDUCT", p => !p.fileExists("CODE_OF_CONDUCT.md"))
