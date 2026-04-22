import { pool } from "../../config/db";
import { UpdateUser, User } from "../../types/user";
import bcrypt from "bcryptjs";
import AppError from "../../utils/AppError";
import { JwtPayload } from "jsonwebtoken";

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

// updateUserById
const updateUserById = async(payload: UpdateUser, id: string, user: JwtPayload) => {
    const { email: loggedInEmail, role: loggedInRole } = user;

    // customer can't change role
    if(loggedInRole === "customer" && payload?.role) throw new AppError("You are not allowed to change role", 403);

    // find user by id
    const findUserRes = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);

    if(findUserRes.rowCount === 0) throw new AppError("User not found!", 404);

    const targetUser = findUserRes.rows[0];

    // customer can update only own profile
    if(loggedInRole === "customer" && targetUser.email !== loggedInEmail) throw new AppError("Unauthorized access", 403);

    // dynamic fields
    const fields: string[] = [];
    const values: any[] = [];
    let count = 1;

    for(const key in payload) {
        const value = payload[key as keyof UpdateUser];

        if(value !== undefined) {
            fields.push(`${key}=$${count}`);
            values.push(value);
            count++;
        }
    }

    if(fields.length === 0) throw new AppError("No fields provided to update", 404);

    const query = `UPDATE users SET ${fields.join(", ")} WHERE id=$${count} RETURNING id, name, email, phone, role`;
    values.push(id);

    try{
        const result = await pool.query(query, values);
        return result.rows[0]
    }catch(err: any) {
        throw err;
    }
}

export const usersServices = {
    createUser,
    getUsers,
    getUserById,
    deleteUserById,
    updateUserById
}