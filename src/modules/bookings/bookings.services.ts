import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";
import { Booking, UpdateBooking } from "../../types/booking"
import AppError from "../../utils/AppError";

// createBooking 
const createBooking = async(payload: Booking) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    // find user with customer_id
    const findUser = await pool.query(`SELECT * FROM users WHERE id=$1`, [customer_id]);
    if(findUser.rows.length < 1) throw new AppError("User not found!", 404);

    // date validation (start date must be greater than or equal today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(rent_start_date);

    if(startDate < today) throw new AppError("Start date must be greater than or equal today", 400);

    // date validation (end date must be greater than start date)
    if(new Date(rent_end_date) <= new Date(rent_start_date)) throw new AppError("End date must be greater than start date", 400);

    // get vehicle price
    const vehicleRes = await pool.query(`SELECT daily_rent_price FROM vehicles WHERE id=$1`, [vehicle_id]);

    if(vehicleRes.rowCount === 0) throw new AppError("Vehicle not found!", 404);

    const dailyRentPrice = vehicleRes.rows[0].daily_rent_price;

    // calculate days
    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);

    const differentTime = end.getTime() - start.getTime();
    const totalDays = Math.ceil(differentTime / (1000 * 60 * 60 * 24));

    // calculate total price
    const total_price = totalDays * dailyRentPrice;

    const result = await pool.query(`INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price) VALUES($1, $2, $3, $4, $5) RETURNING *`, [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]);

    const booking = result.rows[0];
    
    let updatedVehicle;

    if(booking) {
        const updateVehicleStatus = await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`, ['booked', vehicle_id]);
        updatedVehicle = updateVehicleStatus.rows[0];
    }
    
    return { booking, updatedVehicle };
}

// getBookings
const getBookings = async(user: JwtPayload) => {
    const { email } = user;
    // console.log("Req user from srv:", user);

    const client = await pool.connect();

    try{
        await client.query("BEGIN");

        // find user by email
        const findUserRes = await client.query(`SELECT * FROM users WHERE email=$1`, [email]);
        const userRes = findUserRes.rows[0];
        const { id, role } = userRes;
        // console.log("User from db:", userRes);

        // get bookings by role
        if(role === "admin") {
            const result = await client.query(`SELECT * FROM bookings`);
            const booking = result.rows;
            // console.log("Admin bookings:", booking);

            await client.query("COMMIT");
            return booking;
        }else{
            const result = await client.query(`SELECT * FROM bookings WHERE customer_id=$1`, [id]);
            const booking = result.rows;
            // console.log("Customer booking:", booking);

            await client.query("COMMIT");
            return booking;
        }
    }catch(err) {
        await client.query("ROLLBACK");
        throw err;
    }finally{
        client.release();
    }
}

// getBookingById
const getBookingById = async(id: string) => {
    const result = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [id]);

    if(result.rowCount === 0) throw new AppError("Booking not found!", 404);

    const booking = result.rows[0];
    return booking;
}

// updateBookingById
const updateBookingById = async(status: "cancelled" | "returned", id: string) => {
    const client = await pool.connect();

    try{
        await client.query('BEGIN');

        // find booking by id
        const bookingRes = await client.query(`SELECT * FROM bookings WHERE id=$1`, [id]);

        if(bookingRes.rows.length < 1) throw new AppError("Booking not found!", 404);

        const booking = bookingRes.rows[0];
        // console.log("⭕ Booking from booking srv:", booking);

        const { vehicle_id, rent_start_date, rent_end_date, status: bookingStatus } = booking;

        // find vehicle by vehicle_id from booking
        const vehicleRes = await client.query(`SELECT * FROM vehicles WHERE id=$1`, [booking.vehicle_id]);

        if(vehicleRes.rows.length < 1) throw new AppError("Vehicle not found", 404);

        const vehicle = vehicleRes.rows[0];
        // console.log("⭕ Vehicle from booking srv:", vehicle);

        // if status is "cancelled"
        if(status === "cancelled") {
            // is today greater than rent_start_date?
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const startDate = new Date(rent_start_date);
            if(today >= startDate) throw new AppError("Booking has been started. You can't cancel.", 400);
            
            if(bookingStatus === "cancelled") throw new AppError("Booking already cancelled", 400);

            if(bookingStatus === "returned") throw new AppError("Booking already returned. You can't change status", 400);

            const updateBookingStatusRes = await client.query(`UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`, [status, id]);
            
            // if(updateBookingStatusRes.rowCount === 0) throw new AppError("Booking data not found!", 404);
            const updateBookingStatus = updateBookingStatusRes.rows[0];
            // console.log("⭕ Update booking status:", updateBookingStatus);

            await client.query("COMMIT");

            return { 
                booking: updateBookingStatus, 
                vehicle: null
            };
        }

        // if status is "returned"
        if(status === "returned") {
            // check is this returned or not
            if(bookingStatus === "returned") {
                throw new AppError("Booking already returned. You can't change status", 400);
            }

            // check is this active or not
            if(bookingStatus === "active") {
                throw new AppError("Booking is active. You can't return this", 400);
            }

            const updateBookingStatusReturnRes = await client.query(`UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`, [status, id]);
            const updateBookingStatusReturn = updateBookingStatusReturnRes.rows[0];
            // console.log("✅ Update booking status return:", updateBookingStatusReturn);

            let updateVehicleAvailabilityStatusAvailable = null;

            if(updateBookingStatusReturn.status === "returned") {
                const updateVehicleAvailabilityStatusAvailableRes = await client.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`, ['available', vehicle_id]);
                updateVehicleAvailabilityStatusAvailable = updateVehicleAvailabilityStatusAvailableRes.rows[0];
                // console.log("✅ Update vehicle availability status available:", updateVehicleAvailabilityStatusAvailable);
            }

            await client.query("COMMIT");

            return { 
                booking: updateBookingStatusReturn,
                vehicle: updateVehicleAvailabilityStatusAvailable 
            };
        }

        throw new AppError("Invalid status", 400)
    }catch(err) {
        await client.query('ROLLBACK');
        throw err;
    }finally {
        client.release();
    }
}

export const bookingsServices = {
    createBooking,
    getBookings,
    getBookingById,
    updateBookingById
}