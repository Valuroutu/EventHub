import "./Login.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Register(){

    const [name,setName]=useState("");

    const [email,setEmail]=useState("");

    const [password,setPassword]=useState("");

    const [role,setRole]=useState("user");

    const {login}=useContext(AuthContext);

    const navigate=useNavigate();

    const handleSubmit=async(e)=>{

        e.preventDefault();

        try{

            const res=await api.post("/auth/register",{

                name,

                email,

                password,

                role

            });

            login(res.data);

            navigate("/");

        }

        catch(err){

            alert(err.response?.data?.message || "Registration failed");

        }

    };

    return(

        <div className="login-container">

            <form className="login-form" onSubmit={handleSubmit}>

                <h2>Register</h2>

                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    required
                />

                <label className="role-label">I want to:</label>

                <select
                    value={role}
                    onChange={(e)=>setRole(e.target.value)}
                >
                    <option value="user">Book Events (Attendee)</option>
                    <option value="organizer">Organize Events</option>
                </select>

                <button>Register</button>

            </form>

        </div>

    );

}