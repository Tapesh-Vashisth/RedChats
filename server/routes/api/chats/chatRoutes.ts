export {}
const express = require("express");
import chatList from "./chatList";
import createRoom from "./createRoom";
import findAdminRooms from "./findAdminRooms";
import Authenticate from "../../../controller/auth/AuthenticateController";

const Router = express.Router();

Router.use(Authenticate);
Router.use("/getChatlist", chatList);
Router.use("/createRoom", createRoom); 
Router.use("/findAdminRooms", findAdminRooms);

export default Router;