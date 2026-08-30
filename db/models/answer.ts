import { Timestamp } from "@google-cloud/firestore"
import { Question } from "./question"
import { AnswerRecord } from "./Attempt"

export interface SubmittedAnswer {
  questionId: string
  selectedIndex: number | null
}

export function parseAnswers(
  questions: Question[],
  formBody: Record<string, unknown>
) : AnswerRecord[] {

  return questions.map(question => {

    const optionSelectedRaw = formBody[`q_${question.id}`]
    const optionSelected = typeof optionSelectedRaw == "string" ? Number.parseInt(optionSelectedRaw, 10) : NaN
    
    const valid = Number.isInteger(optionSelected) && optionSelected >=0 && optionSelected < question.options.length

    return {
      questionId: question.id,
      conceptId: question.conceptId,
      selectedIndex: valid ? optionSelected : null
    }
  })
  
}