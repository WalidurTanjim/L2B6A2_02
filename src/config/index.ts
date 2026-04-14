import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
    PORT: process.env.PORT,
    PG_CONNECTIN_STRING: process.env.PG_CONNECTIN_STRING
};

export default config;