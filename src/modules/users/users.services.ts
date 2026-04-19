import { pool } from "../../config/db";
import { User } from "../../types/user";
import bcrypt from "bcryptjs";
import AppError from "../../utils/AppError";

// createUser
const createUser = async(payload: User) => {
    const { name, email, password, phone, role } = payload;

    // hash password using bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(`INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`, [name, email, hashedPassword, phone, role]);

    const user = result.rows[0];
    return user;
}

// getUsers 
const getUsers = async() => {
    const result = await pool.query(`SELECT * FROM users`);
    const users = result.rows;
    return users;
}

// getUserById
const getUserById = async(id: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);

    if(result.rowCount === 0) throw new AppError("User not found!", 404);
    
    const user = result.rows[0];
    return user;
}

// deleteUserById
const deleteUserById = async(id: string) => {
    const result = await pool.query(`DELETE FROM users WHERE id=$1 RETURNING *`, [id]);

    if(result.rowCount === 0) throw new AppError("User not found!", 404);

    const user = result.rows[0];
    return user;
}

export const usersServices = {
    createUser,
    getUsers,
    getUserById,
    deleteUserById,
}