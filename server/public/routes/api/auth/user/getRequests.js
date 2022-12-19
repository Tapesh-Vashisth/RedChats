"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getRequestsController_1 = __importDefault(require("../../../../controller/auth/user/getRequestsController"));
const express = require("express");
const Router = express.Router();
Router.get("/", getRequestsController_1.default);
exports.default = Router;
