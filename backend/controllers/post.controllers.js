import { v2 as cloudinary } from "cloudinary"

import Post from "../models/post.models.js"
import User from "../models/user.models.js"

const createPost = async (req, res) => {
    try {
        const { text } = req.body
        let { image } = req.body
        const userId = req.user._id

        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({ error : "User not found "})
        }

        if(!image && !text){
            return res.status(400).json({ error : "Post must have either text or an image" })
        }

        if(image){
            const uploadedResponse = await cloudinary.uploader.upload(image)
            image = uploadedResponse.secure_url
        }

        const newPost = new Post({
            user : userId,
            text,
            image
        })

        await newPost.save()

        return res.status(201).json(newPost)

    } 
    catch (error) {
        console.log("Error in createPost controller:", error.message)
        return res.status(500).json({error : "Internal Server Error"})
    }   
}

export { createPost }

