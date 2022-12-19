import { Request, Response, NextFunction } from "express";
import userModel from "../../../models/users";


const logout = async (req: any, res: Response, next: NextFunction) => {
    // if (req.session.email) {
    //     req.session.destroy((err: any) => {
    //         if (err) {
    //             return res.status(400).send('Unable to log out')
    //         } else {
    //             return res.status(200).json({message: 'Logout successful'})
    //         }
    //     });
    // } else {
    //     return res.status(404)
    // }

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt

    // Is refreshToken in db? 
    let user = await userModel.findOne({refreshToken}).exec();

    if (!user) {
        res.clearCookie("jwt", {httpOnly: true, sameSite: "none", secure: true});
        return res.sendStatus(204)        
    }

    // delete the refresh token 
    user.refreshToken = "";
    const result = await user.save();

    res.clearCookie("jwt", {httpOnly: true, sameSite: "none", secure: true})
    res.sendStatus(204);
}

export default logout;