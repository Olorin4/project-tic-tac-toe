// TIC TAC TOE

                     // ---***Gameboard Class: Handles the game state***---
class Gameboard {
  #board;

  constructor() {
    this.#board = ["", "", "", "", "", "", "", "", ""];
  }

  getBoard() {
    return this.#board;
  }

  isCellEmpty(index) {
    return this.#board[index] === "";
  }

  markCell(index, marker) {
    if (this.isCellEmpty(index)) {
      this.#board[index] = marker;
      return true;
    }
    return false;
  }

  resetBoard() {
    this.#board = ["", "", "", "", "", "", "", "", ""];
  }
}
                     // ---***END OF Gameboard Class***---
  

                     // ---***Player Class: Creates player objects***---
class Player {
  constructor(name, marker) {                     
    this.name = name;
    this.marker = marker;
  }
}                                                
                     // ---***END OF Players Class***---


                     // ---***Game Class: Controls the flow of the game***---
class Game {
  constructor(displayController) {
    this.players = [
      new Player("Player 1", "X"),
      new Player("Player 2", "O"),
      new Player("Skynet", "O")
    ];
    this.currentPlayer = this.players[0];
    this.gameOver = false;
    this.turnCounter = 1;
    this.multiplayer = false;
    this.board = new Gameboard();
    this.displayController = displayController;
  }

  setMultiplayer(isMultiplayer) {
    this.multiplayer = isMultiplayer;
  }

  getMultiplayer() {
    return this.multiplayer;
  }

  checkWin(marker) {
    const winConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],        // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8],        // columns
      [0, 4, 8], [2, 4, 6]                    // diagonals
    ];

    return winConditions.some(combination =>
      combination.every(index => this.board.getBoard()[index] === marker)
    );
  }

  checkDraw() {
    return !this.board.getBoard().some(cell => cell === '');
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === this.players[0] ? this.players[1] : this.players[0];
    this.displayController.updateTurnCounter(this.turnCounter);
  }

  handlePlayerClick(index) {
    if (!this.gameOver && this.board.markCell(index, this.currentPlayer.marker)) {
      this.displayController.render();
      if (this.checkWin(this.currentPlayer.marker)) {
        if (this.getMultiplayer()) {
          this.displayController.showResult(`${this.currentPlayer.name} wins!`);
        } else {
          this.displayController.showResult("You win!");
        }
        this.gameOver = true;
      } else if (this.checkDraw()) {
        this.displayController.showResult("It's a draw!");
        this.gameOver = true;
      } else {
        this.turnCounter++;
        if (this.getMultiplayer()) {
          this.switchPlayer();
        } else {
          this.handleSkynetClick();
        }
      }
    }
  }

  handleSkynetClick() {
    let index;
    do {
      index = Math.floor(Math.random() * 9);
    } while (!this.board.isCellEmpty(index));

    if (this.board.markCell(index, this.players[2].marker)) {
      this.displayController.render();
      if (this.checkWin(this.players[2].marker)) {
        this.displayController.showResult("Skynet wins! The future is now uncertain...");
        this.gameOver = true;
      } else if (this.checkDraw()) {
        this.displayController.showResult("It's a draw! Skynet's launch countdown is reset. Play again to prevent it from launching its nukes.");
        this.gameOver = true;
      } else {
        this.turnCounter++;
        this.displayController.updateTurnCounter(this.turnCounter);
      }
    }
  }

  resetGame() {
    this.board.resetBoard();
    this.currentPlayer = this.players[0];
    this.gameOver = false;
    this.turnCounter = 1;
    this.displayController.updateTurnCounter(this.turnCounter);
    this.displayController.render();
    this.displayController.disableCells();
  }

  isGameOver() {
    return this.gameOver;
  }
}
                     // ---***END OF Game Class***---
                                  
                     // ---***Display Controller Class: Handles the display and DOM logic***---
