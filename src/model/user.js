const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true,
        min: 8,
        max: 12
    },

    role: {
        type: String,
        enum: ["customer", "Support Agent", "manager"],
    }

},{timestamps: true})

module.exports = mongoose.model("User",userSchema);