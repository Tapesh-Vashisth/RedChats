"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getChatListController_1 = __importDefault(require("../../../controller/chats/getChatListController"));
const express = require("express");
const Router = express.Router();
Router.get("/", getChatListController_1.default);
exports.default = Router;
