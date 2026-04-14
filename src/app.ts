import express, { Request, Response } from "express";
import initDB from "./config/db";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app = express();

// parser
app.use(express.json());

// database initialized
initDB();

// route for test
app.get("/", (req: Request, res: Response) => {
    res.send("Next Level Development B6A2_02");
})

// 404 not found route
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path
    });
});

// globalErrorHandler
app.use(globalErrorHandler);

export default app;