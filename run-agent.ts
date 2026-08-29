import { InMemoryRunner, isFinalResponse, LlmAgent, stringifyContent } from "@google/adk";

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