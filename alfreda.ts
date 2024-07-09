import { AzureChatOpenAI } from "@langchain/openai"
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts"
import { AgentExecutor, createToolCallingAgent } from "langchain/agents"
import { pull } from "langchain/hub"
import express from "express"
import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory"
import { AIMessage, HumanMessage } from "@langchain/core/messages"
import { naherholungsTool } from "./tools/naherholungsgebiet"
import { convertToAlfredFormat } from "./utils/alfredaAdapter"
import { BufferWindowMemory } from "langchain/memory"
import { weatherTool } from "./tools/weather"
import { todayAsString } from "./utils/time"

const MEMORY_KEY = "chat_history"
async function getMemoryPrompt() {
  return ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are very powerful assistant and your name is Alfreda. Today is ${todayAsString()}`,
    ],
    new MessagesPlaceholder(MEMORY_KEY),
    ["user", "{input}"],
    new MessagesPlaceholder("agent_scratchpad"),
  ])
}

const main = async () => {
  const app = express()
  const messageHistory = new ChatMessageHistory()

  app.get("/", async (req, res) => {
    const chain = await initializeAgent()
    const task = req.query.question
    const buffer = new BufferWindowMemory({
      k: 10,
      chatHistory: messageHistory,
      returnMessages: true,
    })
    const currenHistory = await buffer.loadMemoryVariables({ input: "" })
    const response = await chain.invoke({
      input: task,
      chat_history: currenHistory.history,
    })
    await messageHistory.addMessage(new HumanMessage(task.toString()))
    await messageHistory.addMessage(new AIMessage(response.output))
    res.send(convertToAlfredFormat(response))
  })

  app.listen(4444, () => {
    console.log("Server running on port 4444")
  })
}
main()

async function initializeAgent() {
  const llm = new AzureChatOpenAI()
  const prompt = await pull<ChatPromptTemplate>(
    "hwchase17/openai-functions-agent",
  )
  const memoryPrompt = await getMemoryPrompt()
  const tools = [naherholungsTool, weatherTool]
  const agent = createToolCallingAgent({
    llm,
    prompt: memoryPrompt,
    tools,
  })

  return new AgentExecutor({
    agent,
    tools,
  })
}
