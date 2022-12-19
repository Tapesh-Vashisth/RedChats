import {Response, NextFunction} from "express";
import userModel from "../../models/users";
import detailModel from "../../models/user_details";
import relationModel from "../../models/user_relations";
import chatModel from "../../models/chats";

const chatList = async (req: any, res: Response, next: NextFunction) => {
    const user = await userModel.findOne({email: req.email}, {password: 0});
    
    if (!user){
        return res.status(404).json({message: "not found"});
    }

    const detail = await detailModel.findOne({username: user.username}, {Requests: 0});

    if (!detail){
        return res.status(404).json({message: "details not found"});
    }

    interface chat{
        chat: {
            chatname: string | undefined
            strength: number | undefined
            admin: string | undefined
            members: {member?: {username?: string | undefined, role?: string | undefined} | undefined} []
            messages: {message?: {senderId?: string | undefined, message?: string | undefined, date?: Date | undefined} | undefined} []
        }
        active: ({username: string | undefined, status: boolean | undefined} | undefined) []
    }

    // preparing the data
    let resp: chat [] = [];
    
    let counter = 0;
    
    detail.chatRooms.forEach(async (x) => {

        const chatdetails = await relationModel.findOne({chatroom: x.chatroom});
        const message = await chatModel.findOne({chatroom: x.chatroom});
        
        if (chatdetails && message){
            let chatroom = x.chatroom;
            let strength = chatdetails.maxStrength;
            let messages = message.messages;
            let members = chatdetails.members;
            let admin: string | undefined;
            chatdetails.members.forEach((x) => {
                if (x.member?.role === "admin"){
                    admin = x.member.username;
                }
            });
            
            let counter2 = 0;

            let memberpush: any = members;
            let active: ({username: string | undefined, status: boolean | undefined} | undefined) [] = [];
            members.forEach(async (x: any, i: any, arr: any) => {
                const use = await userModel.findOne({username: x.member.username});
                counter2++;
                active.push({username: use?.username, status: use?.active});
                if (counter2 === members.length){
                    counter++;
                    let holdchat = {chatname: chatroom, strength, messages, members: memberpush, admin};
                    resp.push({chat: holdchat, active});
                    if (counter === detail.chatRooms.length){
                        return res.status(200).json(resp);
                    }
                }
            })
            
        }else{
            return res.status(404).json({message: "not found"});
        }

    })  
}

export default chatList;