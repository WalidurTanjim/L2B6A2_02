import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { vehiclesServices } from "./vehicles.services";

// createVehicle 
const createVehicle = catchAsync(async(req: Request, res: Response) => {
    const vehicle = req.body;

    const result = await vehiclesServices.createVehicle(vehicle);

    res.status(201).json({
        success: true,
        message: "Vehicle created successfully",
        data: result
    })
})

export const vehiclesControllers = {
    createVehicle,
}