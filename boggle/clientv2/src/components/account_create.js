import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import createHash from "crypto-js";

// import needed components
import Navbar from "./navbar.js";

// import needed functions
import * as functions from "./functions/functions.js";

export default function CreateAccount() {
    const [user, setUser] = useState({
        username: "",
        password: "",
        confrimPassword: "",
    });
    const [isUser, setIisUser] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    function validateCredentials() {
        let valid = false;
        if (user.username.length < 4) {
            setMessage("Username must be at least 4 characters long.");
            return valid;
        }
        if (user.password.length < 6) {
            setMessage("Password must be at least 6 characters long.");
            return valid;
        }
        if (user.password !== user.confirmPassword) {
            setMessage("Passwords do not match.");
            return valid;
        }
        valid = true;
        return valid;
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!validateCredentials()) {
            return;
        }
        // check if username already exists
        let req = {
            username: user.username,
            user_id: functions.hash(user.username),
            password: functions.hash(user.password),
            salt: functions.generate_salt(16),
        };
        functions.post_call("/create", req, (res) => {
            let data = res.data;
            if (data.success) {
                // redirect to login page
                navigate("/login");
            } else {
                setMessage(data.message);
            }
        });
    }

    return (
        <div
            id="account-create-container"
            className="container"
        >
            {/* navbar */}
            <Navbar />
            <div
                id="account-create-form-container"
                className="form-container"
            >
                <h1>Create New Account</h1>
                <form
                    id="account-create-form"
                    onSubmit={handleSubmit}
                >
                    <div id="account-create-controls">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            onChange={(e) => {
                                setUser({ ...user, username: e.target.value });
                            }}
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            type="text"
                            name="password"
                            id="password"
                            onChange={(e) => {
                                setUser({ ...user, password: e.target.value });
                            }}
                        />
                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <input
                            type="text"
                            name="confirmPassword"
                            id="confirmPassword"
                            onChange={(e) => {
                                setUser({
                                    ...user,
                                    confirmPassword: e.target.value,
                                });
                            }}
                        />
                    </div>
                    <div
                        id="account-create-messages"
                        className="messages"
                    >
                        <span>{message}</span>
                    </div>
                    <button type="submit">Create</button>
                    <div id="account-create-login">
                        <span>
                            Already have an account? <a href="/login">Login</a>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
}
