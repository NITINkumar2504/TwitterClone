import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.jwt || req.header('Authorization')?.replace('Bearer ','')
        
        if(!token){
            return res.status(401).json({error : "Unauthorized access: No token provided"})
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        if(!decodedToken){
            return res.status(401).json({error : "Invalid token"})
        }

        const user = await User.findById(decodedToken.userId).select("-password")   // userId is payload used at time oof token creation

        if(!user){
            return res.status(404).json({error : "User not found"})
        }

        req.user = user
        next()  // for next function after verifyJWT
    } 
    catch (error) {
        console.log("Error in verifyJWT middleware", error.message)
        return res.status(500).json({error : "Internal Server Error"})
    }
}