import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Navbar from "./navbar.js";

import * as functions from "./functions/functions.js";

export default function ResultsScreen() {
    const [players, setPlayers] = useState([]);
    const lobby_id = localStorage.getItem("lobby_id");
    // get the players
    useEffect(() => {
        let req = {
            game_id: lobby_id,
        };
        functions.post_call("/game/scores", req, (res) => {
            console.log(res);
            setPlayers(res.data.players);
        });
        functions.post_call(
            "/lobby/inactive",
            { lobby_id: lobby_id },
            (res) => {
                console.log(res);
            }
        );
    }, []);
    //create a list of players with their scores order by score
    const PlayerList = () => {
        return (
            <div id="player-list-container">
                <h2>Results</h2>
                <div>   
                     <div>
                       {players.map((player, i) => (<div key = {i}><h1>{player.username}</h1> 
                        <p>Score : {player.score} </p>
                        <div>Words Entered correctly : {player.words.map((word, j) => (<div key={j}>{word}</div>))} </div>
                          </div>))}
                    </div>
    
                </div>
            </div>
        );
    };
    return (
        <div
            id="results-screen-container"
            className="container"
        >
            <Navbar />
            <div>
                <PlayerList />
            </div>
        </div>
    );
}
