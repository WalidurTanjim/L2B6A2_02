import config from "../../config";
import { pool } from "../../config/db";
import { LoginUser } from "../../types/user"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

// loginUser
const loginUser = async(payload: LoginUser) => {
    const { email, password } = payload;

    // find user with this email
    const findUserToDB = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
    const userRes = findUserToDB.rows[0];
    if(!userRes) return null;

    // matched password
    const isPasswordMatched = await bcrypt.compare(password, userRes.password);
    if(!isPasswordMatched) return false;
    
    const { password: userPassword, ...user } = userRes;

    // user info for token
    const userInfoForToken = { name: userRes.name, email: userRes.email, role: userRes.role };

    // generate token
    const token = jwt.sign(userInfoForToken, config.TOKEN_SECRET as string, { expiresIn: '7d' });

    return { token, user };
}

export const authServices = {
    loginUser
}