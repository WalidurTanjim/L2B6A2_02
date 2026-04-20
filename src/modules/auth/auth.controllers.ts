import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/AppError";
import { authServices } from "./auth.services";

// loginUser
const loginUser = catchAsync(async(req: Request, res: Response) => {
    const { email, password } = req.body;
    if(!email) throw new AppError("Email is required", 400);
    if(!password) throw new AppError("Password is required", 400);
    const payload = req.body;
    
    const result = await authServices.loginUser(payload);
    if(result === null) throw new AppError("Invalid email", 401);
    if(result === false) throw new AppError("Invalid password", 401);
    const { token, user } = result;

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            token, user: user
        }
    })
})

export const authControllers = {
    loginUser
}