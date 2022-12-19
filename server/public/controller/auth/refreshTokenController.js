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
const jwt = require("jsonwebtoken");
const users_1 = __importDefault(require("../../models/users"));
require("dotenv").config();
const handleRefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
        return res.sendStatus(401);
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;
    // check for the user with that refreshToken in the database 
    const user = yield users_1.default.findOne({ refreshToken }).exec();
    if (!user)
        return res.sendStatus(403); //forbidden
    // evaluate jwt 
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || user.email !== decoded.email)
            return res.sendStatus(403);
        const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
        res.json({ accessToken });
    });
});
exports.default = handleRefreshToken;
