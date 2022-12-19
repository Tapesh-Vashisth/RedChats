import {Response, NextFunction} from "express";
import userModel from "../../models/users";
import chatModel from "../../models/chats";
import relationModel from "../../models/user_relations";
import { memberModel } from "../../models/user_relations";
import detailModel from "../../models/user_details";

const findAdminRooms = async (req: any, res: Response, next: NextFunction) => {
    const username = req.body.username;
    const userDetail = await detailModel.findOne({username});

    if (!userDetail){
        return res.status(404).json({message: "not found"});
    }

    let resp: (String | undefined) [] = [];
    let counter = 0;
    userDetail.chatRooms.map(async (x) => {
        let relation = await relationModel.findOne({chatroom: x.chatroom});
        
        for (let i = 0; i < relation?.members.length!; i++){
            const element = relation?.members[i];
            if (element?.member?.username === username && element?.member?.role === "admin"){
                resp.push(x.chatroom);
            }
        }

        counter++;

        if (counter === userDetail.chatRooms.length){
            return res.status(200).json({adminRooms: resp});
        }   
    })
}

export default findAdminRooms;