export {}
import findUser from "../../../../controller/auth/user/findUserController";

const express = require("express");

const Router = express.Router();

Router.post("/", findUser);

export default Router;


