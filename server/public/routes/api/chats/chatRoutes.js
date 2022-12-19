"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const chatList_1 = __importDefault(require("./chatList"));
const createRoom_1 = __importDefault(require("./createRoom"));
const findAdminRooms_1 = __importDefault(require("./findAdminRooms"));
const AuthenticateController_1 = __importDefault(require("../../../controller/auth/AuthenticateController"));
const Router = express.Router();
Router.use(AuthenticateController_1.default);
Router.use("/getChatlist", chatList_1.default);
Router.use("/createRoom", createRoom_1.default);
Router.use("/findAdminRooms", findAdminRooms_1.default);
exports.default = Router;
