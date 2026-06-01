import express from 'express'

const app = express()

const PORT = process.env.PORT

app.get('/', (req, res) => {
    res.send("Server is ready")
})

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
})