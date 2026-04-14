import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
    connectionString: config.PG_CONNECTIN_STRING
})

// init db
const initDB = async() => {
    try{
        await pool.query("BEGIN");

        // users table
        await pool.query(`
                CREATE TABLE IF NOT EXISTS users(
                    id SERIAL NOT NULL,
                    name VARCHAR(150) NOT NULL,
                    email VARCHAR(200) UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    phone VARCHAR(15) NOT NULL,
                    role VARCHAR(10) NOT NULL
                )
            `);

        await pool.query("COMMIT");
    }catch(err: any) {
        await pool.query("ROLLBACK");

        console.error("Database not initialized!", err?.message)
    }
}

export default initDB;