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
import { GoogleRoutesAPI } from "@langchain/community/tools/google_routes"
import {
  convertAllToAlfredFormat,
  convertToAlfredFormat,
} from "./utils/alfredaAdapter"
import { BufferWindowMemory } from "langchain/memory"
import { weatherTool } from "./tools/weather"
import { todayAsString } from "./utils/time"
import { clockerTool } from "./tools/clocker"
import { timeTool } from "./tools/time"
import { currentLocation } from "./tools/maps"
import { metainfoTool } from "./tools/metainfo"

const MEMORY_KEY = "chat_history"
async function getMemoryPrompt() {
  return ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are very powerful assistant and your name is Alfreda.
      Work step by step. Always check if there is a tool that can help you.
      Check the description of each tool to understand what it does.
      Today is ${todayAsString()} 
      You are very friendly. 
      Try to use some emojis to make the conversation more fun. 
      Try to be precise and dont add too much information.
      You dont know the current time.
      Here is some meta info about the user:
       - The user is in Engen, Germany.
       - The user prefers to take the car.
       - The user works 8 hours a day.
      `,
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
    if (req.query.isFirstRun === "true") {
      const messages = await messageHistory.getMessages()
      const responseBody = convertAllToAlfredFormat(messages)
      res.send(JSON.stringify({ ...responseBody, rerun: 0.1 }))
    } else {
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
    }
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
  const tools = [
    naherholungsTool,
    weatherTool,
    clockerTool,
    timeTool,
    currentLocation,
    new GoogleRoutesAPI({ apiKey: process.env.GOOGLE_MAPS_API_KEY }),
    metainfoTool,
  ]
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
