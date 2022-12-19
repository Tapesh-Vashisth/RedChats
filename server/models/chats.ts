import express from "express";
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    message: {
        type: {senderId: String, message: String, date: Date}
    }
});

const chatSchema = new mongoose.Schema({
    chatroom: {
        type: String,
        required: true
    },
    messages: [messageSchema]
});

const chatModel = mongoose.model("Chats", chatSchema);

export const messageModel = mongoose.model("Messages", messageSchema);

export default chatModel;