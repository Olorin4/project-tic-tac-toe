// TIC TAC TOE

console.log("You must defeat Skynet to prevent it from launching its nukes.");
console.log("Turn 1");


// Gameboard object to store the game status
const Gameboard = (() => {
  let board = [                                     // The board variable is encapsulated
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
  ];

  return { getBoard: () => board };                 // Return an object with the getBoard method,
})();                                               // which retrieves the board array.
console.log(Gameboard.getBoard());
                                                    // END OF Gameboard Module.
  

// Players object
const Player = (() => {
  const players = [                                 // Again encapsulated by closure.
    {
      name: "You",
      token: "X"
    },
    {
      name: "Skynet",
      token: "O"
    }
  ];
  
  return { getPlayers: () => players };             // The two players objects are made public
})();                                               // indirectly, through the 'getPlayers' method.
console.log(Player.getPlayers());
                                                    // END OF Players Module.


// Game object to control the flow of the game
const Game = (() => {
  let gameOver = false;

  const checkWin = (board, marker) => {                   // Can access the board through the .getboard
    const winConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],                    // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8],                    // columns
      [0, 4, 8], [2, 4, 6]                                // diagonals
    ];

    return winConditions.some(combination =>              // .some returns True if at least one combination contains a marker (X or O).
      combination.every(index => board[index] === marker) //. every returns True if ALL combinations contain the same marker.
    );
  };

  const checkDraw = (board) => !board.some(cell => cell === ''); // If there are no empty cells, return True.

  const handleCellClick = (index) => {
    if (!gameOver && Gameboard.markCell(index, currentPlayer.marker)) {
      render();
      if (checkWin(Gameboard.getBoard(), currentPlayer.marker)) {
        alert(`${currentPlayer.name} wins!`);
        gameOver = true;
      } else if (checkDraw(Gameboard.getBoard())) {
        alert('It\'s a draw!');
        gameOver = true;
      } else {
        switchPlayer();
      }
    }
  };
});