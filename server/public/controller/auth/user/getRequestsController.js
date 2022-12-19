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
const users_1 = __importDefault(require("../../../models/users"));
const getRequests = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.default.findOne({ email: req.email }, { password: 0 });
    if (!user) {
        return res.status(404).json({ message: "not found" });
    }
    const detail = yield user_details_1.default.findOne({ username: user.username }, { chatRooms: 0 });
    if (!detail) {
        return res.status(404).json({ message: "details not found" });
    }
    const resp = { Requests: detail.Requests };
    return res.status(200).json(resp);
});
exports.default = getRequests;
