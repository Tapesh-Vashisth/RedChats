"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/api/auth/authRoutes"));
const express_1 = __importDefault(require("express"));
require('dotenv').config();
const mongoose_1 = __importDefault(require("mongoose"));
const cookieParser = require("cookie-parser");
const http_1 = __importDefault(require("http"));
const { Server } = require("socket.io");
const chatRoutes_1 = __importDefault(require("./routes/api/chats/chatRoutes"));
const users_1 = __importDefault(require("./models/users"));
const chats_1 = __importDefault(require("./models/chats"));
const user_relations_1 = __importDefault(require("./models/user_relations"));
const user_details_1 = __importDefault(require("./models/user_details"));
const user_relations_2 = require("./models/user_relations");
// valideEnv();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)({
    origin: ["https://redchats.netlify.app", "http://localhost:3000"],
    methods: ['POST', 'GET', 'HEAD', 'PUT', 'DELETE'],
    credentials: true
}));
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://redchats.netlify.app"],
        methods: ["GET", "POST"]
    }
});
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(cookieParser());
// app.use(session({
//     secret: "it's our secret",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         maxAge: 60*60*1000
//     }
// }))
app.get("/");
app.use('/api/auth', authRoutes_1.default);
app.use('/api/chats', chatRoutes_1.default);
// socket logic 
io.on("connection", (socket) => {
    console.log("user connected: ", socket.id);
    socket.on("join_rooms", (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("rooms");
        const userDetail = yield user_details_1.default.findOne({ username: data.username });
        if (userDetail) {
            userDetail.chatRooms.forEach((x) => {
                socket.join(x.chatroom);
                console.log(socket.id + " joined the room " + x.chatroom);
            });
        }
    }));
    socket.on("sendMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(data);
        const chatroom = yield chats_1.default.findOne({ chatroom: data.to });
        if (chatroom) {
            let message = { senderId: data.senderId, message: data.message, date: data.date };
            yield chatroom.updateOne({ $push: { messages: { message } } });
            socket.broadcast.to(data.to).emit("recieveMessage", data);
        }
    }));
    socket.on("ToggleActive", (data) => {
        console.log(data);
        let email = data.email;
        users_1.default.findOneAndUpdate({ email: email }, { active: data.to }, function (err) {
            if (!err) {
                io.emit("changed", { username: data.username, to: data.to });
            }
            else {
                console.log(err);
            }
        });
    });
    socket.on("RequestAccepted", (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(data);
        const sender = yield user_details_1.default.findOne({ username: data.from });
        const reciever = yield user_details_1.default.findOne({ username: data.to });
        if (sender && reciever) {
            try {
                yield sender.updateOne({ $pull: { Requests: { username: data.to, chatroom: data.chatroom } } });
                yield reciever.updateOne({ $pull: { Requests: { username: data.from, chatroom: data.chatroom } } });
                yield reciever.updateOne({ $push: { chatRooms: { chatroom: data.chatroom } } });
                // updating the relation 
                const relation = yield user_relations_1.default.findOne({ chatroom: data.chatroom });
                if (relation) {
                    const mem2 = yield new user_relations_2.memberModel({ member: { username: data.to, role: "member" } });
                    yield relation.updateOne({ $push: { members: mem2 } });
                    yield relation.save();
                    yield sender.save();
                    yield reciever.save();
                    io.emit("SuccessAccepted", data);
                }
            }
            catch (err) {
                console.log(err);
            }
        }
    }));
    socket.on("incomingRequestRejected", (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(data);
        user_details_1.default.findOneAndUpdate({ username: data.from }, { $pull: { Requests: { username: data.to, chatroom: data.chatroom } } }, function (err) {
            if (!err) {
                user_details_1.default.findOneAndUpdate({ username: data.to }, { $pull: { Requests: { username: data.from, chatroom: data.chatroom } } }, function (err) {
                    if (!err) {
                        console.log("perfect");
                        io.emit("SuccessRejected", data);
                    }
                    else {
                        console.log(err);
                    }
                });
            }
            else {
                console.log(err);
            }
        });
    }));
    socket.on("outgoingRequestRejected", (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(data);
        user_details_1.default.findOneAndUpdate({ username: data.from }, { $pull: { Requests: { username: data.to, chatroom: data.chatroom } } }, function (err) {
            if (!err) {
                user_details_1.default.findOneAndUpdate({ username: data.to }, { $pull: { Requests: { username: data.from, chatroom: data.chatroom } } }, function (err) {
                    if (!err) {
                        console.log("perfect");
                        io.emit("SuccessRejected", data);
                    }
                    else {
                        console.log(err);
                    }
                });
            }
            else {
                console.log(err);
            }
        });
    }));
    socket.on("disconnect", () => {
        console.log("user disconnected: ", socket.id);
    });
});
mongoose_1.default.connect("mongodb+srv://" + process.env.MONGO_USER + ":" + process.env.MONGO_PASSWORD + "@cluster0.av1f7hf.mongodb.net/?retryWrites=true&w=majority").then(() => {
    console.log("database connected");
    server.listen(process.env.PORT || 5000, () => { console.log("Listening on " + process.env.PORT); });
}).catch((err) => { console.log(err); });
