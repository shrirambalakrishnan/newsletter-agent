import {z} from "zod"
import { conceptExtractionAgent, conceptExtractionOutputSchema } from "../concept-extraction"
import { runAgent } from "../run-agent"
import { listConcepts } from "../db/models/concept"
import { conceptResolutionAgent, conceptResolutionOutputSchema, persistNewConcepts } from "../concept-resolution"
import { readFile } from "node:fs/promises"

async function main() {
  const filepath = process.argv[2]
  if( !filepath) {
    throw new Error("argument filpath is missing.")
  }
  
  // step 0
  const newsletterText = await readFile(filepath, "utf-8")

  // step 1
  const extraction = await runAgent<z.infer<typeof conceptExtractionOutputSchema>>(
    conceptExtractionAgent,
    newsletterText,
  )
  console.log("candidates extracted = ", extraction.concepts )

  // step 2
  const existingConcepts = await listConcepts()

  // step 3
  const resolutionInput = JSON.stringify({
    candidates: extraction.concepts,
    existingConcepts: existingConcepts.map( c => ( { conceptId: c.conceptId, label: c.label} ))
  })

  const resolution = await runAgent<z.infer<typeof conceptResolutionOutputSchema>>(
    conceptResolutionAgent,
    resolutionInput,
  )
  console.log("resolved concepts = ", resolution.resolvedConcepts)

  // step 4
  await persistNewConcepts(resolution.resolvedConcepts)
  console.log("done")
}

main().catch(err => {
  console.error("Error - ", err)
  process.exit(1)
})