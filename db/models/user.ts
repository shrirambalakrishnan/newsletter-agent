import { db } from "../firestore"

export interface User {
  id: string
  name: string
}

export const SEED_USER: User  = {
  id: "1",
  name: "Curious Reader",
}

export async function getUser(id: string): Promise<User | null> {
  const user = await db.collection("users").doc(id).get()

  if (user.exists) {
    return user.data() as User
  } else {
    return null
  }
}

export async function createUser(user: User): Promise<void> {
  await db.collection("users").doc(user.id).set(user)
}

export async function setDefaultUser() : Promise<void> {
  const existing = await getUser(SEED_USER.id)

  if (!existing) {
    await createUser(SEED_USER)
  }
}
