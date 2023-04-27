const mongoose = require("mongoose");

const LobbySchema = new mongoose.Schema({
    lobby_id: { type: String, required: true },
    name: { type: String, required: true },
    players: { type: Array, required: true },
    curr_players: { type: Number, required: true },
    max_players: { type: Number, required: true },
    board_size: { type: Number, required: true },
    time_limit: { type: Number, required: true },
    salt: { type: String, required: true },
    active: { type: Boolean, required: true },
});
module.exports = mongoose.model("Lobby", LobbySchema);
