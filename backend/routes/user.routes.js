import express from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { followUnfollowUser, getSuggestedUsers, getUserProfile, updateUserProfile } from '../controllers/user.controllers.js'

const router = express.Router()

router.get("/profile/:username", verifyJWT, getUserProfile)
router.get("/suggested", verifyJWT, getSuggestedUsers)
router.post("/follow/:id", verifyJWT, followUnfollowUser)
router.post("/update", verifyJWT, updateUserProfile)


export default router