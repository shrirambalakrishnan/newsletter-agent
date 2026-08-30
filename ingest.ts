import {z} from "zod"
import { conceptExtractionAgent, conceptExtractionOutputSchema } from "./concept-extraction"
import { runAgent } from "./run-agent"
import { listConcepts } from "./db/models/concept"
import { conceptResolutionAgent, conceptResolutionOutputSchema, persistNewConcepts } from "./concept-resolution"

type ConceptResolutionOutputSchemaType = z.infer<typeof conceptResolutionOutputSchema>

export async function ingestNewsletter(newsletterText: string): Promise<ConceptResolutionOutputSchemaType["resolvedConcepts"]> {
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

  return resolution.resolvedConcepts
}