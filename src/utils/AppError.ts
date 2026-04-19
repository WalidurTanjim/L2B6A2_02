class AppError extends Error {
    public statusCode: number;
    public status: string;
    public isOperational: boolean;
    public errorCode?: string;
    public details?: unknown;

    constructor(message: string, statusCode: number, errorCode?: string, details?: any) {
        super(message);

        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
        this.isOperational = true;

        if(errorCode !== undefined) {
            this.errorCode = errorCode;
        }
        
        if(details !== undefined) {
            this.details = details;
        }

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;