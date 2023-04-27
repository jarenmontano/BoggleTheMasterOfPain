import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// import needed components
import Navbar from "./navbar.js";

export default function Home() {
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    return (
        // parent div
        <div
            id="home-container"
            className="container"
        >
            {/* navbar */}
            <Navbar />
            {/* title */}
            <div id="home-title">
                <h1>BOGGLE</h1>
            </div>
            <div id="home-nav">
                <div>
                    <a href="/lobby">Play Game!</a>
                </div>
                <div id="home-accounts">
                    <a href="/create">create account</a>
                    <a href="/login">login</a>
                </div>
            </div>
        </div>
    );
}
