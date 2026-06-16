import bcrypt from "bcryptjs"
import {v2 as cloudinary} from 'cloudinary'

import mongoose from "mongoose"
import Notification from "../models/notification.models.js"
import User from "../models/user.models.js"

const getUserProfile = async (req, res) => {
    const { username } = req.params

    try {
        const user = await User.findOne({username}).select("-password")  

        if(!user){
            return res.status(404).json({error : "User not found"})
        }
        
        return res.status(200).json(user)
    } 
    catch (error) {
        console.log("Error in getUserProfile controller:", error.message)
        return res.status(500).json({error : "Internal Server Error"})
    }
}

const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid user id" })
        }

        const userToModify = await User.findById(id)
        const currentUser = await User.findById(req.user._id)

        if(id == req.user._id){
            return res.status(400).json({error : "You cannot follow/unfollow yourself"})
        }

        if(!userToModify || !currentUser){
            return res.status(400).json({error : "User not found"})
        }
        
        const isFollowing = currentUser.following.includes(id)

        if(isFollowing){

            // Unfollow the user
            await User.findByIdAndUpdate(
                id,
                { $pull : {followers : req.user._id} },
                { returnDocument : "after" }
            )

            await User.findByIdAndUpdate(
                req.user._id,
                { $pull : {following : id} },
                { returnDocument : "after" }
            )

            // send notification to the user (no need to notify in case of unfollow)
            // const newNotification = new Notification({
            //     type : "unfollow",
            //     from : req.user._id,
            //     to : userToModify._id
            // })

            // await newNotification.save()

            return res.status(200).json({ message : "User unfollowed successfully" })
        }
        else{

            // Follow the user
            await User.findByIdAndUpdate(
                id,
                { $push : {followers : req.user._id} },
                { returnDocument : "after" }
            )

            await User.findByIdAndUpdate(
                req.user._id,
                { $push : {following : id} },
                { returnDocument : "after" }
            )

            // send notification to the user
            const newNotification = new Notification({
                type : "follow",
                from : req.user._id,
                to : userToModify._id
            })

            await newNotification.save()   
            // If you omit .save()
            // The object exists only in memory.
            // It will not be written to MongoDB.
            // No document is created in the database.

            // When you don’t need .save()
            // If you use an update/query method directly, such as:
            // Notification.create(...)
            // User.findByIdAndUpdate(...)
            // User.updateOne(...)
            // then the database write happens without calling .save() on an instance.

            return res.status(200).json({ message : "User followed successfully" })
        }
    } 
    catch (error) {
        console.log("Error in followUnfollowUser controller:", error.message)
        return res.status(500).json({error : "Internal Server Error"})
    }
}

const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id
        const usersFollowedByMe = await User.findById(userId).select("following")

        const users = await User.aggregate([
            {
                $match : {
                    _id : {
                        $ne : userId
                    }
                }
            },
            {
                $sample : {
                    size : 10
                }
            }
        ])

        const filteredUsers = users.filter(user => !usersFollowedByMe.following.includes(user._id))
        const suggestedUsers = filteredUsers.slice(0, 4)

        suggestedUsers.forEach(user => user.password = null)

        res.status(200).json(suggestedUsers)
    } 
    catch (error) {
        console.log("Error in getSuggestedUsers controller:", error.message)
        return res.status(500).json({error : "Internal Server Error"})
    }
}

const updateUserProfile = async (req, res) => {
    const { fullname, email, username, currentPassword, newPassword, bio, link } = req.body
    let { profileImg, coverImg } = req.body

    const userId = req.user._id

    try {
        const user = await User.findById(userId)

        if(!user){
            return res.status(404).json({error : "User not found"})
        }

        if(username){
            const existingUser = await User.findOne({ username })
            if(existingUser){
                return res.status(400).json({ error : "username is already taken "})
            }
        }

        if(email){
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            if(!emailRegex.test(email)){
                return res.status(400).json({error : "Invalid email format"})
            }

            const existingEmail = await User.findOne({ email })
            if(existingEmail){
                return res.status(400).json({ error : "email is already taken"})
            }
        }

        if((!newPassword && currentPassword) || (!currentPassword && newPassword)){
            return res.status(400).json({ error : "Please provide both current and old password" })
        }
        
        if(newPassword && currentPassword){
            const isMatch = await bcrypt.compare(currentPassword, user.password)

            if(!isMatch){
                return res.status(400).json({ error : "Current password is incorrect" })
            }

            if(newPassword.length < 6){
                return res.status(400).json({ error : "Password is too short, must be atleast 6 characters long" })
            }

            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(newPassword, salt)
        }

        if(profileImg){
            if(user.profileImg){    // eg: https://res.cloudinary.com/doristmll/image/upload/v1771110391/s7nputszkgnjhumcfgwq.jpg
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0], {invalidate : true})
            }

            const uploadedResponse = await cloudinary.uploader.upload(profileImg, {resource_type : "auto"})
            // console.log(uploadedResponse)
            profileImg = uploadedResponse.secure_url
        }

        if(coverImg){
            if(user.coverImg){
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0], {invalidate : true})
            }
            
            const uploadedResponse = await cloudinary.uploader.upload(coverImg, {resource_type : "auto"})
            coverImg = uploadedResponse.secure_url
        }

        user.fullname = fullname || user.fullname
        user.email = email || user.email
        user.username = username || user.username
        user.bio = bio || user.bio
        user.link = link || user.link
        user.profileImg = profileImg || user.profileImg
        user.coverImg = coverImg || user.coverImg

        const updatedUser = await user.save()
        
        // update res only, not in DB (coz we have not used .save() after this)
        updatedUser.password = null

        return res.status(200).json(updatedUser)
    } 
    catch (error) {
        console.log("Error in updateUserProfile controller:", error.message)
        return res.status(500).json({error : "Internal Server Error"})
    }
}

export { getUserProfile, followUnfollowUser, getSuggestedUsers, updateUserProfile }