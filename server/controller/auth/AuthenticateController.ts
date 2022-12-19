import {Express, Response, NextFunction } from "express";
import userModel from "../../models/users";
const jwt = require("jsonwebtoken")
require("dotenv").config();

const Authenticate = async (req: any, res: Response, next: NextFunction) => {
    // if (req.session.email){
    //     const user = await userModel.findOne({email: req.session.email});
    //     if (!user){
    //         console.log("what's wrong");
    //         return res.status(404).json({message: "not found"});
    //     }        
    //     next();
    // }else{
    //     return res.status(404).json({message: "not found"});
    // }

    
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt

    const user = await userModel.findOne({refreshToken}).exec();

    if (!user) return res.sendStatus(403)

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err: any, decoded: any) => {
            if (err || user.email !== decoded.email) return res.sendStatus(403)
            req.email = user.email;
            next()
        }
    )

};


export default Authenticate;