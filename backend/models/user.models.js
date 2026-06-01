import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username : {
            type : String,
            required : true,
            unique : true
        },
        fullname : {
            type : String,
            // required : [true, 'full name is required']
            required : true,
        },
        password : {
            type : String,
            required : true,
            // minLenght : [6, 'password is too short']
            minLength : 6,
        },
        email : {
            type : String,
            required : true,
            unique : true
        },
        followers : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'User',
                default : []   // 0 followers when user signup
            }
        ],
        following : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'User',
                default : []
            }
        ],
        coverImg : {
            type : String,
            default : "",
        },
        profileImg : {
            type : String,
            default : "",
        },
        bio : {
            type : String,
            default : "",
        },
        link : {
            type : String,
            default : ""
        }
    }, 
    {
        timestamps : true
    }
)

const User = mongoose.model('User', userSchema)

export default User