import express, { Request, Response } from "express";

const app = express();

// parser
app.use(express.json());

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

export default app;