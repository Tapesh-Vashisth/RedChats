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
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // if (req.session.email){
    //     const user = await userModel.findOne({email: req.session.email});
    //     if (!user){
    //         console.log("what's wrong");
    //         return res.status(404).json({message: "not found"});
    //     }        
    //     next();
    // }else{
    //     return res.status(404).json({message: "not found"});
    // }
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
        return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    const user = yield users_1.default.findOne({ refreshToken }).exec();
    if (!user)
        return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || user.email !== decoded.email)
            return res.sendStatus(403);
        req.email = user.email;
        next();
    });
});
exports.default = Authenticate;
