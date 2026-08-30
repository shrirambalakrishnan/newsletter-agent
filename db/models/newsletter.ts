import { Timestamp } from "@google-cloud/firestore"
import { randomUUID } from "node:crypto"
import { db } from "../firestore"

export type Newsletter = {
  id: string,
  content: string,
  summary: string,
  createdAt: Timestamp,
}

export function newNewsletterId() : string {
  return randomUUID()
}

export async function createNewsletter(n: Newsletter) : Promise<void> {
  await db.collection("newsletters").doc(n.id).set(n)
}

export async function getNewsletter(id: string): Promise<Newsletter | null> {
  const newsletter = await db.collection("newsletters").doc(id).get()
  
  if( newsletter.exists ) {
    return newsletter.data() as Newsletter
  } else {
    return null
  }
}