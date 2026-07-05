import "./Navbar.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {

    const { user, logout } = useContext(AuthContext);

    return (

        <nav className="navbar">

            <div className="logo">

                EventHub

            </div>

            <div className="nav-links">

                <Link to="/">Home</Link>

                <Link to="/events">Events</Link>

                {

                    user ?

                    <>

                        <Link to="/dashboard">Dashboard</Link>

                        <Link to="/my-bookings">My Bookings</Link>

                        {

                            user.role === "admin" &&

                            <Link to="/admin">Admin</Link>

                        }

                        <button onClick={logout}>Logout</button>

                    </>

                    :

                    <>

                        <Link to="/login">Login</Link>

                        <Link to="/register">Register</Link>

                    </>

                }

            </div>

        </nav>

    );

}