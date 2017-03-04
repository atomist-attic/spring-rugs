import {Project} from "@atomist/rug/model/Core"
import {ProjectEditor} from "@atomist/rug/operations/ProjectEditor"
import {Given,When,Then,Result} from "@atomist/rug/test/Core"

import {NewSpringBootRestService} from "../editors/NewSpringBootRestService"

// Given("a number of files", p => {
//  p.addFile("NSW", "Wran")
//  p.addFile("Victoria", "Cain")
//  p.addFile("WA", "Brian Burke and WA Inc")
// })
When("run Spring Rest generator", p => {
  let generator = new NewSpringBootRestService()
  generator.project_name = "foobar"
  generator.populate(p)
})

Then("we have a POM", p => p.fileExists("pom.xml")
