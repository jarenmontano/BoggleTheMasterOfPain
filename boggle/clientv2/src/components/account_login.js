import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// import needed components
import Navbar from "./navbar.js";

// import functions
import * as functions from "./functions/functions.js";

export default function LoginAccount() {
    const [user, setUser] = useState({
        username: "",
        password: "",
    });
    const [isUser, setIsUser] = useState(false);
    const [message, setMessage] = useState("");
    const [salt, setSalt] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = localStorage.getItem("username");
        const isLoggedin = localStorage.getItem("loggedIn");
        if (isLoggedin) {
            navigate("/lobby");
        }
    });

    function validateCredentials() {
        let valid = false;
        if (isUser && user.password.length < 6) {
            setMessage("Please enter a valid password.");
            return valid;
        }
        if (user.username.length < 4) {
            setMessage("Please enter a valid username.");
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

        // check if username exists
        if (!isUser) {
            let req = { username: user.username };
            functions.post_call("/login/check", req, (res) => {
                console.log(res);
                let data = res.data;
                if (data.isUser === false) {
                    setMessage("Username does not exist.");
                    return;
                }
                localStorage.setItem("user_id", data.user_id);
                setSalt(data.salt);
                setIsUser(true);
            });
        } else if (isUser) {
            let hashed_password = functions.hash(user.password, salt);
            let check_user = {
                username: user.username,
                password: hashed_password,
            };
            functions.post_call("/login", check_user, (res) => {
                let data = res.data;
                if (data.isUser === false) {
                    setMessage("Incorrect password.");
                    return;
                }
                localStorage.setItem("username", user.username);
                localStorage.setItem("loggedIn", true);
                navigate("/lobby");
            });
        }
    }
    return (
        <div
            id="account-login-container"
            className="container"
        >
            {/* navbar */}
            <Navbar />
            <div
                id="account-login-form-container"
                className="form-container"
            >
                <h1>Login To Your Account</h1>
                <form
                    id="account-login-form"
                    onSubmit={handleSubmit}
                >
                    <div id="account-login-controls">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            onChange={(e) => {
                                setUser({
                                    ...user,
                                    username: e.target.value,
                                });
                            }}
                            disabled={isUser}
                        />
                        <div hidden={!isUser}>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                onChange={(e) => {
                                    setUser({
                                        ...user,
                                        password: e.target.value,
                                    });
                                }}
                            />
                        </div>
                        <button type="submit">Login</button>
                        <div
                            id="account-create-messages"
                            className="messages"
                        >
                            <span>{message}</span>
                        </div>
                        <div id="account-login-create">
                            <span>
                                Don't have an account?{" "}
                                <a href="/login">Create</a>
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
