const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    phone_num:{
        type: String,
        required: true
    },
    cin_num: {
        type: String,
        required: true
    },
    cin_photo: {
        type: String,
    },
    assurence: {
        type: String,
        required: true
    },
    bank: {
        type: String,
        required: true
    },
    job: {
        type: String,
        required: true
    }
})

module.exports = profile = mongoose.model('profile', ProfileSchema);