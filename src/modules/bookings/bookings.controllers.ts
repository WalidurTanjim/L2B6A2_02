import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/AppError";
import { bookingsServices } from "./bookings.services";
import { JwtPayload } from "jsonwebtoken";

// createBooking
const createBooking = catchAsync(async(req: Request, res: Response) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;
    if(!customer_id) throw new AppError("Customer id is required", 400);
    if(!vehicle_id) throw new AppError("Vehicle id is required", 400);
    if(!rent_start_date) throw new AppError("Rent start date is required", 400);
    if(!rent_end_date) throw new AppError("Rent end date is required", 400);

    const booking = req.body;

    const result = await bookingsServices.createBooking(booking);
    const { booking: bookingInfo, updatedVehicle } = result
    const { vehicle_name, daily_rent_price} = updatedVehicle;

    res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: {
            ...bookingInfo, 
            "vehicle": {
                vehicle_name,
                daily_rent_price
            }
        }
    })
})

// getBookings
const getBookings = catchAsync(async(req: Request, res: Response) => {
    const user = req?.user;

    const result = await bookingsServices.getBookings(user as JwtPayload);
    // console.log("All booking response from ctrl:", result);

    if(result.length === 0) {
        res.status(404).json({
            success: false,
            message: "Bookings not available",
            data: null
        })
    }else {
        if(user?.role === "customer") {
            res.status(200).json({
                success: true,
                message: "Your bookings retrieved successfully",
                data: result
            })
        }else {
            res.status(200).json({
                success: true,
                message: "Bookings retrieved successfully",
                data: result
            })
        }
    }
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

// updateBookingById
const updateBookingById = catchAsync(async(req: Request, res: Response) => {
    const { bookingId } = req.params;
    const { status } = req.body;
    const user = req.user;

    if(!['cancelled', 'returned'].includes(status)) throw new AppError("Invalid status", 400);

    if(user?.role === "customer" && status === "returned") throw new AppError("Customers can't return booking", 403);

    const result = await bookingsServices.updateBookingById(status, bookingId as string);

    // console.log("✔✔ Update booking status res from ctrl:", result);
    const { booking, vehicle } = result;

    if(booking.status === "cancelled") {
        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            data: booking
        })
    }else {
        res.status(200).json({
            success: true,
            message: "Booking marked as returned, Vehicle is now available",
            data: {
                ...booking,
                "vehicle": {
                    "availability_status": vehicle?.availability_status
                }
            }
        })
    }
})

export const bookingsControllers = {
    createBooking,
    getBookings,
    getBookingById,
    updateBookingById
}