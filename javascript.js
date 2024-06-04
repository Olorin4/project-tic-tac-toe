// TIC TAC TOE

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
      name: "Player 1",
      marker: "X"
    },
    {
      name: "Player 2",
      marker: "O"
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
  const skynet = Player.getPlayers()[2];
  let currentPlayer = player1;
  let gameOver = false;
  let turnCounter = 1;
  let multiplayer = false;

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
    currentPlayer = currentPlayer === player1 ? (multiplayer ? player2 : skynet) : player1;
    turnCounter++;
    DisplayController.updateTurnCounter(turnCounter);
  };

  const handlePlayerClick = (index) => {
    if (!gameOver && Gameboard.markCell(index, currentPlayer.marker)) {
      DisplayController.render();
      if (checkWin(Gameboard.getBoard(), currentPlayer.marker)) {
        DisplayController.showResult(`${currentPlayer.name} wins!`);
        gameOver = true;
      } else if (checkDraw(Gameboard.getBoard())) {
        DisplayController.showResult("It's a draw!");
        gameOver = true;
      } else {
        switchPlayer();
        if (!multiplayer && currentPlayer === skynet) {
          handleSkynetClick();
        }
      }
    }
  };

  const handleSkynetClick = () => {
    let index;
    do {
      index = Math.floor(Math.random() * 9);
    } while (!Gameboard.isCellEmpty(index));

    if (Gameboard.markCell(index, skynet.marker)) {
      DisplayController.render();
      if (checkWin(Gameboard.getBoard(), skynet.marker)) {
        DisplayController.showResult("Skynet wins! The future is now uncertain...");
        gameOver = true;
      } else if (checkDraw(Gameboard.getBoard())) {
        DisplayController.showResult("It's a draw! Skynet's launch countdown is reset. Play again to prevent it from launching its nukes.");
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
    turnCounter = 1;
    DisplayController.updateTurnCounter(turnCounter);
    DisplayController.render();
  };

  const isGameOver = () => gameOver;

  const setMultiplayer = (value) => {
    multiplayer = value;
  };
  
  return { handlePlayerClick, resetGame, isGameOver, setMultiplayer };
})();
                                  // ---***END OF Game Module***---
                                  
                                  // ---***Display Controller Module: Handles the display and DOM logic***---
const DisplayController = (() => {
  const cells = document.querySelectorAll('.cell');
  const singlePlayerButton = document.querySelector('.single-player');
  const multiplayerButton = document.querySelector('.multiplayer');
  const output = document.querySelector('.output-display');
  const turnCounter = document.querySelector('.turn-counter');
  const resetButton = document.querySelector('.resetButton');

  const render = () => {
    const board = Gameboard.getBoard();
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
      if (!Game.isGameOver()) {
        Game.handlePlayerClick(index);
      }
    });
  });

  const singlePlayer = (() => {
    singlePlayerButton.addEventListener('click', (e) => {
      e.preventDefault();
      output.textContent = "You must defeat Skynet to prevent it from launching its nukes."
      Game.setMultiplayer(false);
      createStartGameButton();
    });
  })();

  const multiplayer = (() => {
    multiplayerButton.addEventListener('click', (e) => {
      e.preventDefault();
      output.textContent = "Two Player Mode. Take turns to play.";
      Game.setMultiplayer(true);
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
      output.textContent = "Game started!";
      updateTurnCounter(1);
      startGameButton.remove();
      Game.resetGame();
      // Add additional logic to start single game
    });
  };

  const updateTurnCounter = (turn) => {
    turnCounter.textContent = `Turn ${turn}`;
    output.textContent = "";
  };

  const showResult = (message) => {
    turnCounter.remove();
    output.textContent = message;
  };

  resetButton.addEventListener('click', () => {
    Game.resetGame();
    output.textContent = "Please choose game mode.";
  });

  return { render, updateTurnCounter, showResult };
})();
                                    // ---***END OF Display Controller Module***---     
            
                                    




// TO DO:
// - Prevent clicks when game is not started.
// - Add multiplayer functionality.
// - Add more complex AI game logic.
// - Upgrade UI.