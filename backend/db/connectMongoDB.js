import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/twitter-db`)
        console.log(`MONGODB connected !! DB Host: ${connectionInstance.connection.host}`);
    } 
    catch (error) {
        console.log(`Error connection to mongoDB: ${error.message}`)
        process.exit(1)
    }
}

export {connectDB}