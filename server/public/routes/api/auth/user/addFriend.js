"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const addFriendController_1 = __importDefault(require("../../../../controller/auth/user/addFriendController"));
const express = require("express");
const Router = express.Router();
Router.post("/", addFriendController_1.default);
exports.default = Router;
