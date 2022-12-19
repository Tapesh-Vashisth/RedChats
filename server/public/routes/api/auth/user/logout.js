"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const logoutController_1 = __importDefault(require("../../../../controller/auth/user/logoutController"));
const Router = express.Router();
Router.get("/", logoutController_1.default);
exports.default = Router;
