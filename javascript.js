// TIC TAC TOE

console.log("Turn 1");


                                  // ---***Gameboard Module: Handles the game state***---
const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const isCellEmpty = (index) => board[index] === "";

  const markCell = (index, marker) => {            // Marks a cell only if it is empty
    if (isCellEmpty(index)) {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    board = ['', '', '', '', '', '', '', '', ''];
  };

  return { getBoard, isCellEmpty, markCell, resetBoard };// Return an object with the getBoard method,
})();                                               // which retrieves the board array.
                                  // ---***END OF Gameboard Module***---
  

                                  // ---***Player Factory: Creates player objects***---
const Player = (() => {
  const players = [                                 
    {
      name: "You",
      marker: "X"
    },
    {
      name: "Skynet",
      marker: "O"
    }
  ];

  const getPlayers = () => players;

  return { getPlayers };                                // The two players objects are made public
})();                                                   // indirectly, through the 'getPlayers' method.
                                  // ---***END OF Players Factory***---


                                  // ---***Game Module: Controls the flow of the game***---
const Game = (() => {
  const player1 = Player.getPlayers()[0];
  const player2 = Player.getPlayers()[1];
  let currentPlayer = player1;
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

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const handlePlayer1Click = (index) => {
    if (!gameOver && Gameboard.markCell(index, player1.marker)) {
      DisplayController.render();
      if (checkWin(Gameboard.getBoard(), player1.marker)) {
        console.log("Congratulations, you defeated Skynet! Humanity is safe.");
        gameOver = true;
      } else if (checkDraw(Gameboard.getBoard())) {
        console.log("It\'s a draw! Skynet\'s launch countdown is reset. Play again to prevent it from launching its nukes");
        gameOver = true;
      } else {
        handlePlayer2Click();
      }
    }
  };

  const handlePlayer2Click = () => {
    let index;
    do {
      index = Math.floor(Math.random() * 9);
    } while (!Gameboard.isCellEmpty(index));

    if (Gameboard.markCell(index, player2.marker)) {
      DisplayController.render();
      if (checkWin(Gameboard.getBoard(), player2.marker)) {
        console.log("Skynet wins! The future is now uncertain...");
        gameOver = true;
      } else if (checkDraw(Gameboard.getBoard())) {
        console.log("It's a draw! Skynet's launch countdown is reset. Play again to prevent it from launching its nukes.");
        gameOver = true;
      } else {
        switchPlayer();
      }
    }
  };

  const resetGame = () => {
    Gameboard.resetBoard();
    currentPlayer = player1;
    gameOver = false;
    DisplayController.render();
  };
  
  return { handlePlayer1Click, resetGame };
})();
                                  // ---***END OF Game Module***---
                                  
                                  // ---***Display Controller Module: Handles the display and DOM logic***---
const DisplayController = (() => {
  const cells = document.querySelectorAll('.cell');
  const singlePlayerButton = document.querySelector('.single-player');
  const output = document.querySelector('.output-display');
  const turn = document.querySelector('.turn-counter');
  const resetButton = document.querySelector('.resetButton');

  const render = () => {
    const board = Gameboard.getBoard();
    cells.forEach((cell, index) => {
      cell.textContent = Gameboard.getBoard()[index];
    });
  };

  cells.forEach((cell, index) => {
    cell.addEventListener('click', () => Game.handlePlayer1Click(index));
  });

  const singlePlayer = (() => {
    singlePlayerButton.addEventListener('click', (e) => {
      e.preventDefault();
      output.textContent = "You must defeat Skynet to prevent it from launching its nukes."
      createStartGameButton();
    });
  })();

  const createStartGameButton = () => {
    const startGameButton = document.createElement('button');
    startGameButton.classList.add('start-game');
    startGameButton.textContent = 'Start Game';
    output.insertAdjacentElement('afterend', startGameButton);
  
    startGameButton.addEventListener('click', (e) => {
      e.preventDefault();
      output.textContent = "Game started! Turn 1";
      updateTurnCounter(1);
      // Add additional logic to start the game
    });
  };

  const updateTurnCounter = (turn) => {
    turnCounterDisplay.textContent = `Turn ${turn}`;
  };

  resetButton.addEventListener('click', () => {
    Game.resetGame();
    output.textContent = "Please choose game mode.";
  });

  return { render };
})();
                                    // ---***END OF Display Controller Module***---
    
                                    // ---***                                  


// TO DO:
// 1. Replace console.logs with uI messages.
// 2. Add multiplayer & singleplayer functionality.
// 3. Add more complex AI game logic.
// 4. Upgrade UI.