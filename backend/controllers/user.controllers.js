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

            // send notification to the user
            const newNotification = new Notification({
                type : "unfollow",
                from : req.user._id,
                to : userToModify._id
            })

            await newNotification.save()

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

export { getUserProfile, followUnfollowUser }