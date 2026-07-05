import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
    res.send("Welcome to EventHub API");
});

app.use("/api/auth", authRoutes);

app.use("/api/events", eventRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/upload", uploadRoutes);

// Multer / general error handler
app.use((err, req, res, next) => {

    if (err) {
        return res.status(400).json({
            message: err.message || "Something went wrong"
        });
    }

    next();

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server Running on Port ${PORT}`);
});