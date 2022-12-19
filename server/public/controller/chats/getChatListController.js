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
const users_1 = __importDefault(require("../../models/users"));
const user_details_1 = __importDefault(require("../../models/user_details"));
const user_relations_1 = __importDefault(require("../../models/user_relations"));
const chats_1 = __importDefault(require("../../models/chats"));
const chatList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.default.findOne({ email: req.email }, { password: 0 });
    if (!user) {
        return res.status(404).json({ message: "not found" });
    }
    const detail = yield user_details_1.default.findOne({ username: user.username }, { Requests: 0 });
    if (!detail) {
        return res.status(404).json({ message: "details not found" });
    }
    // preparing the data
    let resp = [];
    let counter = 0;
    detail.chatRooms.forEach((x) => __awaiter(void 0, void 0, void 0, function* () {
        const chatdetails = yield user_relations_1.default.findOne({ chatroom: x.chatroom });
        const message = yield chats_1.default.findOne({ chatroom: x.chatroom });
        if (chatdetails && message) {
            let chatroom = x.chatroom;
            let strength = chatdetails.maxStrength;
            let messages = message.messages;
            let members = chatdetails.members;
            let admin;
            chatdetails.members.forEach((x) => {
                var _a;
                if (((_a = x.member) === null || _a === void 0 ? void 0 : _a.role) === "admin") {
                    admin = x.member.username;
                }
            });
            let counter2 = 0;
            let memberpush = members;
            let active = [];
            members.forEach((x, i, arr) => __awaiter(void 0, void 0, void 0, function* () {
                const use = yield users_1.default.findOne({ username: x.member.username });
                counter2++;
                active.push({ username: use === null || use === void 0 ? void 0 : use.username, status: use === null || use === void 0 ? void 0 : use.active });
                if (counter2 === members.length) {
                    counter++;
                    let holdchat = { chatname: chatroom, strength, messages, members: memberpush, admin };
                    resp.push({ chat: holdchat, active });
                    if (counter === detail.chatRooms.length) {
                        return res.status(200).json(resp);
                    }
                }
            }));
        }
        else {
            return res.status(404).json({ message: "not found" });
        }
    }));
});
exports.default = chatList;
