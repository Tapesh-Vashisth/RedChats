import {Express, Response, NextFunction } from "express";
import detailModel from "../../../models/user_details";
import relationModel from "../../../models/user_relations";

const addFriend = async (req: any, res: Response, next: NextFunction) => {
    let chatid = req.body.chatid;
    let to =  req.body.to;
    let from = req.body.from;

    const chat = await relationModel.findOne({chatroom: chatid});

    if (!chat) return res.sendStatus(404);

    if (chat?.maxStrength <= chat?.members.length) return res.sendStatus(507);

    let checkAlreadyMember = chat?.members.find((x) => {return x?.member?.username === to});

    if (checkAlreadyMember){
        return res.status(403).json({message: "already a member"});
    }

    if (!chat){
        return res.status(404).json({message: "chatroom doesn't exist"});
    }

    // checking if already requested 
    const requested = await detailModel.findOne({username: from});

    let decider = requested?.Requests.find((x) => {return x.chatroom === chatid});

    if (decider){
        return res.status(403).json({message: "already requested"});
    }

    const obj = {username: to, chatroom: chatid, flow: true};
    // changing the requestor 
    detailModel.findOneAndUpdate({username: from}, {$push: {Requests: obj}}, function(err: any){
        if (err){
            return res.status(500).json({message: "something went wrong"});
        }    
    })


    // changing the reciever 
    detailModel.findOneAndUpdate({username: to}, {$push: {Requests: {username: from, chatroom: chatid, flow: false}}}, function(err: any){
        if (err){
            return res.status(500).json({message: "something went wrong"});
        }
    })

    return res.status(200).json({message: "success"});
};


export default addFriend;