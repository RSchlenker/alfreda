import { AgentExecutor } from "langchain/agents"

export async function invokeWithLogging(agent: AgentExecutor, input: string) {
  const eventStream = agent.streamEvents(
    {
      input,
      history: "",
    },
    { version: "v1" },
  )

  for await (const event of eventStream) {
    const eventType = event.event
    if (eventType === "on_chain_start") {
      // Was assigned when creating the agent with `.withConfig({"runName": "Agent"})` above
      if (event.name === "Agent") {
        console.log("\n-----")
        console.log(
          `Starting agent: ${event.name} with input: ${JSON.stringify(
            event.data.input,
          )}`,
        )
      }
    } else if (eventType === "on_chain_end") {
      if (event.name === "Agent") {
        console.log("\n-----")
        console.log(`Finished agent: ${event.name}\n`)
        console.log(`Agent output was: ${event.data.output}`)
        console.log("\n-----")
      }
    } else if (eventType === "on_llm_stream") {
      const content = event.data?.chunk?.message?.content
      // Empty content in the context of OpenAI means
      // that the model is asking for a tool to be invoked via function call.
      // So we only print non-empty content
      if (content !== undefined && content !== "") {
        console.log(`| ${content}`)
      }
    } else if (eventType === "on_tool_start") {
      console.log("\n-----")
      console.log(
        `Starting tool: ${event.name} with inputs: ${event.data.input}`,
      )
    } else if (eventType === "on_tool_end") {
      console.log("\n-----")
      console.log(`Finished tool: ${event.name}\n`)
      console.log(`Tool output was: ${event.data.output}`)
      console.log("\n-----")
    }
  }
}
