
const mongoose = require("mongoose");

const NotificaionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    message : {
        notification : {
            title: {
                type:String,
                required: true
            },
            body : {
                type:String,
                required: true
            }
        }
    }
})
module.exports = notification = mongoose.model('notification', NotificaionSchema);