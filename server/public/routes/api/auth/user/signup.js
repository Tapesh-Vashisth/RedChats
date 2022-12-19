"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const signupController_1 = __importDefault(require("../../../../controller/auth/user/signupController"));
const express = require("express");
const router = express.Router();
router.post('/', signupController_1.default);
exports.default = router;
