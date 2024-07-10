const main = async () => {
  const task = process.argv[2]
  const isFirstRun = process.argv[3] === "true"
  const response = await fetch(
    `http://localhost:4444?question=${task}&isFirstRun=${isFirstRun}`,
  )
  const responseText = await response.text()
  console.log(responseText)
}
main()
