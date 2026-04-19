import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { usersServices } from "./users.services";
import AppError from "../../utils/AppError";

// createUser
const createUser = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
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

// getUsers
const getUsers = catchAsync(async(req: Request, res: Response) => {
    const result = await usersServices.getUsers();

    if(result.length > 0) {
        res.status(200).json({
            success: true,
            message: "User retrived successfully",
            data: result
        })
    }else {
        res.status(404).json({
            success: false,
            message: "User not available",
            data: null
        })
    }
})

// getUserById
const getUserById = catchAsync(async(req: Request, res: Response) => {
    const { userId } = req.params;

    const result = await usersServices.getUserById(userId as string);
    
    res.status(200).json({
        success: true,
        message: "User retrived successfully",
        data: result
    })
})

export const usersControllers = {
    createUser,
    getUsers,
    getUserById,
}