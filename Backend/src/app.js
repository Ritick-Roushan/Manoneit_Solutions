import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import { errorHandler } from "./middlewares/errorhandler.js";

const app = express();

// Middleware setup
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true
}));

// Multer Setup for parsing multipart/form-data
const upload = multer();
app.use(upload.none());  // Parses multipart form-data (text fields only)

// Express middlewares
app.use(express.json({ limit: "16kb" }));  // Parses JSON payloads
app.use(express.urlencoded({ extended: true, limit: "16kb" }));  // Parses form-urlencoded
app.use(cookieParser());
app.use(express.static("public"));

// Routes
import userRouter from './routes/user.routes.js';
app.use("/api/v1/users", userRouter);
app.use(errorHandler);

export { app };
