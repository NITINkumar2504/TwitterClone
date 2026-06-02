import jwt from 'jsonwebtoken'

export const generateTokenAndSetCookie = async (userId, res) => {
    const token = jwt.sign(
        {
            userId  // to identify user
        },    
        process.env.JWT_SECRET,
        {
            expiresIn : "15d"
        }
    )

    res.cookie(
        "jwt",    // cookie name
        token, 
        {    // for more security
            maxAge : 15*24*60*60*1000,  // millisecods (15d)
            httpOnly : true,   //  prevent XSS attacks cross-site scripting attacks (not modifiable on frontend, only server can modify)
            secure : process.env.NODE_ENV !== 'development',
            sameSite : "strict"  // CSRF attacks cross-site request forgery attacks    
        }
    )
}