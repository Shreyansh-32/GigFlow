import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface AuthRequest extends Request{
    user? : any
};

const protect = async(req : AuthRequest, res : Response, next : NextFunction) => {
    let token;
    token = req.cookies.jwt;

    if(token){
        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch (error) {
            res.status(401).json({message : "Not authorized, Invalid token"});
        }
    }
    else{
        res.status(401).json({message:"Not authorized, no token"});
    }
}

export {protect};