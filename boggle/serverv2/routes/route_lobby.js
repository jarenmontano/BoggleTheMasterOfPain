const Lobby = require("../models/lobby_model");
const Game = require("../models/game_model");
const Player = require("../models/player_model");
const BoggleBoard = require("./game_object/game_board");
const BoggleGame = require("./game_object/game_logic");
// Game attributes
// game_id: String same as lobby_id
// board: String
// players: Array of Player objects

// create lobby
exports.create_lobby = (req, res, callback) => {
    let data = req.body;
    // console.log(data);
    let response;
    const new_lobby = {
        lobby_id: data.lobby_id,
        name: data.name,
        curr_players: 0,
        max_players: data.max_players,
        board_size: data.board_size,
        time_limit: data.time_limit,
        salt: data.salt,
        active: data.active,
        players: data.players,
    };

    // create new lobby
    Lobby.create(new_lobby)
        .then((lobby) => {
            // create game
            let boardGen = new BoggleBoard(data.board_size);
            // let board = boardGen.board;
            let board = boardGen.generate_board();
            const new_game = {
                game_id: data.lobby_id,
                board: board,
                players: [],
            };
            console.log(new_game);
            Game.create(new_game)
                .then((game) => {
                    response = {
                        success: true,
                        message: "Lobby created successfully.",
                    };
                    callback(true);
                    res.json(response);
                    return;
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).send({
                        message:
                            err.message ||
                            "Some error occurred while creating the game.",
                    });
                    callback(false);
                    res.json(response);
                    return;
                });
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while creating the lobby.",
            });
            callback(false);
        });
};

// get all lobbies
exports.get_all_lobbies = (req, res, callback) => {
    let response;
    Lobby.find({ active: true })
        .then((lobbies) => {
            response = {
                success: true,
                message: "Lobbies retrieved successfully.",
                lobbies: lobbies,
            };
            res.json(response);
            callback(true);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while retrieving lobbies.",
            });
            callback(false);
        });
};

// get lobby by id
exports.get_lobby_by_id = (req, res, callback) => {
    let data = req.body;
    let lobby_id = data.lobby_id;
    let response;
    Lobby.findOne({ lobby_id: lobby_id, active: true })
        .then((lobby) => {
            if (!lobby) {
                response = {
                    success: false,
                    message: "Lobby does not exist.",
                };
                res.status(400).send(response);
                callback(false);
                return;
            }
            response = {
                success: true,
                message: "Lobby retrieved successfully.",
                lobby: lobby,
            };
            res.json(response);
            callback(true);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while retrieving lobby.",
            });
            callback(false);
        });
};

// add player to lobby
exports.add_player = (req, res, callback) => {
    let data = req.body;
    let lobby_id = data.lobby_id;
    let response;
    // check if lobby exists
    Lobby.findOne({ lobby_id: lobby_id, active: true })
        .then((lobby) => {
            if (!lobby) {
                response = {
                    success: false,
                    message: "Lobby does not exist.",
                };
                res.status(400).send(response);
                callback(false);
                return;
            }

            // check if player already exists in lobby
            let players = lobby.players;
            let user_id = data.user_id;
            for (let i = 0; i < players.length; i++) {
                if (players[i].user_id === user_id) {
                    response = {
                        success: false,
                        message: "Player already exists in lobby.",
                    };
                    res.status(400).send(response);
                    callback(false);
                    return;
                }
            }

            // check if lobby is full
            let max_players = lobby.max_players;
            let curr_players = lobby.curr_players;
            if (curr_players >= max_players) {
                response = {
                    success: false,
                    message: "Lobby is full.",
                };
                res.status(400).send(response);
                callback(false);
                return;
            }

            // add player to lobby
            let new_player = {
                lobby_id: lobby_id,
                user_id: data.user_id,
                username: data.username,
                ready: data.ready,
                score: data.score,
                words: data.words,
            };

            players.push(new_player);
            lobby.players = players;
            lobby.curr_players = curr_players + 1;
            lobby.save();
            Player.create(new_player)
                .then((player) => {
                    response = {
                        success: true,
                        message: "Player added to lobby successfully.",
                    };
                    res.json(response);
                    callback(true);
                })
                .catch((err) => {
                    res.status(500).send({
                        message:
                            err.message ||
                            "Some error occurred while adding player to lobby.",
                    });
                    callback(false);
                });
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while adding player to lobby.",
            });
            callback(false);
        });
};

