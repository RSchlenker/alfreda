import express from "express"
import addSonjaRoute from "./sonja"
import addAlfredaRoute from "./alfreda"

const main = async () => {
  const app = express()

  addAlfredaRoute(app)
  addSonjaRoute(app)

  app.listen(4444, () => {
    console.log("Server running on port 4444")
  })
}
main()
