import express from "express";
import { bookingsControllers } from "./bookings.controllers";

const route = express.Router();

// POST method
route.post('/', bookingsControllers.createBooking);

// GET method
route.get('/', bookingsControllers.getBookings);

export const bookingsRoute = route;