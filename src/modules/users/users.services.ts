import { pool } from "../../config/db";
import { User } from "../../types/user";
import bcrypt from "bcryptjs";

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

export const usersServices = {
    createUser,
    getUsers,
}