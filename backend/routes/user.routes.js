import express from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { followUnfollowUser, getUserProfile } from '../controllers/user.controllers.js'

const router = express.Router()

router.get("/profile/:username", verifyJWT, getUserProfile)
// router.get("/suggested", verifyJWT, getUserProfile)
router.post("/follow/:id", verifyJWT, followUnfollowUser)
// router.post("/update", verifyJWT, updateUserProfile)


export default router