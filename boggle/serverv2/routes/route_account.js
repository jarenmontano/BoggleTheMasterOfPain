const Account = require("../models/account_model");

// check if user exists and return salt
exports.check_is_user = function (req, res, callback) {
    let data = req.body;
    let username = data.username;
    let response;
    Account.findOne({ username: username })
        .then((account) => {
            // console.log(account);
            if (account) {
                salt = account.salt;
                response = {
                    is_user: true,
                    salt: salt,
                    user_id: account.user_id,
                };
            } else {
                response = {
                    is_user: false,
                    salt: null,
                    user_id: null,
                };
            }
            console.log("line 25");
            console.log(response);
            res.json(response);
            callback(true);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while checking if the user exists.",
            });
            callback(false);
        });
};

// create new account
exports.create_account = function (req, res, callback) {
    let data = req.body;
    let user_id = data.user_id;
    let username = data.username;
    let password = data.password;
    let salt = data.salt;
    console.log(req.body);
    // if username already exists, return
    console.log("checking if username exists");
    Account.findOne({ username: username }).then((account) => {
        if (account) {
            response = {
                success: false,
                message: "Username already exists.",
            };
            res.status(400).send(response);
            callback(false);
            return;
        }
        console.log("creating account");
        // create new account
        const new_account = new Account({
            user_id: user_id,
            username: username,
            password: password,
            salt: salt,
        });
        Account.create(new_account)
            .then((data) => {
                console.log("account created");
                req.session.username = username;
                req.session.user_id = user_id;
                req.session.loggedIn = true;
                req.session.save((err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        response = {
                            success: true,
                            message: "Account created.",
                        };
                        res.json(response);
                        callback(true);
                    }
                });
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        "Some error occurred while creating the account.",
                });
                callback(false);
            });
    });
};

// login account
exports.login_account = function (req, res, callback) {
    let username = req.body.username;
    let password = req.body.password;
    let response;
    Account.findOne({
        username: username,
        password: password,
    })
        .then((account) => {
            if (account) {
                req.session.username = username;
                req.session.user_id = account.user_id;
                req.session.loggedIn = true;
                response = {
                    loggedIn: true,
                    user_id: account.user_id,
                };
            } else {
                req.session.user = null;
                req.session.user_id = null;
                req.session.loggedIn = false;
                response = {
                    loggedIn: false,
                    user_id: null,
                };
            }
            req.session.save((err) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json(response);
                    callback(true);
                }
            });
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while logging in the user.",
            });
            callback(false);
        });
};

exports.logout_account = function (req, res, callback) {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            res.json({ success: true });
            callback(true);
        }
    });
};
