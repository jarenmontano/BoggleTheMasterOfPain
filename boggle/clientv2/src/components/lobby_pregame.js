import { useState, useEffect, useRef } from "react";
import CountdownTimer from "./countdown_timer.js";

import Navbar from "./navbar.js";

import * as functions from "./functions/functions.js";

export default function LobbyPregame() {
    // get the lobby id from the local storage
    const lobby_id = localStorage.getItem("lobby_id");

    // get the user id from the local storage
    const user_id = localStorage.getItem("user_id");

    // get the username from the local storage
    const username = localStorage.getItem("username");
    const [players, setPlayers] = useState([]);
    const [allReady, setAllReady] = useState(false);
    const allReadyRef = useRef(false);
    const [coundown, setCoundown] = useState("");
    const [waitForReady, setWaitForReady] = useState(
        "Waiting For All Players To Ready up."
    );
    // on load get the lobby data
    // store the players in the state
    useEffect(() => {
        let req = {
            lobby_id: lobby_id,
        };
        console.log(req);
        functions.post_call("/lobby", req, (res) => {
            console.log(res.data.lobby.players);
            setPlayers(res.data.lobby.players);
        });
    }, []);
    // create a list of players with their ready status

    const PlayerList = () => {
        return (
            <div id="player-list-container">
                <h2>Players</h2>
                <ul>
                    {players.map((player) => {
                        return (
                            <div>
                                <span>{player.username}</span>
                                <span>{`${player.ready}`}</span>
                            </div>
                        );
                    })}
                </ul>
            </div>
        );
    };

    // let players set ready status
    function readyClick() {
        let req = {
            lobby_id: lobby_id,
            user_id: user_id,
            username: username,
        };
        // get current player ready status
        let player = players.find((player) => player.user_id === user_id);
        let ready = player.ready;
        console.log(ready);
        if (ready) {
            req.ready = false;
            functions.post_call("/lobby/ready", req, (res) => {
                console.log(res.data.lobby.players);
            });
        } else {
            req.ready = true;
            functions.post_call("/lobby/ready", req, (res) => {});
        }
        // if player is not ready, set ready
    }
    // poll the server for ready status every 1 second
    function get_status() {
        let req = {
            lobby_id: lobby_id,
        };
        console.log(req);
        functions.post_call("/lobby", req, (res) => {
            console.log(res.data.lobby.players);
            setPlayers(res.data.lobby.players);
            if (allPlayersReady(res.data.lobby.players)) {
                allReadyRef.current = true;
            }
        });
    }

    useEffect(() => {
        const interval = setInterval(() => {
            get_status();
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    function allPlayersReady(players) {
        // check if all players are ready
        // min 2 players
        let allPlyrsRdy = true;
        if (players.length < 1) {
            allPlyrsRdy = false;
        }
        allPlyrsRdy = players.every((player) => player.ready);
        return allPlyrsRdy;
    }

    // let players leave the lobby
    function leaveLobby() {
        let req = {
            lobby_id: lobby_id,
            user_id: user_id,
            username: username,
        };
        functions.post_call("/lobby/leave", req, (res) => {
            console.log(res.data);
            if (res.data.success) {
                localStorage.removeItem("lobby_id");
                navigate("/lobby");
            }
        });
    }

    // if all players are ready, start countdown to game start
    // once the game starts, redirect to the game page
    useEffect(() => {
        console.log(allReadyRef.current);
        if (allReadyRef.current) {
            console.log("all players ready");
            // start countdown
            setCoundown(
                <CountdownTimer
                    seconds={3}
                    url={"/game"}
                />
            );
            setWaitForReady("Game will Start In : ");
        }
    }, [allReadyRef.current]);

    return (
        <div
            id="lobby-pregame-container"
            className="container"
        >
            <Navbar />
            <div>
                {waitForReady}
                {coundown}
            </div>
            <div id="lobby-pregame-content">
                <h1>Lobby Pregame</h1>
                <PlayerList />
            </div>
            <button onClick={readyClick}> ready </button>
            <button onClick={leaveLobby}>leave</button>
        </div>
    );
}
