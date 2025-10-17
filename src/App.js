import {useState} from "react";
import Title from "./Title";

//Function to add custom value to individual cell
function Square({value, onSquareClick}){
  return (<button onClick = {onSquareClick} className = "square">{value}</button>);
}

//The main area where grid and the Winner text lies
function Board({xIsNext, squares, onPlay}) {

  //at each call we check whether a user has won or not
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner : ' + winner;
  } else {
    status = 'Next player : ' + (xIsNext ? 'X' : 'O');
  }

  //function to insert the appropriate value in the cell
  function handleClick(i){
    if(squares[i] || calculateWinner(squares)){
      return; // preventing the change of the same cell again and again
    }
    //creating a copy of the array 
    const nextSquares = squares.slice();
    if(xIsNext){
      nextSquares[i] = "X";
    } else{
      nextSquares[i] = "O";
    }
    //creates a history for our moves
    onPlay(nextSquares);
  }
  return (
    <>
      <div className="status">{status}</div>
        {Array.from({ length: 3 }).map((_, row) => (
        <div key={row} className="board-row">
          {Array.from({ length: 3 }).map((_, col) => {
            const index = row * 3 + col; // convert row/col to index (0–8)
            return (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

//main component of this page, handles the moves, and the grid with the display message on
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const[currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove%2===0;
  const currentSquares = history[currentMove];
  
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove+1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length-1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move)=>{
    let description;
    if(move>0){
      description = "Go to move #"+move;
    }else{
      description = "Go to game start";
    }
    return (
      <li key = {move}>
        <button onClick = {()=> jumpTo(move)}>{description}</button>
      </li>
    );
  });
  return (
    <div className = "MainContainer"><Title/>
    <div className = "game">
      <div className = "game-board">
        <Board xIsNext = {xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className = "game-info">
        <ol>{moves}</ol>
      </div>
    </div>
    </div>
  );
}

function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for(let i = 0;i<lines.length;i++){
    const [a, b, c] = lines[i];
    if(squares[a]&&squares[a] === squares[b] && squares[a] === squares[c]){
      return squares[a];
    }
  }
  return null;
}