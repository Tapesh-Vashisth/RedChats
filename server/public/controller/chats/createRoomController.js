"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chats_1 = __importDefault(require("../../models/chats"));
const user_relations_1 = __importDefault(require("../../models/user_relations"));
const user_relations_2 = require("../../models/user_relations");
const user_details_1 = __importDefault(require("../../models/user_details"));
const createRoom = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { username, chatroom, strength } = req.body;
        const room = yield user_relations_1.default.findOne({ chatroom: chatroom });
        if (room) {
            return res.status(404).json({ message: "room already exists" });
        }
        const member = yield new user_relations_2.memberModel({ member: { username, role: "admin" } });
        const relation = yield new user_relations_1.default({ maxStrength: strength, members: [member], chatroom });
        const userDetail = yield user_details_1.default.findOne({ username });
        if (!userDetail) {
            return res.status(404).json({ message: "detail not found" });
        }
        // adding the chatroom to the admin's record 
        yield userDetail.updateOne({ $push: { chatRooms: { chatroom } } });
        // create a chatroom
        const chat = yield new chats_1.default({ chatroom, messages: [] });
        yield relation.save();
        yield chat.save();
        yield userDetail.save();
        console.log("hmm");
        return res.status(200).json({ message: "all good" });
    }
    catch (err) {
        console.log(err);
    }
});
exports.default = createRoom;
