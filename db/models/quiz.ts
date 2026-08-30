import { Timestamp } from "@google-cloud/firestore"
import { createHash, randomUUID } from "node:crypto"
import { db } from "../firestore"

export interface Quiz {
  id: string
  newsletterContent: string
  newsletterContentHash: string
  questionIds: string[]
  createdAt: Timestamp
  userId: string
  newsletterId: string
}

export function hashNewsletterContent(newsletterContent:string): string {
  const normalised = newsletterContent.replace(/\r\n/g, "\n").trim()

  return createHash("sha256").update(normalised, "utf-8").digest("hex")
}

export async function getQuiz(id: string): Promise<Quiz|null> {
  const quiz = await db.collection("quizzes").doc(id).get()

  if(quiz.exists) {
    return quiz.data() as Quiz
  } else {
    return null
  }
}


export type NewQuiz = Pick<Quiz, "newsletterContent" | "questionIds" | "userId" | "newsletterId">
export async function createQuiz(newQuiz: NewQuiz): Promise<Quiz> {
  const quiz : Quiz = {
    id: randomUUID(),
    newsletterContent: newQuiz.newsletterContent,
    newsletterContentHash: hashNewsletterContent(newQuiz.newsletterContent),
    questionIds: newQuiz.questionIds,
    createdAt: Timestamp.now(),
    userId: newQuiz.userId,
    newsletterId: newQuiz.newsletterId
  }

  await db.collection("quizzes").doc(quiz.id).set(quiz)

  return quiz
}