const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ticket = require('../model/ticket');
const user = require('../model/user');

const responseSchema = new Schema({

    ticketId: {
      type: mongoose.Schema.ObjectId,
      ref: ticket,
      required: true
    },

    respondedBy:{
        type: String,
        required: true
    },

    message:{
        type: String,
        required: true
    },


},{timestamps: true})

module.exports = mongoose.model("Response",responseSchema);