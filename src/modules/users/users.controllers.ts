import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { usersServices } from "./users.services";
import AppError from "../../utils/AppError";

// createUser
const createUser = catchAsync(async(req: Request, res: Response) => {
    const { name, email, password, phone, role } = req.body;
    if(!name) throw new AppError("Name is required", 400);
    if(!email) throw new AppError("Email is required", 400);
    if(!password) throw new AppError("Password is required", 400);
    if(!phone) throw new AppError("Phone is required", 400);
    if(!role) throw new AppError("Role is required", 400);

    const user = { name, email, password, phone, role };
    const result = await usersServices.createUser(user);
    const { password: userPassword, ...rest } = await result;

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: rest
    })
})

export const usersControllers = {
    createUser,
}