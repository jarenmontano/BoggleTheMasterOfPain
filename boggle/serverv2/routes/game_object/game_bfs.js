class BoggleBFS {
    constructor() {}

    is_valid_index(index, board_size) {
        let total = board_size * board_size;
        return index >= 0 && index < total;
    }
    is_valid_neighbor(index, board_size, visited) {
        return this.is_valid_index(index, board_size) && !visited.has(index);
    }
    get_neighbors(index, board_size, visited) {
        let neighbors = new Set();
        let cardinal = [-1, 1, -board_size, board_size];
        let diagonal = [
            -board_size - 1,
            -board_size + 1,
            board_size - 1,
            board_size + 1,
        ];

        for (let i of cardinal) {
            console.log(i);
            if (this.is_valid_neighbor(index + i, board_size, visited)) {
                neighbors.add(index + i);
            }
        }
        for (let i of diagonal) {
            console.log(i);
            if (this.is_valid_neighbor(index + i, board_size, visited)) {
                neighbors.add(index + i);
            }
        }
        return neighbors;
    }
    score_word(word) {
        let scores = {
            3: 1,
            4: 1,
            5: 2,
            6: 3,
            7: 5,
            8: 11,
        };
        if (word.length < 3) {
            return 0;
        } else if (word.length > 8) {
            return 11;
        } else {
            return scores[word.length];
        }
    }
    search(board, word) {
        let board_size = Math.sqrt(board.length);
        console.log(board_size);
        let visited = new Set();
        let neighbors = new Set();
        let start = new Set();
        let letter_pos = new Set();
        let response;
        let found = false;
        word = word.toUpperCase();
        //find the indecies of the first letter
        for (let i = 0; i < board.length; i++) {
            if (board[i] === word[0]) {
                start.add(i);
            }
        }
        if (start.size === 0) {
            return false;
        }
        console.log("start");
        for (let i of start) {
            console.log(i);
            visited.clear();
            neighbors.clear();
            letter_pos.clear();
            visited.add(i);
            letter_pos.add(i);
            neighbors = this.get_neighbors(i, board_size, visited);
            console.log("neighbors");
            console.log(neighbors);
            for (let j = 1; j < word.length; j++) {
                for (let n of neighbors) {
                    // console.log(n);
                    if (board[n] === word[j]) {
                        console.log("found");
                        visited.add(n);
                        letter_pos.add(n);
                        neighbors = this.get_neighbors(n, board_size, visited);
                        break;
                    }
                }
            }
            console.log("here");
            break;
        }
        if (letter_pos.size === word.length) {
            found = true;
            response = {
                found: found,
                path: letter_pos,
            };
        }
        return response;
    }
}

module.exports = BoggleBFS;
