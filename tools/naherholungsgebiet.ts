import { DynamicStructuredTool } from "@langchain/core/tools"
import { z } from "zod"
import { Document } from "langchain/document"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { todayAsString } from "../utils/time"

export const naherholungsTool = new DynamicStructuredTool({
  name: "Naherholungsmenu",
  description: "Get the menu of the current week for the Naherholungsgebiet",
  schema: z.object({
    name: z.string().describe("The name of the naherholungsgebiet").optional(),
  }),
  func: getNaherholungsmenu,
} as any)

async function loadMenus(): Promise<Document[]> {
  const response = await fetch(
    "https://naherholungsgebiet-vaihingen.de/mittagskarte/Wochenkarte.pdf",
  )
  const blob = await response.blob()
  const loader = new PDFLoader(blob)
  return loader.load()
}

async function getNaherholungsmenu() {
  console.log("Requesting menu of Naherholungsgebiet")
  try {
    const docs = await loadMenus()
    const context = docs.reduce((acc, doc) => acc + doc.pageContent + "\n", "")
    return `Das Menu des Naherholungsgebiets diese Woche ist:
 ${context}
 Heute ist ${todayAsString()}`
  } catch (e) {
    console.error("Error fetching menu data ", e)
    return "Error fetching menu"
  }
}
