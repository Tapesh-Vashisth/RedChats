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
const bcrypt = require("bcrypt");
const users_1 = __importDefault(require("../../../models/users"));
const user_details_1 = __importDefault(require("../../../models/user_details"));
const jwt = require("jsonwebtoken");
require("dotenv").config();
const saltrounds = 10;
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const check1 = yield users_1.default.findOne({ email: email });
    if (check1) {
        return res.status(403).json({ message: "user already exists" });
    }
    const check2 = yield users_1.default.findOne({ email: email, username: username });
    if (check2) {
        return res.status(403).json({ message: "user already exists" });
    }
    const refreshToken = jwt.sign({ email: email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
    const user = yield new users_1.default({ email, username, password, refreshToken });
    user.password = yield bcrypt.hash(password, saltrounds);
    yield user.save();
    let resp = { username: user.username, email: user.email, active: user.active };
    // creating other corresponding models for that user 
    const details = yield new user_details_1.default({ username, chatRooms: [], Requests: [] });
    yield details.save();
    res.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.status(201).json(resp);
});
exports.default = signup;
