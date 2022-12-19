import {Response, NextFunction} from "express";
import userModel from "../../models/users";
import chatModel from "../../models/chats";
import relationModel from "../../models/user_relations";
import { memberModel } from "../../models/user_relations";
import detailModel from "../../models/user_details";

const createRoom = async (req: any, res: Response, next: NextFunction) => {
    try {
        console.log(req.body);  
        const {username, chatroom, strength} = req.body;
        const room = await relationModel.findOne({chatroom: chatroom});
        if (room){
            return res.status(404).json({message: "room already exists"});
        }

        const member = await new memberModel({member: {username, role: "admin"}});
        const relation = await new relationModel({maxStrength: strength, members: [member], chatroom});
        const userDetail = await detailModel.findOne({username});
        if (!userDetail){
            return res.status(404).json({message: "detail not found"});
        }

        // adding the chatroom to the admin's record 
        await userDetail.updateOne({$push: {chatRooms: {chatroom}}});

        // create a chatroom
        const chat = await new chatModel({chatroom, messages: []});

        await relation.save();
        await chat.save();
        await userDetail.save();
        console.log("hmm")
        return res.status(200).json({message: "all good"});
    } catch (err: any) {
        console.log(err);
    }
}

export default createRoom;