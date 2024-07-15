import { DynamicStructuredTool } from "@langchain/core/tools"
import { z } from "zod"

export const metainfoTool = new DynamicStructuredTool({
  name: "metainfo",
  description:
    "Get more information about the user like his preferences, his current location etc.",
  schema: z.object({}),
  func: () => {
    console.log("Requesting metainfo")
    return `
    The user is in Engen, Germany.
    The user prefers to take the car.
    `
  },
} as any)
