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

// getBookings
const getBookings = catchAsync(async(req: Request, res: Response) => {
    const result = await bookingsServices.getBookings();

    if(result.length === 0) {
        res.status(404).json({
            success: false,
            message: "Bookings not available",
            data: null
        })
    }else res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully",
        data: result
    })
})

// getBookingById
const getBookingById = catchAsync(async(req: Request, res: Response) => {
    const { bookingId } = req.params;

    const result = await bookingsServices.getBookingById(bookingId as string);

    res.status(200).json({
        success: true,
        message: "Booking retrieved successfully",
        data: result
    })
})

// deleteBookingById
const deleteBookingById = catchAsync(async(req: Request, res: Response) => {
    const { bookingId } = req.params;

    await bookingsServices.deleteBookingById(bookingId as string);

    res.status(200).json({
        success: true,
        message: "Booking deleted successfully"
    })
})

export const bookingsControllers = {
    createBooking,
    getBookings,
    getBookingById,
    deleteBookingById,
}