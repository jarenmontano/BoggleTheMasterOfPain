const express = require("express");
var session = require("express-session");
var MongoDBStore = require("connect-mongodb-session")(session);
const cors = require("cors");
const bodyParser = require("body-parser");
const configureDatabase = require("./db/db.js");

const app = express();

// Routes
const {
    check_is_user,
    create_account,
    login_account,
    logout_account,
} = require("./routes/route_account");
const {
    create_lobby,
    get_all_lobbies,
    get_lobby_by_id,
    add_player,
    remove_player,
    ready_player,
    set_inactive,
} = require("./routes/route_lobby");
const {
    add_players,
    get_game,
    get_scores,
    check_word,
} = require("./routes/route_game");

app.use(bodyParser.json());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

// Connect to session MongoDB
var store = new MongoDBStore({
    uri: "mongodb+srv://QuentinHigley:iqeNLaKLjpOLKpzh@cluster0.vcxpdkn.mongodb.net/?retryWrites=true&w=majority",
    databaseName: "boggle",
    collection: "boggleSessions",
});

store.on("error", (error) => {
    console.log("There was an error connecting to the session database");
    console.log(error);
});

app.use(
    session({
        secret: "keyboard cat",
        cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 1 week
        store: store,
        resave: true,
        saveUninitialized: true,
    })
);

configureDatabase();

// routes
// account routes
app.post("/login/check", (req, res) => {
    console.log("check if user is logged in");
    console.log(req.body);
    check_is_user(req, res, (result) => {
        console.log(result);
    });
});
app.post("/login", (req, res) => {
    console.log("login");
    console.log(req.body);
    login_account(req, res, (result) => {
        console.log(result);
    });
});
app.post("/create", (req, res) => {
    console.log("create account");
    create_account(req, res, (result) => {});
});
app.get("/logout", (req, res) => {
    console.log("logout");
    logout_account(req, res, (result) => {
        console.log(result);
    });
});

// lobby routes
app.get("/lobby", (req, res) => {
    get_all_lobbies(req, res, (result) => {});
});
app.post("/lobby/create", (req, res) => {
    // console.log(req.body);
    create_lobby(req, res, (result) => {});
});
app.post("/lobby/add", (req, res) => {
    add_player(req, res, (result) => {});
});
app.post("/lobby", (req, res) => {
    get_lobby_by_id(req, res, (result) => {
        // console.log(result);
    });
});
app.post("/lobby/ready", (req, res) => {
    console.log("ready player");
    console.log(req.body);
    ready_player(req, res, (result) => {
        console.log(result);
    });
});
app.post("/game/add", (req, res) => {
    console.log("add players to game");
    console.log(req.body);
    add_players(req, res, (result) => {
        console.log(result);
    });
});
app.post("/game", (req, res) => {
    console.log("get game");
    get_game(req, res, (result) => {
        console.log(result);
    });
});
app.post("/game/check_word", (req, res) => {
    console.log("check word");
    console.log(req.body);
    check_word(req, res, (result) => {
        console.log(result);
    });
});
app.post("/game/scores", (req, res) => {
    get_scores(req, res, (result) => {
        console.log(result);
    });
});

app.post("/lobby/inactive", (req, res) => {
    set_inactive(req, res, (result) => {
        console.log(result);
    });
});

app.listen(4000, () => console.log("Server started on http://localhost:4000"));
