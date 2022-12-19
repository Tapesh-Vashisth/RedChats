import express from "express";
import mongoose from "mongoose";

const members = new mongoose.Schema({
    member: {
        type: {username: String, role: String}
    }
})

const relationSchema = new mongoose.Schema({
    maxStrength: {
        type: Number,
        default: 2
    },
    members: {
        type: [members]
    },
    chatroom: {
        type: String,
        required: true
    } 
})

const relationModel = mongoose.model("relations", relationSchema);
export const memberModel = mongoose.model("members", members);

export default relationModel;