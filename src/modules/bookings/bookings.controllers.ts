import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/AppError";
import { bookingsServices } from "./bookings.services";

// createBooking
const createBooking = catchAsync(async(req: Request, res: Response) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;
    if(!customer_id) throw new AppError("Customer id is required", 400);
    if(!vehicle_id) throw new AppError("Vehicle id is required", 400);
    if(!rent_start_date) throw new AppError("Rent start date is required", 400);
    if(!rent_end_date) throw new AppError("Rent end date is required", 400);

    const booking = req.body;

    const result = await bookingsServices.createBooking(booking);

    res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: result
    })
})

export const bookingsControllers = {
    createBooking,
}