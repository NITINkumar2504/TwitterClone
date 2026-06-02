import express from 'express'
import { getUserInfo, loginUser, logoutUser, signupUser } from '../controllers/auth.controllers.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post("/signup", signupUser)
router.post("/login", loginUser)
router.post("/logout", logoutUser)

// secured routes: user must be logged in for these routes
router.get("/getUser", verifyJWT, getUserInfo)

export default router