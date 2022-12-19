import {Express, Response, NextFunction } from "express";
import { isDefaultClause } from "typescript";
import detailModel from "../../../models/user_details";


const findUser = async (req: any, res: Response, next: NextFunction) => {
    const username = req.body.username;

    const user = await detailModel.find({username});

    if (!user){
        return res.status(404);
    }

    let resp: String [] = [];

    user.map(x => {
        resp.push(x.username);
    })

    console.log(resp);

    res.status(200).json({search: resp});
};


export default findUser;