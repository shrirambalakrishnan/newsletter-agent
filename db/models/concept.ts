import { db } from "../firestore"
import { Timestamp } from "@google-cloud/firestore"

export interface Concept {
  conceptId: string
  label: string
  confidence: number
  evidenceCount: number
  lastTestedAt: Timestamp | null
}

export const NEW_CONCEPT_DEFAULTS = {
  confidence: 0.3,
  evidenceCount: 0,
  lastTestedAt: null,
}

export async function getConcept(conceptId: string): Promise<Concept | null> {
  const concept = await db.collection("concepts").doc(conceptId).get()

  if( concept.exists ) {
    return concept.data() as Concept
  } else {
    return null
  }
}

export async function createConcept(concept: Concept) : Promise<void> {
  await db.collection("concepts").doc(concept.conceptId).set(concept)
}

export async function createConcepts(concepts: Concept[]): Promise<void> {
  await Promise.all( concepts.map(concept => createConcept(concept)) )
}

export async function listConcepts(): Promise<Concept[]> {
  const conceptsSnapshot = await db.collection("concepts").get()

  return conceptsSnapshot.docs.map((doc) => doc.data() as Concept)
}