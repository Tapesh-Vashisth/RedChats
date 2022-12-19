import { Express, Response, NextFunction } from "express";
import detailModel from "../../../models/user_details";
import userModel from "../../../models/users";

const getRequests = async (req: any, res: Response, next: NextFunction) => {
    const user = await userModel.findOne({email: req.email}, {password: 0});
    
    if (!user){
        return res.status(404).json({message: "not found"});
    }

    const detail = await detailModel.findOne({username: user.username}, {chatRooms: 0});

    if (!detail){
        return res.status(404).json({message: "details not found"});
    }

    const resp = {Requests: detail.Requests};

    return res.status(200).json(resp);
}

export default getRequests;