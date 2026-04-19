import express from "express";
import { vehiclesControllers } from "./vehicles.controllers";

const route = express.Router();

// POST method
route.post("/", vehiclesControllers.createVehicle);

// GET method
route.get("/", vehiclesControllers.getVehicles);
route.get("/:vehicleId", vehiclesControllers.getVehicleById);

export const vheiclesRoute = route;