import { marked } from "marked";
import { Newsletter } from "./db/models/newsletter";
import { Question } from "./db/models/question";
import { Quiz } from "./db/models/quiz";

const PAGE_STYLES = `
  body { font: 16px/1.5 system-ui, sans-serif; max-width: 44rem, margin: 2rem auto;padding: 0 1rem;color: #1a1a1a}
  .question { margin: 2rem 0; padding-bottom:1.5rem; border-bottom: 1px solid #333333 }
  .question-text { font-weight: 600; margin-bottom: 0.75rem }
  .option { display: block; cursor: pointer; margin: 0.4rem 0;}
  .option input { margin-right: 0.5rem}
  .difficulty {font-weight: 0.8rem; color: #767676; font-weight: 400; margin-left:0.5rem}
  button { font-size: 1rem;padding: 0.6rem 1.2rem; cursor:pointer;}
  textarea {width: 100%; box-sizing: border-box;font: inherit; padding: 0.75rem; border: 1px solid #767676; border-radius: 4px; resize: vertical}
  .hint { color: #767676; font-size: 0.9rem}
`

function renderSummary(summary: string): string {
  if(!summary?.trim()) {
    return `<p class="empty">No summary available</p>`
  } else {
    return `<div class="summary-body">${marked.parse(summary)}</div>`
  }
}

function renderOption(question: Question, optionText: string, index: number): string {

  const inputName = `q_${question.id}`
  const inputId = `q_${question.id}_${index}`
  
  return `
    <label class="option" for="${inputId}">
      <input type="radio" id="${inputId}" name="${inputName}" value="${index}" required>
      ${optionText}
    </label>
  `
}

function renderQuestion(question: Question, position: number): string {

  const options = question
    .options
    .map((optionText, index) => renderOption(question, optionText, index))
    .join("")
  
    return `
      <div class="question">
        <div class="question-text">
          ${position}. ${question.questionText}
          <span class="difficulty">${question.difficulty}</span>
        </div>

        ${options}
      </div>
    `
}

export function renderQuizPage(newsletter: Newsletter, quiz: Quiz, questions: Question[]): string {

  const action = `/quiz/${quiz.id}/submit`
  const body = questions
    .map((question, index) => renderQuestion(question, index+1))
    .join("")
  
  return `
    <!doctype html>
    <html>
      <head>
        <title>Newsletter Quiz</title>
        <style>${PAGE_STYLES}</style>
      </head>
      <body>
        <h1>Summary of Newsletter</h1>
        <section id="summary">
          ${renderSummary(newsletter.summary)}
        </section>

        <h1>Take the quiz to check your understanding</h1>
        <form method="post" action="${action}">
          ${body}
          <button type="submit">Submit Answers!</button>
        </form>
      </body>
    </html>
  `
  
}

export function renderHomePage(): string {

  return `
    <!doctype html>
    <html>
      <head>
        <title>Newsletter Agent</title>
        <style>${PAGE_STYLES}</style>
      </head>
      <body>
        <h1>Newsletter Agent</h1>
        <h2>Paste a Newsletter</h2>
        <p class="hint">Plain text only. You will get summary and a short quiz</p>

        <form id="newsletter-form" method="post" action"/newsletter">
          <textarea
            name="newsletterContent"
            rows="12"
            required
            autofocus
            placeholder="Paste newsletter content here...">
          </textarea>
          <p>
            <button type="submit">Summarize and Quiz me</button>
          </p>
        </form>

        <div id="working" hidden>
          <p>Reading your newsletter...</p>
          <p class="hint">This takes about a minute. Keep this tab open.</p>
        </div>

        <script>
          const form = document.getElementById("newsletter-form")
          form.addEventListener("submit", () => {
            form.hidden = true
            document.getElementById("working").hidden = false
          })
        </script>
      </body>
    </html>
  `
  
}