// remove player from lobby
exports.remove_player = (req, res, callback) => {
    let data = req.body;
    let lobby_id = data.lobby_id;
    let response;

    // check if lobby exists
    Lobby.findOne({ lobby_id: lobby_id, active: true })
        .then((lobby) => {
            if (!lobby) {
                response = {
                    success: false,
                    message: "Lobby does not exist.",
                };
                res.status(400).send(response);
                callback(false);
                return;
            }

            // remove player from lobby
            let players = lobby.players;
            let user_id = data.user_id;
            for (let i = 0; i < players.length; i++) {
                if (players[i].user_id === user_id) {
                    players.splice(i, 1);
                    lobby.players = players;
                    lobby.curr_players = lobby.curr_players - 1;
                    lobby.save();
                    break;
                }
            }
            // remove player from player collection
            Player.findOneAndDelete({ user_id: user_id, lobby_id: lobby_id })
                .then((player) => {
                    if (!player) {
                        response = {
                            success: false,
                            message: "Player does not exist.",
                        };
                        res.status(400).send(response);
                        callback(false);
                        return;
                    }

                    response = {
                        success: true,
                        message: "Player removed from lobby successfully.",
                    };
                    res.json(response);
                    callback(true);
                })
                .catch((err) => {
                    res.status(500).send({
                        message:
                            err.message ||
                            "Some error occurred while removing player from lobby.",
                    });
                    callback(false);
                });
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while removing player from lobby.",
            });
            callback(false);
        });
};

// update player status
exports.ready_player = (req, res, callback) => {
    let data = req.body;
    let lobby_id = data.lobby_id;
    let user_id = data.user_id;
    let ready = data.ready;
    let response;

    // check if lobby exists and then update player status
    Lobby.findOneAndUpdate(
        { lobby_id: lobby_id, active: true },
        { $set: { "players.$[elem].ready": ready } },
        { arrayFilters: [{ "elem.user_id": user_id }] }
    )
        .then((lobby) => {
            console.log(lobby);
        })
        .catch((err) => {
            console.log(err);
        });
};
// check if lobby is ready
exports.start_game = (req, res, callback) => {
    let data = req.body;
    let lobby_id = data.lobby_id;
    let response;

    // check if lobby exists
    Lobby.findOne({ lobby_id: lobby_id, active: true })
        .then((lobby) => {
            if (!lobby) {
                response = {
                    success: false,
                    message: "Lobby does not exist.",
                };
                res.status(400).send(response);
                callback(false);
                return;
            }

            // check if lobby is ready
            let players = lobby.players;
            let ready = true;
            for (let i = 0; i < players.length; i++) {
                if (!players[i].ready) {
                    ready = false;
                    break;
                }
            }

            // return success
            response = {
                success: true,
                message: "Lobby is ready.",
                ready: ready,
            };
            res.json(response);
            callback(true);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while starting game.",
            });
            callback(false);
        });
};

exports.set_inactive = (req, res, callback) => {
    let data = req.body;
    let lobby_id = data.lobby_id;
    let response;

    // check if lobby exists
    Lobby.findOneAndUpdate({ lobby_id: lobby_id }, { active: 0 })
        .then((lobby) => {
            if (!lobby) {
                response = {
                    success: false,
                    message: "Lobby does not exist.",
                };
                res.status(400).send(response);
                callback(false);
                return;
            }

            response = {
                success: true,
                message: "Lobby set to inactive.",
            };
            res.json(response);
            callback(true);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while starting game.",
            });
            callback(false);
        });
};
