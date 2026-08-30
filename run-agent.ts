import { InMemoryRunner, isFinalResponse, LlmAgent, stringifyContent } from "@google/adk";
const FENCE = /^\s*```(?:markdown|md)?\n([\s\S]*?)\n?```\s*$/;

export async function runAgent<T>(agent: LlmAgent, inputText: string): Promise<T> {
  const runner = new InMemoryRunner({agent})

  for await (const event of runner.runEphemeral({
    userId: "pipeline",
    newMessage: { parts: [ { text: inputText} ] }
  })) {

    if(isFinalResponse(event)) {
      return JSON.parse(stringifyContent(event)) as T
    }
    
  }

  throw new Error(`Agent "${agent.name}" did not produce final result!`)
}

export async function runAgentText(agent: LlmAgent, inputText: string): Promise<string> {

  const runner = new InMemoryRunner({agent})

  for await (const event of runner.runEphemeral({
    userId: "pipeline",
    newMessage: { parts: [ { text: inputText} ] }
  })) {

    if(isFinalResponse(event)) {
      const text = stringifyContent(event)
      const m = text.match(FENCE)
      return (m ? m[1] : text).trim()
    }

  }

  throw new Error(`Agent "${agent.name}" did not produce final result!`)
}
