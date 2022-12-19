"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const findUserController_1 = __importDefault(require("../../../../controller/auth/user/findUserController"));
const express = require("express");
const Router = express.Router();
Router.post("/", findUserController_1.default);
exports.default = Router;
