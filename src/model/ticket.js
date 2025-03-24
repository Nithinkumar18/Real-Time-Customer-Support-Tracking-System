
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = require('../model/user');

const ticketSchema = new Schema({

   cutomer_Id:{
    type: mongoose.Schema.ObjectId,
    required: true,
    ref:user
   },

   assignedAgent:{
    type: mongoose.Schema.ObjectId,
    required: true,
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

}, {timestamps: true});