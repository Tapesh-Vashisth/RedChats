"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loginController_1 = __importDefault(require("../../../../controller/auth/user/loginController"));
const express = require("express");
const router = express.Router();
router.post("/", loginController_1.default);
exports.default = router;
