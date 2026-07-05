import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import QRCode from "qrcode";
import PDFDocument from "pdfkit";

/*
    Create Booking
    POST /api/bookings
*/
export const createBooking = async (req, res) => {

    try {

        const { eventId, tickets } = req.body;

        const event = await Event.findById(eventId);

        if (!event) {

            return res.status(404).json({
                success: false,
                message: "Event not found"
            });

        }

        if (event.availableSeats < tickets) {

            return res.status(400).json({
                success: false,
                message: "Not enough seats available"
            });

        }

        const totalAmount = event.price * tickets;

        const booking = await Booking.create({

            user: req.user._id,

            event: event._id,

            tickets,

            totalAmount,

            bookingStatus: "Confirmed",

            paymentStatus: "Pending",

            paymentMethod: "Online"

        });

        event.availableSeats -= tickets;

        await event.save();

        const populatedBooking = await Booking.findById(booking._id)

            .populate("user", "name email")

            .populate("event");

        res.status(201).json({

            success: true,

            message: "Booking successful",

            booking: populatedBooking

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/*
    Get Logged In User Bookings
    GET /api/bookings/my-bookings
*/

export const getMyBookings = async (req, res) => {

    try {

        const bookings = await Booking.find({

            user: req.user._id

        })

            .populate("event")

            .sort({

                createdAt: -1

            });

        res.status(200).json({

            success: true,

            count: bookings.length,

            bookings

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/*
    Get Single Booking
    GET /api/bookings/:id
*/

export const getBookingById = async (req, res) => {

    try {

        const booking = await Booking.findById(req.params.id)

            .populate("user", "name email")

            .populate("event");

        if (!booking) {

            return res.status(404).json({

                success: false,

                message: "Booking not found"

            });

        }

        res.status(200).json({

            success: true,

            booking

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/*
    Cancel Booking
    PUT /api/bookings/:id/cancel
*/

export const cancelBooking = async (req, res) => {

    try {

        const booking = await Booking.findById(req.params.id);

        if (!booking) {

            return res.status(404).json({

                success: false,

                message: "Booking not found"

            });

        }

        if (booking.bookingStatus === "Cancelled") {

            return res.status(400).json({

                success: false,

                message: "Booking already cancelled"

            });

        }

        const event = await Event.findById(booking.event);

        event.availableSeats += booking.tickets;

        await event.save();

        booking.bookingStatus = "Cancelled";

        await booking.save();

        res.status(200).json({

            success: true,

            message: "Booking cancelled successfully",

            booking

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/*
    Organizer/Admin
    View All Bookings
    GET /api/bookings
*/

export const getAllBookings = async (req, res) => {

    try {

        const bookings = await Booking.find()

            .populate("user", "name email")

            .populate("event")

            .sort({

                createdAt: -1

            });

        res.status(200).json({

            success: true,

            count: bookings.length,

            bookings

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/*
    Simulate Payment for a Booking
    PUT /api/bookings/:id/pay

    NOTE: This simulates a successful payment. To integrate a real
    gateway (Razorpay, Stripe, etc.), replace the body of this function
    with the gateway's payment-verification logic, then keep the same
    QR-generation code below on success.
*/

export const payBooking = async (req, res) => {

    try {

        const booking = await Booking.findById(req.params.id);

        if (!booking) {

            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });

        }

        if (booking.user.toString() !== req.user._id.toString()) {

            return res.status(403).json({
                success: false,
                message: "Access Denied"
            });

        }

        if (booking.bookingStatus === "Cancelled") {

            return res.status(400).json({
                success: false,
                message: "Cannot pay for a cancelled booking"
            });

        }

        if (booking.paymentStatus === "Paid") {

            return res.status(400).json({
                success: false,
                message: "Booking already paid"
            });

        }

        // Simulated transaction id (swap for real gateway's transaction id)
        const transactionId = `SIM-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

        // Generate a QR code that encodes the booking id, so it can be
        // scanned at the event entrance to look up the booking.
        const qrPayload = JSON.stringify({
            bookingId: booking._id.toString(),
            eventId: booking.event.toString()
        });

        const qrCode = await QRCode.toDataURL(qrPayload);

        booking.paymentStatus = "Paid";
        booking.transactionId = transactionId;
        booking.qrCode = qrCode;

        await booking.save();

        const populatedBooking = await Booking.findById(booking._id)
            .populate("user", "name email")
            .populate("event");

        res.status(200).json({
            success: true,
            message: "Payment successful",
            booking: populatedBooking
        });

    }

    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


/*
    Download Ticket as PDF
    GET /api/bookings/:id/ticket
*/

export const downloadTicket = async (req, res) => {

    try {

        const booking = await Booking.findById(req.params.id)
            .populate("user", "name email")
            .populate("event");

        if (!booking) {

            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });

        }

        if (booking.user._id.toString() !== req.user._id.toString()) {

            return res.status(403).json({
                success: false,
                message: "Access Denied"
            });

        }

        if (booking.paymentStatus !== "Paid") {

            return res.status(400).json({
                success: false,
                message: "Ticket is only available after payment is complete"
            });

        }

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=ticket-${booking._id}.pdf`
        );

        const doc = new PDFDocument({ size: "A5", margin: 40 });

        doc.pipe(res);

        doc.fontSize(22).text("EventHub Ticket", { align: "center" });
        doc.moveDown();

        doc.fontSize(16).text(booking.event.title, { align: "center" });
        doc.moveDown();

        doc.fontSize(12);
        doc.text(`Attendee: ${booking.user.name}`);
        doc.text(`Email: ${booking.user.email}`);
        doc.text(`Location: ${booking.event.location}`);
        doc.text(`Date: ${new Date(booking.event.date).toLocaleDateString()}`);
        doc.text(`Tickets: ${booking.tickets}`);
        doc.text(`Amount Paid: Rs. ${booking.totalAmount}`);
        doc.text(`Booking ID: ${booking._id}`);
        doc.text(`Transaction ID: ${booking.transactionId}`);

        doc.moveDown();

        if (booking.qrCode) {

            const base64Data = booking.qrCode.split(",")[1];
            const qrBuffer = Buffer.from(base64Data, "base64");

            doc.image(qrBuffer, {
                fit: [150, 150],
                align: "center"
            });

        }

        doc.moveDown();
        doc.fontSize(10).text(
            "Present this ticket (digital or printed) at the entrance.",
            { align: "center" }
        );

        doc.end();

    }

    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};