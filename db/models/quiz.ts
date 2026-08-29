import { Timestamp } from "@google-cloud/firestore"

export interface Quiz {
  id: string
  newsletterContent: string
  newsletterContentHash: string
  questionIds: string[]
  createdAt: Timestamp
  userId: string
}