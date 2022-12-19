import { Middleware } from "@reduxjs/toolkit";
import { userActions } from "../../features/user/userSlice";
import { userDetailActions } from "../../features/user/userDetailsSlice";
import { chatActions } from "../../features/chat/chatsSlice";
import { io, Socket } from "socket.io-client";

const connectionMiddleware: Middleware = store => {
        let socket: Socket;
        return next => action => {
            if (!chatActions.sendMessage.match(action) && !userActions.startConnecting.match(action) && !userActions.toggleActive.match(action) && !userDetailActions.acceptRequest.match(action) && !userDetailActions.rejectIncomingRequest.match(action) && !userDetailActions.rejectOutgoingRequest.match(action)){
                return next(action);
            }
            
            const user = store.getState().user;
            
            if (!store.getState().user.connected){
                socket = io("https://redchats.onrender.com"); 
            
                socket.on("connect", () => {
                    socket.emit("join_rooms", {username: user.username});
                    store.dispatch(userActions.connectionEstablished(true));
                    console.log("connected");
                });

                socket.on("changed", (data) => {
                    if (user.username === data.username){
                        store.dispatch(userActions.setActive(data.to));
                        store.dispatch(chatActions.setActive(data));
                    }else{
                        store.dispatch(chatActions.setActive(data));
                    }
                }) 
                
                socket.on("recieveMessage", (data) => {
                    console.log(data);
                    store.dispatch(chatActions.addMessage({message: {senderId: data.senderId, message: data.message, date: data.date}, to: data.to}));
                })
                
                socket.on("SuccessAccepted", (data) => {
                    const upd = store.getState().userDetail.Requests.filter((x: {username: String, chatroom: String, flow: Boolean}) => {return (x.chatroom !== data.chatroom && x.username !== data.to && x.username !== data.from)});
                    console.log(upd);
                    store.dispatch(userDetailActions.setRequests(upd));
                });
                
                
                socket.on("SuccessRejected", (data) => {
                    const upd = store.getState().userDetail.Requests.filter((x: {username: String, chatroom: String, flow: Boolean}) => {return (x.chatroom !== data.chatroom && x.username !== data.to && x.username !== data.from)});       
                    store.dispatch(userDetailActions.setRequests(upd));
                });
            }

            if (chatActions.sendMessage.match(action)){
                socket.emit("sendMessage", action.payload);
                return next(action);
            }

            if (userActions.toggleActive.match(action)){
                socket.emit("ToggleActive", {email: user.email, username: user.username, to: !user.active})
            }

            if (userDetailActions.acceptRequest.match(action)){
                socket.emit("RequestAccepted", {from: action["payload"]["username"], to: user.username, chatroom: action["payload"]["chatroom"]});
            }
            
            if (userDetailActions.rejectIncomingRequest.match(action)){
                socket.emit("incomingRequestRejected", {from: action["payload"]["username"], to: user.username, chatroom: action["payload"]["chatroom"]});
            }
            
            if (userDetailActions.rejectOutgoingRequest.match(action)){
                socket.emit("outgoingRequestRejected", {from: user.username, to: action["payload"]["username"], chatroom: action["payload"]["chatroom"]});
            }
    }
} 


export default connectionMiddleware