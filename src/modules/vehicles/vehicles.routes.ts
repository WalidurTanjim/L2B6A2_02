import express from "express";
import { vehiclesControllers } from "./vehicles.controllers";
import auth from "../../middleware/auth";

const route = express.Router();

// POST method
route.post("/", auth("admin"), vehiclesControllers.createVehicle);

// GET method
route.get("/", vehiclesControllers.getVehicles);
route.get("/:vehicleId", vehiclesControllers.getVehicleById);

// DELETE method
route.delete('/:vehicleId', vehiclesControllers.deleteVehicleById);

// PUT method
route.put("/:vehicleId", vehiclesControllers.updateVehicleById);

export const vheiclesRoute = route;