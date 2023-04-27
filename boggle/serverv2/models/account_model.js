const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
});

module.exports = mongoose.model("Account", AccountSchema);
