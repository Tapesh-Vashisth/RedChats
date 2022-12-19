export {};
import createRoom from "../../../controller/chats/createRoomController";

const express = require("express");

const Router = express.Router();

Router.post("/", createRoom);

export default Router;