import { readFile } from "node:fs/promises"
import { ingestNewsletter } from "../ingest"

async function main() {
  const filepath = process.argv[2]
  if( !filepath) {
    throw new Error("argument filpath is missing.")
  }
  
  // step 0
  const newsletterText = await readFile(filepath, "utf-8")

  const concepts = await ingestNewsletter(newsletterText)
  console.log(JSON.stringify(concepts))
  console.log("done")
}

main().catch(err => {
  console.error("Error - ", err)
  process.exit(1)
})