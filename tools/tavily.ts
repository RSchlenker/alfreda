import { DynamicStructuredTool } from "@langchain/core/tools"
import { z } from "zod"
import axios from "axios"

export const searchTool = new DynamicStructuredTool({
  name: "searchOnline",
  description:
    "Search a specific term online. Use this tool whenever the user wants to search for something online.",
  schema: z.object({
    searchTerm: z
      .string()
      .describe(
        "The search term. Should be a very precise question or term to search for. Summarize the request in one sentence.",
      ),
  }),
  func: async ({ searchTerm }) => {
    console.log(`Searching for ${searchTerm}`)
    const key = process.env.TAVILY_API_KEY
    const response = await axios.post("https://api.tavily.com/search", {
      api_key: key,
      query: searchTerm,
      search_depth: "basic",
      include_answer: true,
      include_images: false,
      include_raw_content: false,
      max_results: 5,
      include_domains: [],
      exclude_domains: [],
    })
    return `Always display the used links when you cite from this result. The search result is: ${JSON.stringify(response.data)}`
  },
} as any)
