import express from "express"

const app = express()
app.listen(9000, () => {
  console.log("Server is running on port 9000")
})

app.get('/', (req, res) => {
  res.send('Hello from Prisma')
})
