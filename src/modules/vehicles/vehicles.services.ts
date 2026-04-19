import { pool } from "../../config/db"
import { Vehicle } from "../../types/vehicle"
import AppError from "../../utils/AppError";

// createVehicle
const createVehicle = async(payload: Vehicle) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

    const result = await pool.query(`INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status]);

    const vehicle = result.rows[0]
    return vehicle
}

// getVehicles
const getVehicles = async() => {
    const result = await pool.query(`SELECT * FROM vehicles`);

    if(result.rows.length === 0) throw new AppError("Vehicles not found!", 404);

    const vehicles = result.rows;
    return vehicles;
}

// getVehicleById
const getVehicleById = async(id: string) => {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);

    if(result.rowCount === 0) throw new AppError("Vehicle not found!", 404);

    const vehicles = result.rows;
    return vehicles
}

export const vehiclesServices = {
    createVehicle,
    getVehicles,
    getVehicleById,
}