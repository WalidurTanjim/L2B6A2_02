import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { vehiclesServices } from "./vehicles.services";
import AppError from "../../utils/AppError";

// createVehicle 
const createVehicle = catchAsync(async(req: Request, res: Response) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;

    if(!vehicle_name) throw new AppError("Vehicle name is required", 400);
    if(!type) throw new AppError("Vehicle type is required", 400);
    if(!registration_number) throw new AppError("Registration number is required", 400);
    if(!daily_rent_price) throw new AppError("Daily rent price is required", 400);
    if(!availability_status) throw new AppError("Availability status is required", 400);

    const vehicle = req.body;
    const result = await vehiclesServices.createVehicle(vehicle);

    res.status(201).json({
        success: true,
        message: "Vehicle created successfully",
        data: result
    })
})

// getVehicles
const getVehicles = catchAsync(async(req: Request, res: Response) =>{
    const result = await vehiclesServices.getVehicles();
    res.status(200).json({
        success: true,
        message: "Vehicles retrieved successfully",
        data: result
    })
})

// getVehicleById
const getVehicleById = catchAsync(async(req: Request, res: Response) => {
    const { vehicleId } = req.params;

    const result = await vehiclesServices.getVehicleById(vehicleId as string);

    res.status(200).json({
        success: true,
        message: "Vehicle rtrived successfully",
        data: result
    })
})

// deleteVehicleById
const deleteVehicleById = catchAsync(async(req: Request, res: Response) => {
    const { vehicleId } = req.params;

    const result = await vehiclesServices.deleteVehicleById(vehicleId as string);

    res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully"
    })
})

// updateVehicleById
const updateVehicleById = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const { vehicleId } = req.params;
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;

    if(!vehicle_name) throw new AppError("Vehicle name is required", 400);
    if(!type) throw new AppError("Vehicle type is required", 400);
    if(!registration_number) throw new AppError("Registration number is required", 400);
    if(!daily_rent_price) throw new AppError("Daily rent price is required", 400);
    if(!availability_status) throw new AppError("Availability status is required", 400);

    const vehicle = req.body;

    const result = await vehiclesServices.updateVehicleById(vehicle, vehicleId as string);

    res.status(201).json({
        success: true,
        message: "Vehicle updated successfully",
        data: result
    })
})

export const vehiclesControllers = {
    createVehicle,
    getVehicles,
    getVehicleById,
    deleteVehicleById,
    updateVehicleById
}