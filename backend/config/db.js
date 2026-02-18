import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("DB is connected");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};