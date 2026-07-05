import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import "./Admin.css";

const TABS = ["Users", "Events", "Bookings"];

export default function Admin() {

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [tab, setTab] = useState("Users");
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role !== "admin") {
            navigate("/dashboard");
            return;
        }

        loadAll();

    }, [user]);

    const loadAll = async () => {

        setLoading(true);

        try {

            const [usersRes, eventsRes, bookingsRes] = await Promise.all([
                api.get("/auth/users"),
                api.get("/events"),
                api.get("/bookings")
            ]);

            setUsers(usersRes.data.users);
            setEvents(eventsRes.data);
            setBookings(bookingsRes.data.bookings);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    const handleRoleChange = async (id, role) => {

        try {

            await api.put(`/auth/users/${id}/role`, { role });
            loadAll();

        } catch (error) {

            alert(error.response?.data?.message || "Role update failed");

        }

    };

    const handleDeleteUser = async (id) => {

        if (!window.confirm("Delete this user permanently?")) return;

        try {

            await api.delete(`/auth/users/${id}`);
            loadAll();

        } catch (error) {

            alert(error.response?.data?.message || "Delete failed");

        }

    };

    const handleDeleteEvent = async (id) => {

        if (!window.confirm("Delete this event permanently?")) return;

        try {

            await api.delete(`/events/${id}`);
            loadAll();

        } catch (error) {

            alert(error.response?.data?.message || "Delete failed");

        }

    };

    if (!user || user.role !== "admin") return null;

    const totalRevenue = bookings
        .filter((b) => b.paymentStatus === "Paid")
        .reduce((sum, b) => sum + b.totalAmount, 0);

    return (

        <div className="admin">

            <h1>Admin Panel</h1>

            <div className="admin-stats">

                <div className="stat-card">
                    <span className="stat-number">{users.length}</span>
                    <span className="stat-label">Users</span>
                </div>

                <div className="stat-card">
                    <span className="stat-number">{events.length}</span>
                    <span className="stat-label">Events</span>
                </div>

                <div className="stat-card">
                    <span className="stat-number">{bookings.length}</span>
                    <span className="stat-label">Bookings</span>
                </div>

                <div className="stat-card">
                    <span className="stat-number">₹ {totalRevenue}</span>
                    <span className="stat-label">Revenue (Paid)</span>
                </div>

            </div>

            <div className="admin-tabs">

                {TABS.map((t) => (

                    <button
                        key={t}
                        className={tab === t ? "active" : ""}
                        onClick={() => setTab(t)}
                    >
                        {t}
                    </button>

                ))}

            </div>

            {

                loading &&

                <p className="empty">Loading...</p>

            }

            {

                !loading && tab === "Users" &&

                <table className="admin-table">

                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {users.map((u) => (

                            <tr key={u._id}>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>

                                    <select
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                        disabled={u._id === user._id}
                                    >
                                        <option value="user">user</option>
                                        <option value="organizer">organizer</option>
                                        <option value="admin">admin</option>
                                    </select>

                                </td>
                                <td>

                                    <button
                                        className="delete-btn"
                                        disabled={u._id === user._id}
                                        onClick={() => handleDeleteUser(u._id)}
                                    >
                                        Delete
                                    </button>

                                </td>
                            </tr>

                        ))}

                    </tbody>

                </table>

            }

            {

                !loading && tab === "Events" &&

                <table className="admin-table">

                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Organizer</th>
                            <th>Seats</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {events.map((e) => (

                            <tr key={e._id}>
                                <td>{e.title}</td>
                                <td>{e.organizer?.name || "Unknown"}</td>
                                <td>{e.availableSeats}/{e.totalSeats}</td>
                                <td>₹ {e.price}</td>
                                <td>

                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteEvent(e._id)}
                                    >
                                        Delete
                                    </button>

                                </td>
                            </tr>

                        ))}

                    </tbody>

                </table>

            }

            {

                !loading && tab === "Bookings" &&

                <table className="admin-table">

                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Event</th>
                            <th>Tickets</th>
                            <th>Amount</th>
                            <th>Booking</th>
                            <th>Payment</th>
                        </tr>
                    </thead>

                    <tbody>

                        {bookings.map((b) => (

                            <tr key={b._id}>
                                <td>{b.user?.name || "Unknown"}</td>
                                <td>{b.event?.title || "Removed"}</td>
                                <td>{b.tickets}</td>
                                <td>₹ {b.totalAmount}</td>
                                <td>{b.bookingStatus}</td>
                                <td>{b.paymentStatus}</td>
                            </tr>

                        ))}

                    </tbody>

                </table>

            }

        </div>

    );

}
