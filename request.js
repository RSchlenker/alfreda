const main = async () => {
  const task = encodeURIComponent(process.argv[2])
  const isFirstRun = process.argv[3] === "true"
  const targetModel = process.argv[4] || "alfreda"
  const rawMode = process.argv[5] === "true" || false
  const response = await fetch(
    `http://localhost:4444/${targetModel}?question=${task}&isFirstRun=${isFirstRun}&raw=${rawMode}`,
  )
  const responseText = await response.text()
  console.log(responseText)
}
main()
