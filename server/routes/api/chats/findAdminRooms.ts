export {};
import findAdminRooms from "../../../controller/chats/findAdminRoomsController";

const express = require("express");

const Router = express.Router();

Router.post("/", findAdminRooms);

export default Router;