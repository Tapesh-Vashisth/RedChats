export {};
import {Express, Request, Response} from 'express';
import signup from "../../../../controller/auth/user/signupController";
const express = require("express");

const router = express.Router();

router.post('/', signup);

export default router;