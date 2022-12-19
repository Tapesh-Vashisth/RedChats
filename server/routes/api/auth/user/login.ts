export {};
import {Express, Request, Response} from 'express';
import login from "../../../../controller/auth/user/loginController";
const express = require("express");

const router = express.Router();

router.post("/", login);

export default router;

