import { pool } from "../../config/db";
import { Booking, UpdateBooking } from "../../types/booking"
import AppError from "../../utils/AppError";

// createBooking 
const createBooking = async(payload: Booking) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    // date validation 
    if(new Date(rent_end_date) <= new Date(rent_start_date)) throw new AppError("End date must be greater than start date", 400);

    // get vehicle price
    const vehicleRes = await pool.query(`SELECT daily_rent_price FROM vehicles WHERE id=$1`, [vehicle_id]);

    if(vehicleRes.rowCount === 0) throw new AppError("Vehicle not found!", 404);

    const dailyRentPrice = vehicleRes.rows[0].daily_rent_price;

    // calculate days
    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);
    console.log("Start & end date:", start, end);

    const differentTime = end.getTime() - start.getTime();
    const totalDays = Math.ceil(differentTime / (1000 * 60 * 60 * 24));

    // calculate total price
    const total_price = totalDays * dailyRentPrice;

    const result = await pool.query(`INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price) VALUES($1, $2, $3, $4, $5) RETURNING *`, [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]);

    const booking = result.rows[0];
    return booking;
}

// getBookings
const getBookings = async() => {
    const result = await pool.query(`SELECT * FROM bookings`);

    if(result.rows.length === 0) throw new AppError("No booking available", 400);

    const booking = result.rows;
    return booking;
}

// getBookingById
const getBookingById = async(id: string) => {
    const result = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [id]);

    if(result.rowCount === 0) throw new AppError("Booking not found!", 404);

    const booking = result.rows[0];
    return booking;
}

// updateBookingById
const updateBookingById = async(status: UpdateBooking, id: string) => {
    const result = await pool.query(`UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`, [status, id]);

    if(result.rowCount === 0) throw new AppError("Booking not found!", 404);

    const booking = result.rows[0];
    return booking;
}

export const bookingsServices = {
    createBooking,
    getBookings,
    getBookingById,
    updateBookingById
}