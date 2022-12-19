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
const user_relations_1 = __importDefault(require("../../models/user_relations"));
const user_details_1 = __importDefault(require("../../models/user_details"));
const findAdminRooms = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const userDetail = yield user_details_1.default.findOne({ username });
    if (!userDetail) {
        return res.status(404).json({ message: "not found" });
    }
    let resp = [];
    let counter = 0;
    userDetail.chatRooms.map((x) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        let relation = yield user_relations_1.default.findOne({ chatroom: x.chatroom });
        for (let i = 0; i < (relation === null || relation === void 0 ? void 0 : relation.members.length); i++) {
            const element = relation === null || relation === void 0 ? void 0 : relation.members[i];
            if (((_a = element === null || element === void 0 ? void 0 : element.member) === null || _a === void 0 ? void 0 : _a.username) === username && ((_b = element === null || element === void 0 ? void 0 : element.member) === null || _b === void 0 ? void 0 : _b.role) === "admin") {
                resp.push(x.chatroom);
            }
        }
        counter++;
        if (counter === userDetail.chatRooms.length) {
            return res.status(200).json({ adminRooms: resp });
        }
    }));
});
exports.default = findAdminRooms;
