import { v2 as cloudinary } from "cloudinary"
import mongoose from "mongoose"

import Post from "../models/post.models.js"
import User from "../models/user.models.js"
import Notification from "../models/notification.models.js"

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

const deletePost = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid post id" })
        }

        const post = await Post.findById(id)

        if(!post){
            return res.status(404).json({ error : "Post not found" })
        }

        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({ error : "You are not authorized to delete this post "})
        }

        if(post.image){
            const imageId = post.image.split('/').pop().split('.')[0]
            await cloudinary.uploader.destroy(imageId)
        }

        await Post.findByIdAndDelete(id)

        return res.status(200).json({ message : "Post deleted successfully "})
    } 
    catch (error) {
        console.log("Error in deletePost controller:", error.message)
        return res.status(500).json({error : "Internal Server Error"})   
    }
}

const commentOnPost = async (req, res) => {
    try {
        const {text} = req.body
        const postId = req.params.id
        const userId = req.user._id

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ error: "Invalid post id" })
        }

        if(!text){
            return res.status(400).json({ error : "Text field is required" })
        }

        const post = await Post.findById(postId)

        if(!post){
            return res.status(404).json({ error : "Post not found" })
        }

        const comment = {user : userId, text}
        post.comments.push(comment)

        await post.save()
        
        return res.status(200).json(post)
    } 
    catch (error) {
        console.log("Error in commentOnPost controller:", error.message)
        return res.status(500).json({error : "Internal Server Error"})    
    }
}

const likeUnlikePost = async (req, res) => {
    try {
        const {id : postId} = req.params
        const userId = req.user._id

        const post = await Post.findById(postId)

        if(!post){
            return res.status(404).json({ error : "Post not found" })
        }

        const isLiked = post.likes.includes(userId)

        if(isLiked){
            // unlike post
            await Post.updateOne({_id : postId}, {$pull : {likes : userId}})
            return res.status(200).json({message : "Post unliked successfully"})
        }
        else{
            post.likes.push(userId)
            post.save()

            const notification = new Notification({
                type : "like",
                from : userId,
                to : post.user
            })

            await notification.save()

            return res.status(200).json({ message : "Post liked successfully"})
        }
    } 
    catch (error) {
        console.log("Error in likeUnlikePost controller:", error.message)
        return res.status(500).json({error : "Internal Server Error"})    
    }
}

export { createPost, deletePost, commentOnPost, likeUnlikePost }

