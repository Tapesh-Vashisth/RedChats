import bodyParser from 'body-parser'
import cors from 'cors'
import AuthRouter from "./routes/api/auth/authRoutes";
import express,{Express} from 'express'
require ('dotenv').config();
import mongoose from 'mongoose';
const cookieParser = require("cookie-parser");
import session from "express-session";
import http from "http";
const {Server} = require("socket.io");
import ChatRouter from "./routes/api/chats/chatRoutes";
import userModel from './models/users';
import chatModel from './models/chats';
import relationModel from './models/user_relations';
import detailModel from './models/user_details';
import { memberModel } from './models/user_relations';
import valideEnv from './src/utils/validateEnv';

// valideEnv();
const app:Express = express();
const server = http.createServer(app);
app.use(cors({
    origin:["https://redchats.netlify.app", "http://localhost:3000"],
    methods:['POST','GET','HEAD','PUT','DELETE'],
    credentials: true
}))

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://redchats.netlify.app"],
        methods: ["GET", "POST"],
        Credential: true
    }
})

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cookieParser());

// app.use(session({
//     secret: "it's our secret",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         maxAge: 60*60*1000
//     }
// }))

app.get("/")
app.use('/api/auth', AuthRouter);
app.use('/api/chats', ChatRouter);


// socket logic 
io.on("connection", (socket: any) => {
    console.log("user connected: ", socket.id);

    socket.on("join_rooms", async (data: any) => {
        console.log("rooms");
        const userDetail = await detailModel.findOne({username: data.username});
        if (userDetail) {
            userDetail.chatRooms.forEach((x) => {
                socket.join(x.chatroom);
                console.log(socket.id + " joined the room " + x.chatroom);
            });
        }
    })

    socket.on("sendMessage", async (data: any) => {
        console.log(data);
        const chatroom = await chatModel.findOne({chatroom: data.to});
        if (chatroom){
            let message = {senderId: data.senderId, message: data.message, date: data.date};
            await chatroom.updateOne({$push: {messages: {message}}});
            socket.broadcast.to(data.to).emit("recieveMessage", data);
        }
    })

    socket.on("ToggleActive", (data: any) => {
        console.log(data);
        let email = data.email;
        userModel.findOneAndUpdate({email: email}, {active: data.to}, function(err: any){
            if (!err){
                io.emit("changed", {username: data.username, to: data.to});
            }else{
                console.log(err);
            }
        })
    })

    socket.on("RequestAccepted", async (data: any) => {
        console.log(data);
        const sender = await detailModel.findOne({username: data.from});
        const reciever = await detailModel.findOne({username: data.to});
        
        if (sender && reciever){
            try {
                await sender.updateOne({$pull: {Requests: {username: data.to, chatroom: data.chatroom}}});
                await reciever.updateOne({$pull: {Requests: {username: data.from, chatroom: data.chatroom}}});
                await reciever.updateOne({$push: {chatRooms: {chatroom: data.chatroom}}});

                // updating the relation 
                const relation = await relationModel.findOne({chatroom: data.chatroom});
                if (relation){
                    const mem2 = await new memberModel({member: {username: data.to, role: "member"}});
                    await relation.updateOne({$push: {members: mem2}}); 
                    await relation.save();
                    await sender.save();
                    await reciever.save();
                    io.emit("SuccessAccepted", data);
                }
            } catch (err) {
                console.log(err);
            }
        }
    });
    
    socket.on("incomingRequestRejected", async (data: any) => {
        console.log(data);
        detailModel.findOneAndUpdate({username: data.from}, {$pull: {Requests: {username: data.to, chatroom: data.chatroom}}}, function(err: any){
            if (!err){
                detailModel.findOneAndUpdate({username: data.to}, {$pull: {Requests: {username: data.from, chatroom: data.chatroom}}}, function(err: any){
                    if (!err){
                        console.log("perfect");
                        io.emit("SuccessRejected", data);
                    }else{
                        console.log(err);
                    }
                })
            }else{
                console.log(err);
            }
        })
    });
    
    socket.on("outgoingRequestRejected", async (data: any) => {
        console.log(data);
        detailModel.findOneAndUpdate({username: data.from}, {$pull: {Requests: {username: data.to, chatroom: data.chatroom}}}, function(err: any){
            if (!err){
                detailModel.findOneAndUpdate({username: data.to}, {$pull: {Requests: {username: data.from, chatroom: data.chatroom}}}, function(err: any){
                    if (!err){
                        console.log("perfect");
                        io.emit("SuccessRejected", data);

                    }else{
                        console.log(err);
                    }
                })
            }else{
                console.log(err);
            }
        })
    });
    
    socket.on("disconnect", () => {
        console.log("user disconnected: ", socket.id);
    })
})

mongoose.connect("mongodb+srv://" + process.env.MONGO_USER + ":" + process.env.MONGO_PASSWORD + "@cluster0.av1f7hf.mongodb.net/?retryWrites=true&w=majority").then(() => {
    console.log("database connected");
    server.listen(process.env.PORT || 5000,()=>{console.log("Listening on " + process.env.PORT)});
}).catch((err) => {console.log(err)});

