import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import resolveImage from "../utils/resolveImage";
import "./Dashboard.css";

const emptyForm = {
    title: "",
    description: "",
    date: "",
    location: "",
    category: "Other",
    image: "",
    price: 0,
    totalSeats: 1
};

const categories = ["Music", "Tech", "Sports", "Workshop", "Other"];

export default function Dashboard() {

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const isOrganizer = user?.role === "organizer" || user?.role === "admin";

    const [myEvents, setMyEvents] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {

        if (!user) {
            navigate("/login");
            return;
        }

        if (isOrganizer) {
            loadMyEvents();
        }

    }, [user]);

    const loadMyEvents = async () => {

        try {

            const res = await api.get("/events");

            const mine = res.data.filter(
                (e) => e.organizer?._id === user._id
            );

            setMyEvents(mine);

        } catch (error) {

            console.log(error);

        }

    };

    const handleChange = (e) => {

        setForm({ ...form, [e.target.name]: e.target.value });

    };

    const handleImageUpload = async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const data = new FormData();
        data.append("image", file);

        setUploading(true);

        try {

            const res = await api.post("/upload", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setForm((prev) => ({ ...prev, image: res.data.imageUrl }));

        } catch (error) {

            alert(error.response?.data?.message || "Image upload failed");

        } finally {

            setUploading(false);

        }

    };

    const resetForm = () => {

        setForm(emptyForm);
        setEditingId(null);

    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setSubmitting(true);

        try {

            const payload = {
                ...form,
                price: Number(form.price),
                totalSeats: Number(form.totalSeats),
                availableSeats: editingId
                    ? undefined
                    : Number(form.totalSeats)
            };

            if (editingId) {

                await api.put(`/events/${editingId}`, payload);

            } else {

                await api.post("/events", payload);

            }

            resetForm();
            loadMyEvents();

        } catch (error) {

            alert(error.response?.data?.message || "Something went wrong");

        } finally {

            setSubmitting(false);

        }

    };

    const handleEdit = (event) => {

        setEditingId(event._id);

        setForm({
            title: event.title,
            description: event.description,
            date: event.date?.slice(0, 10),
            location: event.location,
            category: event.category || "Other",
            image: event.image || "",
            price: event.price,
            totalSeats: event.totalSeats
        });

        window.scrollTo({ top: 0, behavior: "smooth" });

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this event?")) return;

        try {

            await api.delete(`/events/${id}`);
            loadMyEvents();

        } catch (error) {

            alert(error.response?.data?.message || "Delete failed");

        }

    };

    if (!user) return null;

    return (

        <div className="dashboard">

            <h1>Dashboard</h1>

            <p className="welcome">
                Welcome back, <strong>{user.name}</strong> ({user.role})
            </p>

            {

                user.role === "admin" &&

                <div className="user-panel">

                    <p>Manage all users, events, and bookings across EventHub.</p>

                    <Link to="/admin" className="cta-btn">
                        Open Admin Panel
                    </Link>

                </div>

            }

            {

                !isOrganizer &&

                <div className="user-panel">

                    <p>Track and manage the events you've booked.</p>

                    <Link to="/my-bookings" className="cta-btn">
                        View My Bookings
                    </Link>

                </div>

            }

            {

                isOrganizer &&

                <>

                    <form className="event-form" onSubmit={handleSubmit}>

                        <h2>{editingId ? "Edit Event" : "Create New Event"}</h2>

                        <input
                            name="title"
                            placeholder="Event Title"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />

                        <textarea
                            name="description"
                            placeholder="Description"
                            value={form.description}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="location"
                            placeholder="Location"
                            value={form.location}
                            onChange={handleChange}
                            required
                        />

                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                        >
                            {categories.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>

                        <label className="field-label">Event Image</label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />

                        {uploading && <p className="uploading-text">Uploading...</p>}

                        {

                            form.image &&

                            <img
                                className="image-preview"
                                src={resolveImage(form.image)}
                                alt="Preview"
                            />

                        }

                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            min="0"
                            value={form.price}
                            onChange={handleChange}
                        />

                        <input
                            type="number"
                            name="totalSeats"
                            placeholder="Total Seats"
                            min="1"
                            value={form.totalSeats}
                            onChange={handleChange}
                            required
                        />

                        <div className="form-actions">

                            <button type="submit" disabled={submitting}>
                                {editingId ? "Update Event" : "Create Event"}
                            </button>

                            {

                                editingId &&

                                <button
                                    type="button"
                                    className="cancel-edit"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>

                            }

                        </div>

                    </form>

                    <h2 className="section-title">My Events</h2>

                    <div className="my-events-list">

                        {

                            myEvents.length === 0 &&

                            <p className="empty">You haven't created any events yet.</p>

                        }

                        {myEvents.map((event) => (

                            <div className="my-event-card" key={event._id}>

                                <div>
                                    <h3>{event.title}</h3>
                                    <p>📍 {event.location}</p>
                                    <p>🪑 {event.availableSeats}/{event.totalSeats} seats left</p>
                                </div>

                                <div className="my-event-actions">

                                    <button onClick={() => handleEdit(event)}>
                                        Edit
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(event._id)}
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                </>

            }

        </div>

    );

}
