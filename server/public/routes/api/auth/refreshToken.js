"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const refreshTokenController_1 = __importDefault(require("../../../controller/auth/refreshTokenController"));
const express = require("express");
const Router = express.Router();
Router.get("/", refreshTokenController_1.default);
exports.default = Router;
