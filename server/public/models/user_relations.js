"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const members = new mongoose_1.default.Schema({
    member: {
        type: { username: String, role: String }
    }
});
const relationSchema = new mongoose_1.default.Schema({
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
});
const relationModel = mongoose_1.default.model("relations", relationSchema);
exports.memberModel = mongoose_1.default.model("members", members);
exports.default = relationModel;
