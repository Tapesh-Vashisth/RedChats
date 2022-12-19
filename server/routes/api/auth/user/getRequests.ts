export {}
import getRequests from "../../../../controller/auth/user/getRequestsController";
const express = require("express");
const Router = express.Router();

Router.get("/", getRequests);

export default Router;