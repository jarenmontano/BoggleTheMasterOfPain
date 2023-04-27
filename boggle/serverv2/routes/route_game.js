const Game = require("../models/game_model");
const Player = require("../models/player_model");
const Lobby = require("../models/lobby_model");
const BoggleGame = require("./game_object/game_logic");
const BoggleBFS = require("./game_object/game_bfs");

const dictionaryApi = "https://api.dictionaryapi.dev/api/v2/entries/en/";

const BFS = new BoggleBFS();

async function fetchWord(word) {
    return fetch(dictionaryApi + word)
        .then((response) => response.json())
        .then((data) => {
            if (data.title === "No Definitions Found") {
                return false;
            }
            return true;
        });
}

exports.add_players = (req, res, callbakc) => {
    let data = req.body;
    let game_id = data.game_id;
    let players = data.players;

    // put playerId in the game
    Game.findOneAndUpdate({ game_id: game_id }, { players: players })
        .then((game) => {
            console.log(game);
            let response = {
                status: "success",
                message: "players added to game",
            };
            res.json(response);
        })
        .catch((err) => {
            let response = {
                status: "error",
                message: "error adding players to game",
            };
            res.json(response);
        });
};

// get game
exports.get_game = (req, res, callback) => {
    let data = req.body;
    let game_id = data.game_id;
    Game.findOne({ game_id: game_id })
        .then((game) => {
            let response = {
                status: "success",
                message: "game found",
                game: game,
            };
            res.json(response);
        })
        .catch((err) => {
            let response = {
                status: "error",
                message: "game not found",
            };
            res.json(response);
        });
};

// get scores
exports.get_scores = (req, res, callback) => {
    let data = req.body;
    let game_id = data.game_id;

    Player.find({ lobby_id: game_id })
        .then((players) => {
            let response = {
                status: "success",
                message: "players found",
                players: players,
            };
            res.json(response);
        })
        .catch((err) => {
            console.log(err);
            let response = {
                status: "error",
                message: "players not found",
            };
            res.json(response);
        });
};

// check word
exports.check_word = async (req, res, callback) => {
    let data = req.body;
    let game_id = data.game_id;
    let user_id = data.user_id;
    let word = data.word;
    // check if word
    let valid = await fetchWord(word);
    if (!valid) {
        let response = {
            status: "error",
            message: "word not found",
        };
        res.json(response);
        return;
    }
    console.log("word is valid");
    console.log(req.body);
    // get the board
    Game.findOne({ game_id: game_id }).then((game) => {
        let board = game.board;
        // let players = game.players;
        // let player = players.find((player) => player.user_id == user_id);

        // get the player
        Player.findOne({ user_id: user_id, lobby_id: game.game_id })
            .then((player) => {
                console.log("here");
                // console.log(player);
                // check if word is in the board
                let result = BFS.search(board, word);
                // score the word and update player
                console.log("result");
                console.log(result);
                if (result) {
                    // check if word is in the list
                    let words = player.words;
                    let found = words.find((w) => w == word);
                    if (found) {
                        let response = {
                            status: "error",
                            message: "word already found",
                        };
                        res.json(response);
                        return;
                    }
                    // add word to list
                    words.push(word);
                    // update player
                    let score_update = BFS.score_word(word) + player.score;
                    Player.findOneAndUpdate(
                        { user_id: user_id, lobby_id: game.game_id },
                        { words: words, score: score_update }
                    )
                        .then((player) => {
                            let response = {
                                status: "success",
                                message: "word found",
                                player: player,
                            };
                            res.json(response);
                        })
                        .catch((err) => {
                            let response = {
                                status: "error",
                                message: "error adding word to player",
                            };
                            res.json(response);
                        });
                } else {
                    let response = {
                        status: "error",
                        message: "word not found",
                    };
                    res.json(response);
                }
            })
            .catch((err) => {
                console.log(err);
                let response = {
                    status: "error",
                    message: "error finding player",
                };
                res.json(response);
                return;
            });
    });
};
