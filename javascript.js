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
  const setPlayerName = (index, name) => {
    players[index].name = name;
  };

  return { getPlayers, setPlayerName };                                // The two players objects are made public
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

  const setMultiplayer = (isMultiplayer) => {
    multiplayer = isMultiplayer;
  };

  const getMultiplayer = () => multiplayer;

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
    DisplayController.updateTurnCounter(turnCounter);
  };
  
  const handlePlayer1Click = (index) => {
    if (!gameOver && Gameboard.markCell(index, player1.marker)) {
      DisplayController.render();
      if (checkWin(Gameboard.getBoard(), player1.marker)) {
        DisplayController.showResult("Congratulations, you defeated Skynet! Humanity is safe.");
        gameOver = true;
      } else if (checkDraw(Gameboard.getBoard())) {
        DisplayController.showResult("It's a draw! Skynet's launch countdown is reset. Play again to prevent it from launching its nukes.");
        gameOver = true;
      } else {
        turnCounter++;
        if (Game.getMultiplayer()) {
          switchPlayer();
        } else {
          handlePlayer2Click();
        }
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
        DisplayController.showResult("Skynet wins! The future is now uncertain...");
        gameOver = true;
      } else if (checkDraw(Gameboard.getBoard())) {
        DisplayController.showResult("It's a draw! Skynet's launch countdown is reset. Play again to prevent it from launching its nukes.");
        gameOver = true;
      } else {
        turnCounter++;
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
    DisplayController.disableCells();
  };

  const isGameOver = () => gameOver;
  
  return { handlePlayer1Click, resetGame, isGameOver, setMultiplayer, getMultiplayer };
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

  const enableCells = () => {
    cells.forEach(cell => {
      cell.classList.remove('disabled');
    });
  };

  const disableCells = () => {
    cells.forEach(cell => {
      cell.classList.add('disabled');
    });
  };

  cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
      if (!Game.isGameOver()) {
        Game.handlePlayer1Click(index);
      }
    });
  });

  const singlePlayer = (() => {
    singlePlayerButton.addEventListener('click', (e) => {
      e.preventDefault();
      removeNameInputs();
      output.textContent = "You must defeat Skynet to prevent it from launching its nukes.";
      Game.setMultiplayer(false);
      createStartGameButton();
    });
  })();
  
  const multiplayer = (() => {
    multiplayerButton.addEventListener('click', (e) => {
      e.preventDefault();
      output.textContent = "Two Player Mode. Please choose your names.";
      Game.setMultiplayer(true);
      createNameInputs();
      createStartGameButton();
    });
  })();
  
  const createStartGameButton = () => {
    if (!document.querySelector('.start-game')) {
      const startGameButton = document.createElement('button');
      startGameButton.classList.add('start-game');
      startGameButton.textContent = 'Start Game';
  
      const nameInputs = document.querySelector('.name-inputs');
      if (nameInputs) {
        // Append inputs before the start button
        output.insertAdjacentElement('afterend', startGameButton);
        startGameButton.insertAdjacentElement('beforebegin', nameInputs);
      } else {
        // If there are no name inputs, just append the start button after the output
        output.insertAdjacentElement('afterend', startGameButton);
      }
  
      startGameButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (Game.setMultiplayer) {
          const player1NameInput = document.querySelector('.player1-name');
          const player2NameInput = document.querySelector('.player2-name');
          if (player1NameInput && player2NameInput) {
            Player.setPlayerName(0, player1NameInput.value || "Player 1");
            Player.setPlayerName(1, player2NameInput.value || "Player 2");
          }
        }
        output.textContent = "Game started!";
        updateTurnCounter(1);
        startGameButton.remove();
        removeNameInputs();
        Game.resetGame();
        enableCells();
      });
    }
  };
  
  const createNameInputs = () => {
    if (!document.querySelector('.name-inputs')) {
      const nameInputs = document.createElement('div');
      nameInputs.classList.add('name-inputs');
      nameInputs.innerHTML = `
        <input type="text" class="player1-name" placeholder="Player 1 Name">
        <input type="text" class="player2-name" placeholder="Player 2 Name">
      `;
      output.insertAdjacentElement('afterend', nameInputs);
    }
  };
  
  const removeNameInputs = () => {
    const nameInputs = document.querySelector('.name-inputs');
    if (nameInputs) {
      nameInputs.remove();
    }
  };

  const updateTurnCounter = (turn) => {
    if (Game.getMultiplayer()) {
      const players = Player.getPlayers();
      const currentPlayer = turn % 2 === 1 ? players[0].name : players[1].name;
      turnCounter.textContent = `It's ${currentPlayer}'s turn`;
    } else {
      turnCounter.textContent = `Turn ${Math.ceil(turn / 2)}`;
    }
    output.textContent = "";
  };

  const showResult = (message) => {
    turnCounter.remove();
    disableCells();
    output.textContent = message;
  };

  resetButton.addEventListener('click', () => {
    Game.resetGame();
    output.textContent = "Please choose game mode.";
  });

  disableCells();

  return { render, updateTurnCounter, showResult, disableCells };
})();
                                    // ---***END OF Display Controller Module***---     
            
                                    




// TO DO:
// - Add more complex AI game logic.
// - Upgrade UI.