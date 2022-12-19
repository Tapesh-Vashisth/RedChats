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
const user_details_1 = __importDefault(require("../../../models/user_details"));
const user_relations_1 = __importDefault(require("../../../models/user_relations"));
const addFriend = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let chatid = req.body.chatid;
    let to = req.body.to;
    let from = req.body.from;
    const chat = yield user_relations_1.default.findOne({ chatroom: chatid });
    if (!chat)
        return res.sendStatus(404);
    if ((chat === null || chat === void 0 ? void 0 : chat.maxStrength) <= (chat === null || chat === void 0 ? void 0 : chat.members.length))
        return res.sendStatus(507);
    let checkAlreadyMember = chat === null || chat === void 0 ? void 0 : chat.members.find((x) => { var _a; return ((_a = x === null || x === void 0 ? void 0 : x.member) === null || _a === void 0 ? void 0 : _a.username) === to; });
    if (checkAlreadyMember) {
        return res.status(403).json({ message: "already a member" });
    }
    if (!chat) {
        return res.status(404).json({ message: "chatroom doesn't exist" });
    }
    // checking if already requested 
    const requested = yield user_details_1.default.findOne({ username: from });
    let decider = requested === null || requested === void 0 ? void 0 : requested.Requests.find((x) => { return x.chatroom === chatid; });
    if (decider) {
        return res.status(403).json({ message: "already requested" });
    }
    const obj = { username: to, chatroom: chatid, flow: true };
    // changing the requestor 
    user_details_1.default.findOneAndUpdate({ username: from }, { $push: { Requests: obj } }, function (err) {
        if (err) {
            return res.status(500).json({ message: "something went wrong" });
        }
    });
    // changing the reciever 
    user_details_1.default.findOneAndUpdate({ username: to }, { $push: { Requests: { username: from, chatroom: chatid, flow: false } } }, function (err) {
        if (err) {
            return res.status(500).json({ message: "something went wrong" });
        }
    });
    return res.status(200).json({ message: "success" });
});
exports.default = addFriend;
