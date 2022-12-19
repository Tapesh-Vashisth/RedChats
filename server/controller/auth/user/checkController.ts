import { Express, Response, NextFunction } from "express";
import userModel from "../../../models/users";

const check = async (req: any, res: Response, next: NextFunction) => {
    const user = await userModel.findOne({email: req.email}, {password: 0});
    if (user){
        res.status(200).json(user);
    }else{
        res.status(404).json({message: "not authenticated"});
    }
}

export default check;