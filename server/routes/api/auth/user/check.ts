export {}
import check from "../../../../controller/auth/user/checkController";
const express = require("express");

const Router =  express.Router();

Router.get("/", check);

export default Router;