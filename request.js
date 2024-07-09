const main = async () => {
  const task = process.argv[2]
  const response = await fetch(`http://localhost:4444?question=${task}`)
  const responseText = await response.text()
  console.log(responseText)
}
main()
