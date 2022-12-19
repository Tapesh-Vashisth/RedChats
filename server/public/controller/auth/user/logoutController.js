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
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // if (req.session.email) {
    //     req.session.destroy((err: any) => {
    //         if (err) {
    //             return res.status(400).send('Unable to log out')
    //         } else {
    //             return res.status(200).json({message: 'Logout successful'})
    //         }
    //     });
    // } else {
    //     return res.status(404)
    // }
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
        return res.sendStatus(204);
    const refreshToken = cookies.jwt;
    // Is refreshToken in db? 
    let user = yield users_1.default.findOne({ refreshToken }).exec();
    if (!user) {
        res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
        return res.sendStatus(204);
    }
    // delete the refresh token 
    user.refreshToken = "";
    const result = yield user.save();
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    res.sendStatus(204);
});
exports.default = logout;
