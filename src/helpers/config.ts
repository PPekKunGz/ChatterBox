import dotenv from "dotenv";

dotenv.config();

const { PORT, APP_JWT_SECRET } = process.env;

export const config = {
    PORT,
    APP_JWT_SECRET
};