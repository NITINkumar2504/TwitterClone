import express from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { commentOnPost, createPost, deletePost, getAllPosts, getFollowingPosts, getLikedPosts, getUserPosts, likeUnlikePost } from '../controllers/post.controllers.js'

const router = express.Router()

router.get("/allposts", verifyJWT, getAllPosts)
router.get("/likes/:id", verifyJWT, getLikedPosts)
router.get("/following", verifyJWT, getFollowingPosts)
router.get("/user/:username", verifyJWT, getUserPosts)
router.post('/create', verifyJWT, createPost)
router.post('/like/:id', verifyJWT, likeUnlikePost)
router.post('/comment/:id', verifyJWT, commentOnPost)
router.delete('/:id', verifyJWT, deletePost)


export default router