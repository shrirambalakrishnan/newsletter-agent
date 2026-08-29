import { LlmAgent } from "@google/adk";
import {z} from "zod"

export const conceptExtractionOutputSchema = z.object({
  concepts: z.array(
    z.object({
      label: z
        .string()
        .describe("Short human-readable name for the concept"),
      evidence: z
        .string()
        .describe("Exact sentence or passage from the newsletter that this concept is drawn from")
    }),    
  )
})

export const conceptExtractionAgent = new LlmAgent({
  name: "concept_extraction_agent",
  model: "gemini-3.6-flash",
  description: "Extracts candidate concepts discussed in newsleteer content",
  instruction: [
    "Read the newsletter content the user provides",
    "Idenitfy the distinct concepts it teaches or discusses",
    "For each concept, include the exact sentence or passage from the newsletter that grounds it as evidence",
    "Do not decide whether a concept is new or already known elsewhere. That happens in a separate step"
  ].join("\n"),
  outputSchema: conceptExtractionOutputSchema,
  tools: [],
})