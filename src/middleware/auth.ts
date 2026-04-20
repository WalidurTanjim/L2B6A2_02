import { NextFunction, Request, Response } from "express"
import catchAsync from "../utils/catchAsync"
import AppError from "../utils/AppError";
import config from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";

const auth = (...roles: string[]) => {
    return catchAsync(async(req: Request, res: Response, next: NextFunction) => {
        console.log("⭕⭕⭕ Roles:", roles);
        const authHeader = req.headers.authorization;
        if(!authHeader) throw new AppError("Forbidden access", 403);

        if(!authHeader.startsWith('Bearar ')) throw new AppError("Invaid token format", 401);

        const token = authHeader.split(' ')[1];

        // verify token
        const secret = config.TOKEN_SECRET;
        const decoded = jwt.verify(token as string, secret as string) as JwtPayload;
        console.log("⭕⭕⭕ Decoded:", decoded);
        req.user = decoded;

        // checking role
        if(roles.length && !roles.includes(decoded.role)) throw new AppError("Unauthorized access", 401);

        next();
    })
}

export default auth;