"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const findAdminRoomsController_1 = __importDefault(require("../../../controller/chats/findAdminRoomsController"));
const express = require("express");
const Router = express.Router();
Router.post("/", findAdminRoomsController_1.default);
exports.default = Router;
