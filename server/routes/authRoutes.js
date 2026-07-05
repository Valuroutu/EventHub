import express from "express";

import {

registerUser,

loginUser,

getAllUsers,

updateUserRole,

deleteUser

} from "../controllers/authController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

// Admin Only
router.get("/users", protect, authorize("admin"), getAllUsers);

router.put("/users/:id/role", protect, authorize("admin"), updateUserRole);

router.delete("/users/:id", protect, authorize("admin"), deleteUser);

export default router;