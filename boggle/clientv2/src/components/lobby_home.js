import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Navbar from "./navbar.js";

import * as functions from "./functions/functions.js";

export default function LobbyHome() {
    const [user, setUser] = useState({});
    const [lobbies, setLobbies] = useState([]);
    const navigate = useNavigate();

    // on load check if user is logged in
    // if not redirect to login page
    // then get all lobbies
    // and create lobby list
    useEffect(() => {
        let user = localStorage.getItem("username");
        let loggedIn = localStorage.getItem("loggedIn");
        if (loggedIn === "false" || user === null) {
            return navigate("/create");
        }

        // get all lobbies
        functions.get_call("/lobby", (result) => {
            // console.log(result);
            setLobbies(result.data.lobbies);
        });
    }, []);
    // create lobby list
    const LobbyList = () => {
        console.log(lobbies);
        return (
            <div id="lobby-list-container">
                <ul>
                    {lobbies.map((lobby) => {
                        return (
                            <li key={lobby.lobby_id}>
                                <span className="lobby_item_name">
                                    {lobby.name}
                                </span>
                                <span className="lobby_item_players">
                                    {lobby.max_players}
                                </span>
                                <span className="lobby_item_link">
                                    <button
                                        onClick={() => {
                                            console.log(lobby.lobby_id);
                                            localStorage.setItem(
                                                "lobby_id",
                                                lobby.lobby_id
                                            );
                                            // add player to lobby
                                            let req = {
                                                lobby_id: lobby.lobby_id,
                                                username:
                                                    localStorage.getItem(
                                                        "username"
                                                    ),
                                                user_id:
                                                    localStorage.getItem(
                                                        "user_id"
                                                    ),
                                                ready: false,
                                                score: 0,
                                                words: [],
                                            };
                                            functions.post_call(
                                                "/lobby/add",
                                                req,
                                                (result) => {
                                                    console.log(result);
                                                }
                                            );

                                            navigate("/pregame");
                                        }}
                                    >
                                        Join
                                    </button>
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    };

    return (
        <div
            id="lobby-home-container"
            className="container"
        >
            {/* navbar */}
            <Navbar />
            {/* lobby list */}
            <LobbyList />
            {/* create lobby */}
            <a href="/lobby_create">Create Lobby</a>
        </div>
    );
}
