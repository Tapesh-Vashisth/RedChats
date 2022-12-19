import { Request, Response, NextFunction } from "express";
const bcrypt = require("bcrypt");
import userModel from "../../../models/users";
import detailModel from "../../../models/user_details";
const jwt = require("jsonwebtoken")
require("dotenv").config()
const saltrounds = 10;

const signup = async (req: any, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    const check1 = await userModel.findOne({email: email});
    
    if (check1){
        return res.status(403).json({message: "user already exists"})
    }

    const check2 = await userModel.findOne({email: email, username: username});

    if (check2){
        return res.status(403).json({message: "user already exists"})
    }
    

    
    const refreshToken = jwt.sign(
        {email: email},
        process.env.REFRESH_TOKEN_SECRET, 
        {expiresIn: '1d'}
    )

    const user = await new userModel({email, username, password, refreshToken});
    user.password = await bcrypt.hash(password, saltrounds);
    await user.save(); 


    let resp = {username: user.username, email: user.email, active: user.active};
    // creating other corresponding models for that user 
    const details = await new detailModel({username, chatRooms: [], Requests: []});
    await details.save();
    
    res.cookie("jwt", refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})
    res.status(201).json(resp);
}

export default signup;