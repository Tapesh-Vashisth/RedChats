export {};
import {Express, Request, Response} from "express";
import signup from './user/signup';
import login from './user/login';
import logout from './user/logout';
import check from "./user/check";
import addFriend from "./user/addFriend";
import findUser from "./user/findUser";
import getRequests from "./user/getRequests";
import Authenticate from "../../../controller/auth/AuthenticateController";
const express = require("express");

const Router = express.Router();

Router.use("/user/login", login);
Router.use("/user/signup", signup);
Router.use("/user/logout", logout);
Router.use(Authenticate);

Router.use("/user/check", check);
Router.use("/user/addFriend", addFriend);
Router.use("/user/findUser", findUser);
Router.use("/user/getRequests", getRequests);

export default Router;