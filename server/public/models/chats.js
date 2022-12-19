"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    message: {
        type: { senderId: String, message: String, date: Date }
    }
});
const chatSchema = new mongoose_1.default.Schema({
    chatroom: {
        type: String,
        required: true
    },
    messages: [messageSchema]
});
const chatModel = mongoose_1.default.model("Chats", chatSchema);
exports.messageModel = mongoose_1.default.model("Messages", messageSchema);
exports.default = chatModel;
