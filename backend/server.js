import express from 'express'
import authRoutes from './routes/auth.routes.js'
import { connectDB } from './db/connectMongoDB.js'

const app = express()

const PORT = process.env.PORT || 5000

app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    console.log(`\nServer running at http://localhost:${process.env.PORT}`)
    connectDB()
})