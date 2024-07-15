import { AzureChatOpenAI } from "@langchain/openai"

export async function makePlan(question: string, tools: any[]) {
  const model = new AzureChatOpenAI().bindTools(tools)
  const prompt = `Based on the provided tools, create a plan on how to solve the following task: ${question}
  Only use the provided tools. Use as few tools as needed. Expect to not have any prior knowledge, especially about the current time.
  Answer as precise as possible. Answer only with the execution steps.`
  const response = await model.invoke(prompt)
  return response.content
}
