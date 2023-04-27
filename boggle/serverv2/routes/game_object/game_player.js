class Player {
    constructor(user_id, username, lobby_id, score = 0, words = []) {
        this.user_id = user_id;
        this.lobby_id = lobby_id;
        this.username = username;
        this.score = score;
        this.words = words;
    }

    add_score(word) {
        this.score += score;
    }
    add_word(word) {
        this.words.push(word);
    }
    to_json() {
        return {
            user_id: this.user_id,
            lobby_id: this.lobby_id,
            username: this.username,
            score: this.score,
            words: this.words,
        };
    }
}
