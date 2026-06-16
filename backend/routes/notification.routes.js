import express from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { deleteNotification, deleteNotifications, getNotifications } from '../controllers/notification.controllers.js'

const router = express.Router()

router.get("/", verifyJWT, getNotifications)
router.delete("/", verifyJWT, deleteNotifications)
router.delete("/:id", verifyJWT, deleteNotification)

export default router