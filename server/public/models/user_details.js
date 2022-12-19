"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const detailSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true
    },
    chatRooms: {
        type: [{ chatroom: String }]
    },
    Requests: {
        type: [{ username: String, chatroom: String, flow: Boolean }]
    }
});
const detailModel = mongoose_1.default.model("UserDetails", detailSchema);
exports.default = detailModel;
