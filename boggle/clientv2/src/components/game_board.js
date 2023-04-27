import React from "react";

function GameBoard({ board, boardSize }) {
    return (
        <ul id="game-board-container">
            {Array.from({ length: boardSize }, (_, row) => (
                <li
                    key={`row-${row}`}
                    className="game-board-row"
                >
                    {Array.from({ length: boardSize }, (_, col) => (
                        <div
                            key={`col-${col}`}
                            className="game-board-tile"
                        >
                            {board[row * boardSize + col]}
                        </div>
                    ))}
                </li>
            ))}
        </ul>
    );
}

export default GameBoard;
