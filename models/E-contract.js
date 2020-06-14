const mongoose = require('mongoose')

const EcontractScheama = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    date: {
        type: Date,
        default: Date.now,
      },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    signature: {
        type: String,
        required: true
    },
    user_target: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user-target'
    },
    signature_target: {
        type: String,
    }
})

module.exports = econtract = mongoose.model('e-contract', EcontractScheama);