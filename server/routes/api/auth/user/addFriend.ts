export {}
import addFriend from "../../../../controller/auth/user/addFriendController";

const express = require("express");

const Router = express.Router();

Router.post("/", addFriend);

export default Router;


