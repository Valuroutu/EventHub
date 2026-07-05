import express from "express";

import {
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
    getAllBookings,
    payBooking,
    downloadTicket
} from "../controllers/bookingController.js";

import {
    protect,
    authorize
} from "../middleware/authMiddleware.js";

const router = express.Router();

/*
    User Routes
*/

// Create Booking
router.post(
    "/",
    protect,
    createBooking
);

// Logged-in User Booking History
router.get(
    "/my-bookings",
    protect,
    getMyBookings
);

// Pay for a Booking (simulated payment)
router.put(
    "/:id/pay",
    protect,
    payBooking
);

// Download Ticket PDF
router.get(
    "/:id/ticket",
    protect,
    downloadTicket
);

// Get Single Booking
router.get(
    "/:id",
    protect,
    getBookingById
);

// Cancel Booking
router.put(
    "/:id/cancel",
    protect,
    cancelBooking
);

/*
    Admin / Organizer Routes
*/

// View All Bookings
router.get(
    "/",
    protect,
    authorize("admin", "organizer"),
    getAllBookings
);

export default router;