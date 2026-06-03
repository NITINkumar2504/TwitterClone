import express from 'express'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'

import { connectDB } from './db/connectMongoDB.js'


const app = express()

const PORT = process.env.PORT || 5000

app.use(express.json())  // to parse req.body
app.use(express.urlencoded({extended : true}))   // to parse form data(urlencoded)
app.use(cookieParser())  // parse cookie from incoming HTTP requests

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes) 

app.listen(PORT, () => {
    console.log(`\nServer running at http://localhost:${process.env.PORT}`)
    connectDB()
})