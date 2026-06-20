import express from 'express'
import cookieParser from 'cookie-parser'
import { v2 as cloudinary } from 'cloudinary'

import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import postRoutes from './routes/post.routes.js'
import notificationRoutes from './routes/notification.routes.js'

import { connectDB } from './db/connectMongoDB.js'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure : true
})

const app = express()

const PORT = process.env.PORT || 5000

app.use(express.json({limit : "5mb"}))  // to parse req.body (limit should not be too high to prevent DOS attack)
app.use(express.urlencoded({extended : true}))   // to parse form data(urlencoded)
app.use(cookieParser())  // parse cookie from incoming HTTP requests

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/notification", notificationRoutes)

app.listen(PORT, () => {
    console.log(`\nServer running at http://localhost:${process.env.PORT}`)
    connectDB()
})