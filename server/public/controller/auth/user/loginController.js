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
const users_1 = __importDefault(require("../../../models/users"));
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const saltrounds = 10;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    let user = yield users_1.default.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ message: "user doesn't exists" });
    }
    let decider = yield bcrypt.compare(password, user === null || user === void 0 ? void 0 : user.password);
    if (!decider) {
        return res.status(404).json({ message: "wrong password" });
    }
    // if(!req.session.email){
    //     req.session.email = resp.email;
    // }
    // create jwt 
    const refreshtoken = jwt.sign({ email: user.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
    let resp = { username: user.username, email: user.email, active: user.active };
    // save the refresh token of the user in the database 
    user.refreshToken = refreshtoken;
    yield user.save();
    res.cookie("jwt", refreshtoken, { httpOnly: true, sameSite: "none", secure: true, maxAge: 24 * 60 * 60 * 1000 });
    res.status(200).json(resp);
});
exports.default = login;
