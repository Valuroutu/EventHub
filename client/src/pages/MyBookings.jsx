import { useEffect, useState } from "react";
import api from "../services/api";
import resolveImage from "../utils/resolveImage";
import "./MyBookings.css";

export default function MyBookings() {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [payingId, setPayingId] = useState(null);
    const [downloadingId, setDownloadingId] = useState(null);

    useEffect(() => {

        fetchBookings();

    }, []);

    const fetchBookings = async () => {

        try {

            const res = await api.get("/bookings/my-bookings");

            setBookings(res.data.bookings);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    const handleCancel = async (id) => {

        if (!window.confirm("Cancel this booking?")) return;

        try {

            await api.put(`/bookings/${id}/cancel`);

            fetchBookings();

        } catch (error) {

            alert(error.response?.data?.message || "Cancel failed");

        }

    };

    const handlePay = async (id) => {

        setPayingId(id);

        try {

            // NOTE: this simulates a successful payment. Swap this call
            // for your real payment gateway's checkout + verification
            // flow, then keep hitting the same /pay endpoint on success.
            await api.put(`/bookings/${id}/pay`);

            fetchBookings();

        } catch (error) {

            alert(error.response?.data?.message || "Payment failed");

        } finally {

            setPayingId(null);

        }

    };

    const handleDownloadTicket = async (id) => {

        setDownloadingId(id);

        try {

            const res = await api.get(`/bookings/${id}/ticket`, {
                responseType: "blob"
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");

            link.href = url;
            link.setAttribute("download", `ticket-${id}.pdf`);

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            alert("Could not download ticket. Make sure the booking is paid.");

        } finally {

            setDownloadingId(null);

        }

    };

    if (loading) {

        return (
            <div className="loading">
                <h2>Loading Bookings...</h2>
            </div>
        );

    }

    return (

        <div className="my-bookings">

            <h1>My Bookings</h1>

            {

                bookings.length === 0 &&

                <p className="empty">You have no bookings yet.</p>

            }

            <div className="bookings-list">

                {bookings.map((b) => (

                    <div className="booking-card" key={b._id}>

                        <img
                            src={
                                resolveImage(
                                    b.event?.image,
                                    "https://via.placeholder.com/150x100?text=EventHub"
                                )
                            }
                            alt={b.event?.title}
                        />

                        <div className="booking-info">

                            <h3>{b.event?.title || "Event removed"}</h3>

                            <p>📍 {b.event?.location}</p>

                            <p>📅 {b.event?.date && new Date(b.event.date).toLocaleDateString()}</p>

                            <p>🎟 Tickets: {b.tickets}</p>

                            <p>💰 Total: ₹ {b.totalAmount}</p>

                            <p>
                                Booking:{" "}
                                <span className={`status ${b.bookingStatus.toLowerCase()}`}>
                                    {b.bookingStatus}
                                </span>
                                {"  "}
                                Payment:{" "}
                                <span className={`status ${b.paymentStatus.toLowerCase()}`}>
                                    {b.paymentStatus}
                                </span>
                            </p>

                            {

                                b.qrCode && b.paymentStatus === "Paid" &&

                                <img
                                    className="qr-preview"
                                    src={b.qrCode}
                                    alt="Booking QR Code"
                                />

                            }

                        </div>

                        <div className="booking-actions">

                            {

                                b.bookingStatus !== "Cancelled" && b.paymentStatus !== "Paid" &&

                                <button
                                    className="pay-btn"
                                    disabled={payingId === b._id}
                                    onClick={() => handlePay(b._id)}
                                >
                                    {payingId === b._id ? "Processing..." : "Pay Now"}
                                </button>

                            }

                            {

                                b.paymentStatus === "Paid" &&

                                <button
                                    className="download-btn"
                                    disabled={downloadingId === b._id}
                                    onClick={() => handleDownloadTicket(b._id)}
                                >
                                    {downloadingId === b._id ? "Preparing..." : "Download Ticket"}
                                </button>

                            }

                            {

                                b.bookingStatus !== "Cancelled" &&

                                <button
                                    className="cancel-btn"
                                    onClick={() => handleCancel(b._id)}
                                >
                                    Cancel Booking
                                </button>

                            }

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}
