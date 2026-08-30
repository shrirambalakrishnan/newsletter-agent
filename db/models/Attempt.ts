import { Timestamp } from "@google-cloud/firestore"
import { db } from "../firestore"
import { randomUUID } from "node:crypto"
import { timestampAdd } from "@google-cloud/firestore/pipelines"
import { getConcept, nextConfidence, updateConceptKnowledge } from "./concept"

export interface AnswerRecord {
  questionId: string
  conceptId: string
  selectedIndex: number | null
  isCorrect: boolean | null
}

export interface Attempt {
  id: string
  quizId: string
  userId: string
  answers: AnswerRecord[]
  createdAt: Timestamp
}

export async function getAttempt(id: string): Promise<Attempt | null> {

  const attempt = await db.collection("attempts").doc(id).get()

  if(attempt.exists) {
    return attempt.data() as Attempt
  } else {
    return null
  }
  
}

export type NewAttempt = Pick<Attempt, "quizId" | "userId" | "answers" >

export async function createAttempt(newAttempt: NewAttempt): Promise<Attempt> {
  const attempt : Attempt = {
    id: randomUUID(),
    quizId: newAttempt.quizId,
    userId: newAttempt.userId,
    answers: newAttempt.answers,
    createdAt: Timestamp.now()
  }

  await db.collection("attempts").doc(attempt.id).set(attempt)

  return attempt
}

export async function applyAnswers(answers: AnswerRecord[]): Promise<void> {
  for(const answer of answers) {

    if(answer.isCorrect === null) {
      continue
    }

    const concept = await getConcept(answer.conceptId)
    if(!concept) {
      console.warn("concept not found for answer. skipping update")
      continue
    }

    const confidenceNewValue = nextConfidence(concept.confidence, answer.isCorrect)
    console.log(
      `conceptId - ${answer.conceptId} | current value = ${concept.confidence} | new value = ${confidenceNewValue}`
    )

    await updateConceptKnowledge(
      answer.conceptId,
      confidenceNewValue,
      concept.evidenceCount + 1
    )
    
  }
}