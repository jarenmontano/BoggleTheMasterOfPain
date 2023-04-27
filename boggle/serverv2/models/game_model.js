const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
    game_id: { type: String, required: true },
    board: { type: String, required: true },
    players: { type: Array, required: true },
});

module.exports = mongoose.model("Game", GameSchema);
