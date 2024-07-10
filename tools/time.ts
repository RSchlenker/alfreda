import { DynamicStructuredTool } from "@langchain/core/tools"
import { z } from "zod"

export const timeTool = new DynamicStructuredTool({
  name: "currentTime",
  description: "Get the current time",
  schema: z.object({}),
  func: () => new Date().toLocaleTimeString("de-DE"),
} as any)
