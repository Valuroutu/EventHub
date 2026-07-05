import "./Hero.css";
import { useNavigate } from "react-router-dom";

export default function Hero(){

const navigate=useNavigate();

return(

<section className="hero">

<div className="hero-content">

<h1>Discover Amazing Events</h1>

<p>

Book tickets for workshops,
concerts, hackathons and more.

</p>

<button
onClick={()=>navigate("/events")}
>

Explore Events

</button>

</div>

</section>

);

}