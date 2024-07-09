import { ChainValues } from "@langchain/core/dist/utils/types"

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
  })
}
