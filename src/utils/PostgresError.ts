import AppError from "./AppError"

const handlePostgresError = (err: any) => {
    console.log("Postgres error: ", err)
    // unique violation
    if(err.code === "23505") {
        return new AppError("Duplicate value violates unique constraint", 409, "DUPLICATE");
    };

    if(err.code === "23503") {
        return new AppError("Invalid reference (foreign key violation)", 400, "FOREIGN_KEY");
    };

    if(err.code === "23502") {
        return new AppError("Missing required field", 400, "NOT_NULL");
    };

    if(err.code === "22P02") {
        return new AppError("Invalid input syntax", 400, "INVALID_INPUT");
    };

    if(err.code === "23514") {
        return new AppError("Invalid data violates constraint", 400);
    }

    return new AppError("Database error", 500);
};

export default handlePostgresError;