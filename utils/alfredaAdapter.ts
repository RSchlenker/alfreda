import { ChainValues } from "@langchain/core/dist/utils/types"
import { AIMessage, BaseMessage } from "@langchain/core/messages"

export function convertAllToAlfredFormat(messages: BaseMessage[]): object {
  const response = messages
    .map((message) => {
      if (message instanceof AIMessage) {
        return "**Alfreda:**\n" + message.content
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

export function convertToAlfredFormat(textResponse: ChainValues) {
  let chat = `> ${textResponse.input}
  **Alfreda:**
  ${textResponse.output}`
  return JSON.stringify({
    response: chat,
    footer: "alfreda",
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
