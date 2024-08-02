import { ChainValues } from "@langchain/core/dist/utils/types"
import { AIMessage, BaseMessage } from "@langchain/core/messages"

export function convertAllToAlfredFormat(
  messages: BaseMessage[],
  aiName: string = "Alfreda",
): object {
  const response = messages
    .map((message) => {
      if (message instanceof AIMessage) {
        return `**${aiName}:**` + message.content
      } else {
        return `> ${message.content}`
      }
    })
    .join("\n")
  return {
    response: response,
    footer: "alfreda",
    behaviour: {
      response: "append",
      scroll: "end",
      inputfield: "clear",
    },
    variables: {
      FIRST_RUN: "false",
    },
  }
}

export function convertToAlfredFormat(
  textResponse: ChainValues,
  aiName: string = "Alfreda",
) {
  let chat = `> ${textResponse.input}
  **${aiName}:**
  ${textResponse.output}`
  return JSON.stringify({
    response: chat,
    footer: aiName,
    behaviour: {
      response: "append",
      scroll: "end",
      inputfield: "clear",
    },
    variables: {
      FIRST_RUN: "false",
    },
  })
}
