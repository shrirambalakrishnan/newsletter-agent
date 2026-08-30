import { randomUUID } from "node:crypto"
import { db } from "../firestore"

export type Difficulty = "easy" | "medium"

export interface Question {
  id: string
  conceptId: string
  questionText: string
  options: string[]
  correctIndex: number
  difficulty: Difficulty
}

export function newQuestionId(conceptId: string): string {
  return `${conceptId}-${randomUUID().slice(0,8)}`
}

export async function getQuestion(id: string): Promise<Question | null> {
  const question = await db.collection("questions").doc(id).get()

  if (question.exists) {
    return question.data() as Question
  } else {
    return null
  }
}

export async function createQuestion(question: Question): Promise<void> {
  await db.collection("questions").doc(question.id).set(question)
}

export async function createQuestions(questions: Question[]): Promise<void> {
  await Promise.all( 
    questions.map(question => createQuestion(question))
  )
}

export async function getQuestions(ids: string[]): Promise<Question[]> {

  if ( ids.length == 0 ) {
    return []
  }

  const refs = ids.map(id => db.collection("questions").doc(id))
  const snapshots = await db.getAll(...refs)

  return snapshots
  .filter(snapshot => snapshot.exists)
  .map(snapshot => snapshot.data() as Question)
}