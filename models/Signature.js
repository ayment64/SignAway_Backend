const mongoose = require("mongoose");

const SignSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    unique_id: {
        type: Number
    },
    sign1: {
        type: String
    },
    sign2: {
        type: String
    },
    sign3: {
        type: String
    },
    sign4: {
        type: String
    },
    sign5: {
        type: String
    },
    sign6: {
        type: String
    },
    sign7: {
        type: String
    },
    sign8: {
        type: String
    }
});

module.exports = sign = mongoose.model('signature', SignSchema);