import "dotenv/config"
import {Firestore} from "@google-cloud/firestore"

const projectId = process.env.GOOGLE_CLOUD_PROJECT
const firestoreDatabaseId = process.env.FIRESTORE_DATABASE_ID

if (!projectId) {
  throw new Error("GOOGLE_CLOUD_PROJECT is not set.")
}

export const db = new Firestore({
  projectId,
  databaseId: firestoreDatabaseId
})
