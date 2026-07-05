import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import resolveImage from "../utils/resolveImage";
import "./EventDetails.css";

export default function EventDetails() {

    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState(1);
    const [booking, setBooking] = useState(false);

    useEffect(() => {

        fetchEvent();

    }, []);

    const handleBookNow = async () => {

        if (!user) {
            navigate("/login");
            return;
        }

        if (tickets < 1 || tickets > event.availableSeats) {
            alert("Please choose a valid number of tickets");
            return;
        }

        setBooking(true);

        try {

            await api.post("/bookings", {
                eventId: event._id,
                tickets: Number(tickets)
            });

            alert("Booking successful!");

            navigate("/my-bookings");

        } catch (error) {

            alert(error.response?.data?.message || "Booking failed");

        } finally {

            setBooking(false);

        }

    };

    const fetchEvent = async () => {

        try {

            const res = await api.get(`/events/${id}`);

            setEvent(res.data);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="loading">

                <h2>Loading Event...</h2>

            </div>

        );

    }

    if (!event) {

        return (

            <div className="loading">

                <h2>Event Not Found</h2>

            </div>

        );

    }

    return (

        <div className="details-container">

            <button
                className="back-btn"
                onClick={() => navigate("/events")}
            >
                ← Back
            </button>

            <div className="details-card">

                <img
                    src={
                        resolveImage(
                            event.image,
                            "https://via.placeholder.com/900x450?text=EventHub"
                        )
                    }
                    alt={event.title}
                />

                <div className="details-body">

                    <h1>{event.title}</h1>

                    <p className="description">

                        {event.description}

                    </p>

                    <div className="info">

                        <p>

                            <strong>📍 Location:</strong>

                            {event.location}

                        </p>

                        <p>

                            <strong>💰 Price:</strong>

                            ₹ {event.price}

                        </p>

                        <p>

                            <strong>📅 Date:</strong>

                            {new Date(event.date).toLocaleDateString()}

                        </p>

                        <p>

                            <strong>🪑 Available Seats:</strong>

                            {event.availableSeats}

                        </p>

                        <p>

                            <strong>🎟 Total Seats:</strong>

                            {event.totalSeats}

                        </p>

                        <p>

                            <strong>👤 Organizer:</strong>

                            {event.organizer?.name || "Unknown"}

                        </p>

                    </div>

                    {

                        event.availableSeats > 0 &&

                        <div className="ticket-selector">

                            <label htmlFor="tickets">Tickets:</label>

                            <input
                                id="tickets"
                                type="number"
                                min="1"
                                max={event.availableSeats}
                                value={tickets}
                                onChange={(e) => setTickets(e.target.value)}
                            />

                        </div>

                    }

                    <button
                        className="book-btn"
                        disabled={event.availableSeats === 0 || booking}
                        onClick={handleBookNow}
                    >

                        {

                            event.availableSeats === 0

                                ?

                                "Sold Out"

                                :

                                booking

                                    ?

                                    "Booking..."

                                    :

                                    "Book Now"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}