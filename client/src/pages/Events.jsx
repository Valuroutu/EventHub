import { useEffect, useState } from "react";
import api from "../services/api";
import EventCard from "../components/EventCard";
import "./Events.css";

export default function Events() {

    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [filtered, setFiltered] = useState([]);

    const categories = ["All", "Music", "Tech", "Sports", "Workshop"];

    useEffect(() => {
        loadEvents();
    }, []);

    useEffect(() => {
        applyFilters(search, category);
    }, [events]);

    const loadEvents = async () => {
        try {
            const res = await api.get("/events");
            setEvents(res.data);
            setFiltered(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const applyFilters = (searchValue, categoryValue) => {

        let result = events;

        if (categoryValue !== "All") {
            result = result.filter(
                (event) => event.category === categoryValue
            );
        }

        if (searchValue) {
            result = result.filter((event) =>
                event.title.toLowerCase().includes(searchValue.toLowerCase())
            );
        }

        setFiltered(result);

    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        applyFilters(value, category);
    };

    const handleCategoryClick = (cat) => {
        setCategory(cat);
        applyFilters(search, cat);
    };

    return (
        <div className="events">

            <h1>Events</h1>

            <div className="categories">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={category === cat ? "active" : ""}
                        onClick={() => handleCategoryClick(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <input
                type="text"
                placeholder="Search Events"
                value={search}
                onChange={handleSearch}
            />

            <div className="event-grid">
                {filtered.map((event) => (
                    <EventCard
                        key={event._id}
                        event={event}
                    />
                ))}
            </div>

        </div>
    );
}