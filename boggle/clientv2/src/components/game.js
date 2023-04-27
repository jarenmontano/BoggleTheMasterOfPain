import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// import needed components
import Navbar from "./navbar.js";
import GameBoard from "./game_board.js";
// import CountdownTimer from "./countdown_timer.js";

import * as functions from "./functions/functions.js";
import CountdownTimer from "./countdown_timer.js";

function Game() {
    const [user, setUser] = useState({});
    const [players, setPlayers] = useState([]);
    const [message, setMessage] = useState("");
    const [board, setBoard] = useState([]);
    const [boardSize, setBoardSize] = useState(0);
    const [words, setWords] = useState([]);
    let time;

    const user_id = localStorage.getItem("user_id");
    const lobby_id = localStorage.getItem("lobby_id");

    // pull game data from server
    useEffect(() => {
        console.log("game page loaded");
        functions.post_call("/game", { game_id: lobby_id }, (res) => {
            let game = res.data.game;
            setBoard(game.board);
            setBoardSize(Math.sqrt(game.board.length));
        });
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        console.log("submitting word");
        let word = document.getElementById("enterWord").value;
        let data = {
            game_id: lobby_id,
            user_id: user_id,
            word: word,
        };
        functions.post_call("/game/check_word", data, (res) => {
            console.log(res);
        });
    }

    function get_players() {
        let req = {
            game_id: lobby_id,
        };
        functions.post_call("/game/scores", req, (res) => {
            console.log(res);
            setPlayers(res.data.players);
            // get words for this player
            let user = res.data.players.find((player) => {
                return player.user_id === user_id;
            });

            // set the user
            setUser(user);
            // set the words
            setWords(user.words);
        });
    }

    useEffect(() => {
        const interval = setInterval(() => {
            get_players();
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    // score table component
    const ScoreTable = () => {
        return (
            <table>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map((player) => {
                        return (
                            <tr>
                                <td>{player.username}</td>
                                <td>{player.score}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    };
    // word list component
    const WordList = () => {
        return (
            <div>
                <h2>Words</h2>
                <ul>
                    {words.map((word) => {
                        return <li>{word}</li>;
                    })}
                </ul>
            </div>
        );
    };

    return (
        <div
            id="game-container"
            className="container"
        >
            <Navbar />
            <CountdownTimer
                seconds={60}
                url="/results"
            />
            <ScoreTable />
            <div id="game-content">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <GameBoard
                                    board={board}
                                    boardSize={boardSize}
                                />
                            </td>
                            <td>
                                <WordList />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <form>
                <label htmlFor="enterWord">word</label>
                <input
                    type="text"
                    id="enterWord"
                    name="enterWord"
                />
                <button
                    id="submitWord"
                    name="submitWord"
                    onClick={handleSubmit}
                >
                    submit
                </button>
            </form>
        </div>
    );
}

export default Game;
