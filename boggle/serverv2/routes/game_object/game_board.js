class Board {
    constructor(board_size = 4) {
        this.board_size = board_size;
        this.base_letter_frequency = {
            A: 8.12,
            B: 1.49,
            C: 2.71,
            D: 4.32,
            E: 12.02,
            F: 2.3,
            G: 2.03,
            H: 5.92,
            I: 7.31,
            J: 0.1,
            K: 0.69,
            L: 3.98,
            M: 2.61,
            N: 6.95,
            O: 7.68,
            P: 1.82,
            Q: 0.11,
            R: 6.02,
            S: 6.28,
            T: 9.1,
            U: 2.88,
            V: 1.11,
            W: 2.09,
            X: 0.17,
            Y: 2.11,
            Z: 0.07,
        };
    }

    normal_distribution(mean = 0, std_dev = 1) {
        let u = 1 - Math.random();
        let v = Math.random();
        let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

        return mean + std_dev * z;
    }
    fisher_yates_shuffle(letters) {
        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [letters[i], letters[j]] = [letters[j], letters[i]];
        }
        return letters;
    }

    generate_board() {
        let letters = [];
        let size = this.board_size * this.board_size;
        // create new frequency map
        let new_freqs = this.base_letter_frequency;
        let vowel_penalty = 1.2;
        let vowels = ["A", "E", "I", "O"];
        let min_freq = 0.5;
        let max_freq = 6;
        for (let letter in new_freqs) {
            if (new_freqs[letter] < min_freq) {
                new_freqs[letter] += min_freq;
            }
            if (new_freqs[letter] > max_freq) {
                new_freqs[letter] = max_freq;
            }
            // new_freqs[letter] = Math.abs(
            new_freqs[letter] = Math.abs(
                this.normal_distribution(new_freqs[letter], 0.5)
            );
            if (vowels.includes(letter)) {
                new_freqs[letter] -= vowel_penalty;
            }
            let count = Math.trunc((new_freqs[letter] / 100) * (size * size));
            letters.push(...Array(count).fill(letter));
        }
        letters = letters.toString().split("");
        letters = letters.filter((letter) => letter != ",");
        for (let i = 0; i < 30; i++) {
            letters = this.fisher_yates_shuffle(letters);
        }

        letters = letters.toString().replace(/,/g, "");
        letters = letters.slice(0, size);
        return letters;
    }
}

module.exports = Board;
