import Notification from "../models/notification.models.js"

const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id

        const notifications = await Notification.find({to : userId}).populate({path : "from", select : "username profileImg"})

        await Notification.updateMany({to : userId}, { read : true})

        return res.status(200).json(notifications)
    } 
    catch (error) {
        console.log("Error in getNotifications controller:", error.message)
        return res.status(500).json({error : "Internal Server Error"}) 
    }
}

const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id

        await Notification.deleteMany({ to: userId })

        return res.status(200).json({message : "Notifications deleted successfully"})
    } 
    catch (error) {
        console.log("Error in deleteNotifications controller:", error.message)
        return res.status(500).json({error : "Internal Server Error"}) 
    }
}

const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user._id

        const notification = await Notification.findById(id)
        if(!notification){
            return res.status(404).json({ error : "Notification not found" })
        }

        if(notification.to.toString() !== userId.toString()){
            return res.status(400).json({ error : "You are not allowed to delete this notification"} )
        }

        await Notification.findByIdAndDelete(id)

        return res.status(200).json({message : "Notification deleted successfully"})
    } 
    catch (error) {
        console.log("Error in deleteNotification controller:", error.message)
        return res.status(500).json({error : "Internal Server Error"}) 
    }
}

export { getNotifications, deleteNotifications, deleteNotification }