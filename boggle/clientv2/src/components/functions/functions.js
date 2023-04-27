import axios from "axios";
import createHash from "crypto-js";

export default function issue() {
    console.log("issue");
}

export function get_call(url, callback) {
    url = `http://localhost:4000${url}`;
    console.log(url);
    axios.get(url).then(callback).catch(callback);
}
export function post_call(url, data, callback) {
    url = `http://localhost:4000${url}`;
    console.log(url);
    axios.post(url, data).then(callback).catch(callback);
}

export function to_seconds(milliseconds) {
    return milliseconds / 1000;
}

export function to_milliseconds(seconds) {
    return seconds * 1000;
}

export function generate_salt(length) {
    var salt = "";
    var possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        salt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return salt;
}
export function hash(string, salt = "") {
    return createHash.SHA256(string + salt).toString();
}

export async function countdown(time, interim_function, callback) {
    var interval = setInterval(() => {
        interim_function(time);
        time -= 1;
        if (time < 0) {
            clearInterval(interval);
            callback();
        }
    }, 1000);
}

export async function polling(
    poll_interval,
    poll_function,
    poll_condition,
    callback
) {
    setInterval(async () => {
        await poll_function();

        if (!poll_condition) {
            clearInterval();
        }
    }, poll_interval);

    callback();
}
