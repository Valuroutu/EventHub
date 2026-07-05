import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
    Upload Event Image
    POST /api/upload
*/
router.post(
    "/",
    protect,
    authorize("organizer", "admin"),
    upload.single("image"),
    (req, res) => {

        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        res.status(201).json({
            imageUrl
        });

    }
);

export default router;
