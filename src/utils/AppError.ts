class AppError extends Error {
    public statusCode: number;
    public status: string;
    public isOperational: boolean;
    public errorCode?: string;
    public details?: string;

    constructor(message: string, statusCode: number, errorCode: string, details: string) {
        super(message);

        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
        this.isOperational = true;
        this.errorCode = errorCode;
        this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;