import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Navbar from "./navbar.js";

import * as functions from "./functions/functions.js";

export default function LobbyCreate() {
    const max_time_limit = 60;
    const max_board_size = 8;
    const max_players = 4;

    const [user, setUser] = useState({});
    const [lobby, setLobby] = useState({
        id: "",
        name: "",
        host: "",
        max_players: 0,
        board_size: 0,
        time_limit: 0,
    });

    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // UNSET WHEN DONE TESTING
        let isLoggedIn = localStorage.getItem("loggedIn");
        let user = localStorage.getItem("username");
        console.log(isLoggedIn);
        console.log(user);
        if (isLoggedIn === "false" || user === null) {
            navigate("/create");
        } else {
            setUser(user);
        }
    }, []);

    function validate() {
        let valid = false;

        if (lobby.name === "") {
            setMessage("Lobby name cannot be empty");
        }
        if (lobby.max_players < 2 || lobby.max_players > max_players) {
            setMessage("Max players must be between 2 and 4");
        }
        if (lobby.board_size < 4 || lobby.board_size > max_board_size) {
            setMessage("Board size must be between 4 and 8");
        }
        if (lobby.time_limit < 0 || lobby.time_limit > max_time_limit) {
            setMessage("Time limit must be between 0 and 60");
        }

        valid = true;
        return valid;
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        let salt = functions.generate_salt(16);
        let l_id = functions.hash(lobby.name, salt);

        const new_lobby = {
            lobby_id: l_id,
            name: lobby.name,
            host: user.username,
            max_players: lobby.max_players,
            board_size: lobby.board_size,
            time_limit: functions.to_milliseconds(lobby.time_limit),
            salt: salt,
            active: true,
        };

        functions.post_call("/lobby/create", new_lobby, (res) => {
            let data = res.data;
            if (data.success === true) {
                navigate("/lobby");
            } else {
                setMessage(data.message);
            }
        });
    }

    return (
        <div
            id="lobby-create-container"
            className="container"
        >
            <Navbar />
            <div
                id="lobby-create-form-container"
                className="form-container"
            >
                <h1>Create Lobby</h1>
                <form
                    id="lobby-create-form"
                    onSubmit={handleSubmit}
                >
                    <div id="lobby-create-controls">
                        <label htmlFor="lobby-name">Lobby Name</label>
                        <input
                            type="text"
                            name="lobby-name"
                            id="lobby-name"
                            onChange={(e) => {
                                setLobby({
                                    ...lobby,
                                    name: e.target.value,
                                });
                            }}
                        />
                        <label htmlFor="max-players">Max Players</label>
                        <input
                            type="number"
                            name="max-players"
                            id="max-players"
                            min="2"
                            max={max_players}
                            onChange={(e) => {
                                setLobby({
                                    ...lobby,
                                    max_players: e.target.value,
                                });
                            }}
                        />
                        <label htmlFor="board-size">Board Size</label>
                        <input
                            type="number"
                            name="board-size"
                            id="board-size"
                            min="4"
                            max={max_board_size}
                            onChange={(e) => {
                                setLobby({
                                    ...lobby,
                                    board_size: e.target.value,
                                });
                            }}
                        />
                        <label htmlFor="time-limit">Time Limit</label>
                        <input
                            type="number"
                            name="time-limit"
                            id="time-limit"
                            min="30"
                            max={max_time_limit}
                            onChange={(e) => {
                                setLobby({
                                    ...lobby,
                                    time_limit: e.target.value,
                                });
                            }}
                        />
                        <button
                            type="submit"
                            id="lobby-create-submit"
                        >
                            Create Lobby
                        </button>

                        <div
                            id="lobby-create-messages"
                            className="messages"
                        >
                            <span>{message}</span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
