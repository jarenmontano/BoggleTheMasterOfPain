import React, { useEffect } from "react";
import axios from "axios";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// import components
// Home page component
import Home from "./components/home.js";
// Account page components
import CreateAccount from "./components/account_create.js";
import LoginAccount from "./components/account_login.js";
// Lobby page components
import LobbyHome from "./components/lobby_home.js";
import LobbyCreate from "./components/lobby_create.js";
import LobbyPregame from "./components/lobby_pregame.js";
// Game page components
import Game from "./components/game.js";
// Results page components
import ResultsScreen from "./components/results_screen.js";

function App() {
    axios.defaults.withCredentials = true;
    return (
        <Routes>
            {/* home page route */}
            <Route
                path="/"
                element={<Home />}
            />
            {/* account page routes */}
            <Route
                path="/create"
                element={<CreateAccount />}
            />
            <Route
                path="/login"
                element={<LoginAccount />}
            />
            {/* Lobby page routes */}
            <Route
                path="/lobby"
                element={<LobbyHome />}
            />
            <Route
                path="/lobby_create"
                element={<LobbyCreate />}
            />
            <Route
                path="/pregame"
                element={<LobbyPregame />}
            />
            {/* Game route */}
            <Route
                path="/game"
                element={<Game />}
            />
            {/* Results route */}
            <Route
                path="/results"
                // element={<LobbyHome />}
                element={<ResultsScreen />}
            />
        </Routes>
    );
}

const root = createRoot(document.getElementById("root"));

root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
