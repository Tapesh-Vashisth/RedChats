import express from "express";
import mongoose from "mongoose";

const detailSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    chatRooms: {
        type: [{chatroom: String}]
    },
    Requests: {
        type: [{username: String, chatroom: String, flow: Boolean}]
    }
})


const detailModel = mongoose.model("UserDetails", detailSchema);

export default detailModel;
