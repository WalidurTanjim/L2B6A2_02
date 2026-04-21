import express from "express";
import { bookingsControllers } from "./bookings.controllers";
import auth from "../../middleware/auth";

const route = express.Router();

// POST method
route.post('/', auth("admin", "customer"), bookingsControllers.createBooking);

// GET method
route.get('/', bookingsControllers.getBookings);
route.get('/:bookingId', bookingsControllers.getBookingById);

// PUT method
route.put('/:bookingId', auth("admin", "customer"), bookingsControllers.updateBookingById);

export const bookingsRoute = route;