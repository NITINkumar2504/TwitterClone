import express from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { createPost } from '../controllers/post.controllers.js'

const router = express.Router()

router.post('/create', verifyJWT, createPost)
// router.post('/like/:id', verifyJWT, likeUnlikePost)
// router.post('/comment/:id', verifyJWT, commentOnPost)
// router.delete('/', verifyJWT, deletePost)


export default router