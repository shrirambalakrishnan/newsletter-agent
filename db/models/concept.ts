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
