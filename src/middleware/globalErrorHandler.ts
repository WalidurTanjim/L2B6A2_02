import { NextFunction, Request, Response } from "express";
import handlePostgresError from "../utils/PostgresError";
import AppError from "../utils/AppError";

const sendErrorDev = (err: any, res: Response) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message,
        error: err,
        stack: err.stack
    })
}

const sendErrorProd = (err: any, res: Response) => {
    if(err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errorCode: err.errorCode,
            details: err.details
        })
    }

    return res.status(500).json({
        success: false,
        message: "Something went wrong!"
    })
}

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("✅✅✅ err from global error handler:", err);
    console.log("✅✅✅ destructured err:", ...err);
    // let error = { ...err };
    let error = err;
    error.message = err.message;
    console.log("✅✅✅ error from err:", error);

    // PostgreSQL error
    if(err.code) {
        error = handlePostgresError(err);
    };

    // unknown error => AppError 
    if(!(error instanceof AppError)) {
        error = new AppError(error.message || "Internal Server Error", 500);
    };

    if(process.env.NODE_ENV === "development") {
        sendErrorDev(error, res);
    }else {
        sendErrorProd(error, res);
    }
};

export default globalErrorHandler;