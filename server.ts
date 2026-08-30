import "dotenv/config"
import express from "express"
import { ingestNewsletter } from "./ingest"

const app = express()
app.use((req, _res, next) => {
  console.log("REQ", req.method, req.originalUrl)
  next()
})

app.use(express.json({limit: "1mb"}))
app.use(express.text({type: "text/*", limit: "1mb"}))


app.get("/healthz", (_req, res) => {
  res.json({ok: true})
})

app.post("/api/newsletter", async(req, res) => {
  let content : string
  if (typeof req.body == "string") {
    // from text file upload
    content = (req.body).trim()
  } else {
    // find json parameter
    content = (req.body?.newsletterContent ?? "").trim()
  }
  
  if(!content) {
    return res.status(400).json({"error": "newsletterContent required"})
  }

  try {
    const {concepts, questions, quiz} = await ingestNewsletter(content)
    res.json({quizId: quiz.id, concepts, questions})
  } catch (err) {
    console.error("ingest failed", err)
    res.status(500).json({error: String(err)})
  }

})

app.use((req, res) => {
  res.status(404).json({ error: "no route", method: req.method, path: req.originalUrl })
})

const PORT = Number(process.env.PORT) || 8080
app.listen(PORT, () => {console.log("listening on port 8080!")})