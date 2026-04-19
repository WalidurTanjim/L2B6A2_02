import express from "express";
import { bookingsControllers } from "./bookings.controllers";

const route = express.Router();

// POST method
route.post('/', bookingsControllers.createBooking);

export const bookingsRoute = route;