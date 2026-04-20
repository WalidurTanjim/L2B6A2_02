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

// deleteVehicleById
const deleteVehicleById = async(id: string) => {
    // find vehicle is this exist or not
    const vehicleRes = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
    if(!vehicleRes) throw new AppError("Vehicel not found!", 404)

    // find booking with vehicle_id
    const bookingRes = await pool.query(`SELECT * FROM bookings WHERE vehicle_id=$1`, [id]);

    if(bookingRes.rows.length > 0) {
        for(let booking of bookingRes.rows) {
            // check is their any active booking or not
            if(booking.status === 'active')
                throw new AppError("Can't delete this vahicle. It has active booking", 409);
        }
    }

    const result = await pool.query(`DELETE FROM vehicles WHERE id=$1 RETURNING *`, [id]);
    if(result.rowCount === 0) throw new AppError("Vehicle not found!", 404);

    const vehicle = result.rows[0];
    return vehicle;
}

// updateVehicleById
const updateVehicleById = async(payload: Vehicle, id: string) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

    const result = await pool.query(`UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status, id]);

    if(result.rowCount === 0) throw new AppError("Vehicle not found!", 404);
    
    const vehicle = result.rows[0];
    return vehicle;
}

export const vehiclesServices = {
    createVehicle,
    getVehicles,
    getVehicleById,
    deleteVehicleById,
    updateVehicleById
}