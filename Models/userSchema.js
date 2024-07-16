const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,

    },
    firebaseUid: {
        type: String,
        required: true,
    },
    disabled: {
        type: Boolean,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
