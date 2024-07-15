import { DynamicStructuredTool } from "@langchain/core/tools"
import { z } from "zod"
import { exec } from "child_process"
import * as util from "node:util"

const execPromisified = util.promisify(exec)

export const clockerTool = new DynamicStructuredTool({
  name: "WorkingTime",
  description:
    "Get the worked hours for the given time frame. Use this tool to check how much time the user worked.",
  schema: z.object({
    timeFrame: z
      .enum(["today", "week", "month"])
      .default("today")
      .describe(
        "The time frame to get the worked hours for. The week shows the current week, not the last 7 days. The month shows the current month.",
      ),
  }),
  func: getTimes,
} as any)

async function getTimes({ timeFrame }): Promise<String> {
  console.log(`Requesting worked hours for ${timeFrame}`)
  let command = "clocker report"
  if (timeFrame === "week") {
    command += " --week"
  } else if (timeFrame === "month") {
    command += " --month"
  }
  const result = await execPromisified(command)
  return result.stdout
}
