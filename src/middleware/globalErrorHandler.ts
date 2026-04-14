import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // default value (unknown error)
    let statusCode = 500;
    let message = "Something went wrong!";

    // AppError (custom error - safe)
    if(err instanceof AppError) {
        statusCode: err?.statusCode;
        message: err?.message;
    }

    // Dev mode (full error details)
    if(process.env.NODE_ENV === "development") {
        return res.status(statusCode).json({
            success: false,
            message,
            error: err,
            stack: err?.stack
        })
    }

    // Production mode (safe response)
    return res.status(statusCode).json({
        success: false,
        message
    })
}

export default globalErrorHandler;