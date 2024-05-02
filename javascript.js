const Gameboard = (() => {
  let emptySquare;
  const board = [
    [emptySquare, emptySquare, emptySquare],
    [emptySquare, emptySquare, emptySquare],
    [emptySquare, emptySquare, emptySquare]
  ];

  return { getBoard: () => board };                     // Return an object with the getBoard method,
})();                                                   // which retrieves the board array.
  
console.log(Gameboard.getBoard());
  

  