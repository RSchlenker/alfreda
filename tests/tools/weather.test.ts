import * as fs from "node:fs"
import { reduceToUsefulWeatherData } from "../../tools/weather"

it("Should correctly format received weather data", async () => {
  const sampleResponse = fs.readFileSync(
    "./tests/tools/sampleWeatherResponse.json",
    "utf-8",
  )
  const weatherApiResponse = JSON.parse(sampleResponse)
  expect(reduceToUsefulWeatherData(weatherApiResponse)).toMatchObject({
    current: {
      cloud: 0,
    },
  })
})
