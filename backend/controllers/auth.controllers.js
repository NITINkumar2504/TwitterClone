import express from 'express'
import User from '../models/user.models.js'
import bcrypt from 'bcryptjs'
import { generateTokenAndSetCookie } from '../lib/utils/generateWebToken.js'

const signupUser = async (req, res) => {
    try {
        const {fullname, username, email, password} = req.body

        if(!fullname || !username || !email || !password){
            return res.status(400).json({error : "Please provide all details"})
        }

        const existingUser = await User.findOne({ username })
        if(existingUser){
            return res.status(400).json({error : "Username is already taken"})
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if(!emailRegex.test(email)){
            return res.status(400).json({error : "Invalid email format"})
        }

        const existingEmail = await User.findOne({ email })
        if(existingEmail){
            return res.status(400).json({error : "Email is already taken"})
        }

        if(password.length < 6){
            return res.status(400).json({error : "Password is too short, must be atleast 6 characters long"})
        } 

        // hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullname,
            username,
            email,
            password : hashedPassword
        })

        if(newUser){
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save()

            return res.status(201).json({
                _id : newUser._id,
                fullname : newUser.fullname,
                username : newUser.username,
                email : newUser.email,
                followers : newUser.followers,
                following : newUser.following,
                profileImg : newUser.profileImg,
                coverImg : newUser.coverImg,
            })
        }
        else{
            return res.status(400).json({
                error : "Invalid User data"
            })
        }

    } 
    catch (error) {
        console.log("Error in signup process:", error.message)
        return res.status(500).json({
            error : "Internal Server Error"
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const {username, password} = req.body

        if(!username || !password){
            return res.status(400).json({
                error : "Please provide all login details"
            })
        }

        const user = await User.findOne({username})
        if(!user){
            return res.status(400).json({
                error : "User does not exist"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")
        if(!isPasswordCorrect){
            return res.status(400).json({
                error : "Invalid Password! Try again"
            })
        }

        generateTokenAndSetCookie(user._id, res)

        return res.status(200).json({
            _id : user._id,
            fullname : user.fullname,
            username : user.username,
            email : user.email,
            followers : user.followers,
            following : user.following,
            profileImg : user.profileImg,
            coverImg : user.coverImg,
        })

    } 
    catch (error) {
        console.log("Error in login process:", error.message)
        return res.status(500).json({
            error : "Internal Server Error"
        })
    }
}

const logoutUser = async (req, res) => {
    const options = {    // for more security
            maxAge : 0,  // millisecods
            httpOnly : true,   //  prevent XSS attacks cross-site scripting attacks (not modifiable on frontend, only server can modify)
            secure : process.env.NODE_ENV !== 'development',
            sameSite : "strict"  // CSRF attacks cross-site request forgery attacks    
        }

    try {
        return res
        .status(200)
        .clearCookie("jwt", options)
        .json({message : "Logged out successfully"})
    } 
    catch (error) {
        console.log("Error in logout process:", error.message)
        return res.status(500).json({
            error : "Internal Server Error"
        })
    }
}

const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password")
        return res.status(200).json(user)
    } 
    catch (error) {
        console.log("Error in getUserInfo controller:", error.message)
        return res.status(500).json({
            error : "Internal Server Error"
        })
    }
}

export {loginUser, logoutUser, signupUser, getUserInfo}