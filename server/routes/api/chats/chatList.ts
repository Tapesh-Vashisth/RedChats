export {};
import chatList from "../../../controller/chats/getChatListController";

const express = require("express");

const Router = express.Router();

Router.get("/", chatList);

export default Router;