class DisplayController {
  constructor(game) {
    this.cells = document.querySelectorAll('.cell');
    this.singlePlayerButton = document.querySelector('.single-player');
    this.multiplayerButton = document.querySelector('.multiplayer');
    this.output = document.querySelector('.output-display');
    this.turnCounter = document.querySelector('.turn-counter');
    this.resetButton = document.querySelector('.resetButton');
    this.game = game;

    this.cells.forEach((cell, index) => {
      cell.addEventListener('click', () => {
        if (!this.game.isGameOver()) {
          this.game.handlePlayerClick(index);
        }
      });
    });

    this.singlePlayerButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.removeNameInputs();
      this.output.textContent = "You must defeat Skynet to prevent it from launching its nukes.";
      this.game.setMultiplayer(false);
      this.createStartGameButton();
    });

    this.multiplayerButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.output.textContent = "Two Player Mode. Please choose your names.";
      this.game.setMultiplayer(true);
      this.createNameInputs();
      this.createStartGameButton();
    });

    this.resetButton.addEventListener('click', () => {
      this.game.resetGame();
      this.output.textContent = "Please choose game mode.";
    });

    this.disableCells();
  }

  render() {
    const board = this.game.board.getBoard();
    this.cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  }

  enableCells() {
    this.cells.forEach(cell => {
      cell.classList.remove('disabled');
    });
  }

  disableCells() {
    this.cells.forEach(cell => {
      cell.classList.add('disabled');
    });
  }

  createStartGameButton() {
    if (!document.querySelector('.start-game')) {
      const startGameButton = document.createElement('button');
      startGameButton.classList.add('start-game');
      startGameButton.textContent = 'Start Game';

      const nameInputs = document.querySelector('.name-inputs');
      if (nameInputs) {
        this.output.insertAdjacentElement('afterend', startGameButton);
        startGameButton.insertAdjacentElement('beforebegin', nameInputs);
      } else {
        this.output.insertAdjacentElement('afterend', startGameButton);
      }

      startGameButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.game.getMultiplayer()) {
          const player1NameInput = document.querySelector('.player1-name');
          const player2NameInput = document.querySelector('.player2-name');
          if (player1NameInput && player2NameInput) {
            this.game.players[0].name = player1NameInput.value || "Player 1";
            this.game.players[1].name = player2NameInput.value || "Player 2";
          }
        }
        this.output.textContent = "Game started!";
        this.updateTurnCounter(1);
        startGameButton.remove();
        this.removeNameInputs();
        this.game.resetGame();
        this.enableCells();
      });
    }
  }

  createNameInputs() {
    if (!document.querySelector('.name-inputs')) {
      const nameInputs = document.createElement('div');
      nameInputs.classList.add('name-inputs');
      nameInputs.innerHTML = `
        <input type="text" class="player1-name" placeholder="Player 1 Name">
        <input type="text" class="player2-name" placeholder="Player 2 Name">
      `;
      this.output.insertAdjacentElement('afterend', nameInputs);
    }
  }

  removeNameInputs() {
    const nameInputs = document.querySelector('.name-inputs');
    if (nameInputs) {
      nameInputs.remove();
    }
  }

  updateTurnCounter(turn) {
    if (this.game.getMultiplayer()) {
      const players = this.game.players;
      const currentPlayer = turn % 2 === 1 ? players[0].name : players[1].name;
      this.turnCounter.textContent = `It's ${currentPlayer}'s turn`;
    } else {
      this.turnCounter.textContent = `Turn ${Math.ceil(turn / 2)}`;
    }
    this.output.textContent = "";
  }

  showResult(message) {
    this.turnCounter.remove();
    this.disableCells();
    this.output.textContent = message;
  }
}
                       // ---***END OF Display Controller Class***---        
                                  
                     // ---***Initialize the game***---
const displayController = new DisplayController();
const game = new Game(displayController);
displayController.game = game;                   



// TO DO:
// - Add more complex AI game logic.
// - Upgrade UI.