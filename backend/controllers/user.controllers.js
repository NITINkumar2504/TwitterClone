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

        }
        else{
            // Follow the user
        }

    } 
    catch (error) {
        console.log("Error in followUnfollowUser controller:", error.message)
        return res.status(500).json({error : "Internal Server Error"})
    }
}

export { getUserProfile, followUnfollowUser }