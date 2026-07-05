import "./EventCard.css";

import { useNavigate } from "react-router-dom";
import resolveImage from "../utils/resolveImage";

export default function EventCard({ event }) {

    const navigate = useNavigate();

    const handleViewDetails = () => {

        navigate(`/events/${event._id}`);

    };

    return (

        <div className="event-card">

            <img

                src={
                    resolveImage(
                        event.image,
                        "https://via.placeholder.com/400x250?text=EventHub"
                    )
                }

                alt={event.title}

            />

            <div className="event-body">

                {

                    event.category &&

                    <span className="event-category">
                        {event.category}
                    </span>

                }

                <h2>

                    {event.title}

                </h2>

                <p>

                    📍 {event.location}

                </p>

                <p>

                    ₹ {event.price}

                </p>

                <button

                    onClick={handleViewDetails}

                >

                    View Details

                </button>

            </div>

        </div>

    );

}