import { DynamicStructuredTool } from "@langchain/core/tools"
import { z } from "zod"

export const travelTime = new DynamicStructuredTool({
  name: "travelTime",
  description: "Find out how long the travel time is between two locations",
  schema: z.object({
    startPoint: z
      .string()
      .describe("The starting location of the route, e.g. city name"),
    endPoint: z
      .string()
      .describe("The end location of the route, e.g. city name"),
  }),
  func: getRoute,
} as any)

async function getRoute({ startPoint, endPoint }): Promise<String> {
  console.log(`Requesting route information from ${startPoint} to ${endPoint}`)
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  const mapsResponse = await fetch(
    `https://maps.googleapis.com/maps/api/directions/json?origin=${startPoint}&destination=${endPoint}&key=${apiKey}`,
  )
  const mapsData = await mapsResponse.json()
  return JSON.stringify(extractRelevantRouteInformation(mapsData), null, 2)
}

function extractRelevantRouteInformation(routingResponse) {
  return {
    duration: routingResponse.routes[0].legs[0].duration.text,
    distance: routingResponse.routes[0].legs[0].distance.text,
    startAddress: routingResponse.routes[0].legs[0].start_address,
    endAddress: routingResponse.routes[0].legs[0].end_address,
  }
}

export const currentLocation = new DynamicStructuredTool({
  name: "currentLocation",
  description:
    "Get the current location of the user. Before asking the user try to use this tool!",
  schema: z.object({}),
  func: () => "The user is in Engen, Germany",
} as any)
