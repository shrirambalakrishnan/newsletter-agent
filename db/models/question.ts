export type Difficulty = "easy" | "medium"

export interface Question {
  id: string
  conceptId: string
  questionText: string
  options: string[]
  correctIndex: number
  difficulty: Difficulty
}