import {z} from "zod"
import { conceptExtractionAgent, conceptExtractionOutputSchema } from "./concept-extraction"
import { runAgent } from "./run-agent"
import { listConcepts } from "./db/models/concept"
import { conceptResolutionAgent, conceptResolutionOutputSchema, persistNewConcepts, ResolvedConcept } from "./concept-resolution"
import { createQuiz, hashNewsletterContent, Quiz } from "./db/models/quiz"
import { questionGenerationAgent, questionGenerationOutputSchema, toQuestions } from "./question-generation"
import { createQuestions, Question } from "./db/models/question"
import { setDefaultAutoSelectFamily } from "node:net"
import { SEED_USER, setDefaultUser } from "./db/models/user"

type ConceptResolutionOutputSchemaType = z.infer<typeof conceptResolutionOutputSchema>

export interface IngestResult {
  concepts: ResolvedConcept[]
  questions: Question[]
  quiz: Quiz
}

export async function ingestNewsletter(newsletterText: string): Promise<IngestResult> {
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

  // step 5
  const questionGenerationInput = JSON.stringify({
    newsletterContent: newsletterText,
    concepts: resolution
      .resolvedConcepts
      .map( c => {
        return { conceptId: c.conceptId, label: c.label, evidence: c.evidence }
      })
  })

  const questionGeneration = await runAgent<z.infer<typeof questionGenerationOutputSchema>>(
    questionGenerationAgent,
    questionGenerationInput,
  )
  console.log("questionGeneration count = ", questionGeneration.questions.length)

  // step 6
  const questions = toQuestions(
    questionGeneration.questions,
    resolution.resolvedConcepts.map( c => c.conceptId )
  )

  // step 7
  await createQuestions(questions)

  // step 8
  await setDefaultUser()

  const quiz = await createQuiz({
    newsletterContent: newsletterText,
    questionIds: questions.map(q => q.id),
    userId: SEED_USER.id,
  })
  console.log("quiz created = ", quiz.id)

  return { concepts: resolution.resolvedConcepts, questions, quiz}
}