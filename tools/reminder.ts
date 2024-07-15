import { DynamicStructuredTool } from "@langchain/core/tools"
import { z } from "zod"
import { exec } from "child_process"
import * as util from "node:util"

const execPromisified = util.promisify(exec)

export const reminder = new DynamicStructuredTool({
  name: "ReminderAndNotifications",
  description: "Setup reminders and notifications to the user",
  schema: z.object({
    text: z
      .string()
      .describe(
        "The text of the reminder. Should be descriptive and around 5-10 words",
      ),
    time: z.string().describe("The time in HH:MM format"),
  }),
  func: remind,
} as any)

async function remind({ text, time }): Promise<String> {
  console.log(`Setting up notification with text: ${text} and time: ${time}`)
  let command = `terminal-notifier -message ${text} -title alfreda -ignoreDND -sound 'Crystal'`
  await execPromisified(command)
  return "Reminder set"
}
