import dotenv, { config } from "dotenv";
dotenv.config();
import express, { request, response } from "express";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";
import adminRoute from "./routes/adminRoute.js";
import customerRoute from "./routes/customerRoute.js";
import { mongoConnection } from "./models/connection.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
mongoConnection();

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS POLICY
app.use(cors());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (request, response) => {
    return response.status(234).send("Welcome to MERN Stack Book Store");
});

// Admin routes (password protected)
app.use("/admin", adminRoute);

// Customer routes (public)
app.use("/api", customerRoute);

app.listen(PORT, () => {
    console.log(`App listening on port http://localhost:${PORT}`);
});
