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
const findUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const user = yield user_details_1.default.find({ username });
    if (!user) {
        return res.status(404);
    }
    let resp = [];
    user.map(x => {
        resp.push(x.username);
    });
    console.log(resp);
    res.status(200).json({ search: resp });
});
exports.default = findUser;
