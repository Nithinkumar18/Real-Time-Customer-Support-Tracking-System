
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = require('../model/user');

const ticketSchema = new Schema({

   customer_Id:{
    type: mongoose.Schema.ObjectId,
    required: true,
    ref:user
   },

   query:{
      type: String,
      required: true
   },
   
   assignedAgent:{
    type: mongoose.Schema.ObjectId,
    ref: user
   },

   category:{
    type: String,
    required: true
   },

   priority:{
    type: String,
    required: true
   },

   status:{
    type: String,
    required: true
   },

   dueDate:{
      type: Date,
      required: true
   }

}, {timestamps: true});

module.exports = mongoose.model("ticket",ticketSchema);