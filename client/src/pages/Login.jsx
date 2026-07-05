import "./Login.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Login(){

    const [email,setEmail]=useState("");

    const [password,setPassword]=useState("");

    const {login}=useContext(AuthContext);

    const navigate=useNavigate();

    const handleSubmit=async(e)=>{

        e.preventDefault();

        try{

            const res=await api.post("/auth/login",{

                email,

                password

            });

            login(res.data);

            navigate("/");

        }

        catch(err){

            alert(err.response.data.message);

        }

    };

    return(

        <div className="login-container">

            <form className="login-form" onSubmit={handleSubmit}>

                <h2>Login</h2>

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

                <button>Login</button>

            </form>

        </div>

    );

}