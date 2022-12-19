export {};
import {Express, Response, Request} from "express";
const express = require("express");
import logout from "../../../../controller/auth/user/logoutController";

const Router = express.Router();

Router.get("/", logout);

export default Router;