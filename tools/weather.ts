import { DynamicStructuredTool } from "@langchain/core/tools"
import { z } from "zod"

export const weatherTool = new DynamicStructuredTool({
  name: "weather",
  description:
    "Get the weather forecast for a location for the next 3 days. Cannot be used for more than 3 days.",
  schema: z.object({
    location: z
      .string()
      .describe("The location for which the weather should be fetched"),
    country: z
      .string()
      .describe(
        "The country of the location in English. If not provided, the default is Germany",
      )
      .default("Germany"),
    days: z
      .number()
      .describe(
        "The number of days for which the weather should be fetched. Maximum is 3",
      )
      .default(1),
  }),
  func: async ({ location, country, days }) => {
    console.log(
      `Requesting weather for ${location},${country} for the next ${days} day(s)`,
    )
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?q=${location},${country}&days=${days}&key=${process.env.WEATHER_API_KEY}`,
      )
      const body = JSON.parse(await response.text())
      return JSON.stringify(reduceToUsefulWeatherData(body))
    } catch (e) {
      console.error("Error fetching weather data ", e)
      return "Error fetching weather data"
    }
  },
} as any)

function reduceToUsefulWeatherData(weatherApiResponse) {
  return {
    location: weatherApiResponse.location,
    current: weatherApiResponse.current,
    forecast: weatherApiResponse.forecast.forecastday.map((day) => ({
      date: day.date,
      maxTemp: day.day.maxtemp_c,
      minTemp: day.day.mintemp_c,
      avgTemp: day.day.avgtemp_c,
      condition: day.day.condition.text,
      sunrise: day.astro.sunrise,
      sunset: day.astro.sunset,
      moonPhase: day.astro.moon_phase,
      hours: day.hour.map((hour) => ({
        time: hour.time,
        temp: hour.temp_c,
        condition: hour.condition.text,
        windSpeed: hour.wind_kph,
        windDirection: hour.wind_dir,
        humidity: hour.humidity,
        feelsLike: hour.feelslike_c,
      })),
    })),
  }
}
