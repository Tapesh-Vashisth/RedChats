import { Request, Response, NextFunction } from "express";
import userModel from "../../../models/users";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const saltrounds = 10;

const login = async (req: any, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;

    let user = await userModel.findOne({email: email});
    
    if (!user){
        return res.status(404).json({message: "user doesn't exists"});
    }

    let decider = await bcrypt.compare(password, user?.password);
    
    if (!decider){
        return res.status(404).json({message: "wrong password"});
    }
    
    // if(!req.session.email){
    //     req.session.email = resp.email;
    // }

    // create jwt 

    const refreshtoken = jwt.sign(
        {email: user.email},
        process.env.REFRESH_TOKEN_SECRET, 
        {expiresIn: '1d'}
    )
        
    let resp = {username: user.username, email: user.email, active: user.active};

    // save the refresh token of the user in the database 
    user.refreshToken = refreshtoken;
    await user.save();

    res.cookie("jwt", refreshtoken, {httpOnly: true, sameSite: "none", secure: true, maxAge: 24 * 60 * 60 * 1000})
    res.status(200).json(resp);
}

export default login;