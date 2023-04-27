const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
    lobby_id: { type: String, required: true },
    user_id: { type: String, required: true },
    username: { type: String, required: true },
    ready: { type: Boolean, required: true },
    score: { type: Number, required: true },
    words: { type: Array, required: true },
});

module.exports = mongoose.model("Player", PlayerSchema);
