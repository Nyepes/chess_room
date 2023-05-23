import './App.css';
import { useState } from 'react';
import { Chessboard } from "react-chessboard";
import {Chess} from "chess.js";



function App() {
  let selected = null;
  const [game, setGame] = useState(new Chess());
  // white_turn = true;
  function makeAMove(move) {
    const gameCopy = Object.assign(Object.create(Object.getPrototypeOf(game)), game);
    // const result = gameCopy.move(move)
    const result = gameCopy.move(move);
    if (result === null) return result;
    setGame(gameCopy);
    return result; // null if the move was illegal, the move object if the move was legal
  }
  function onDrop(sourceSquare, targetSquare) {
    //TODO Manage Under promotions
    if (sourceSquare === null || game.get(sourceSquare).color === game.get(targetSquare).color) {
      return false;
    }
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });
        // illegal move
    // if (move === null) return false;
    return true;
  }
  function onSquareClick(square) {
    if (game.get(square).color == game.turn() || (game.get(square).color == game.turn() && selected === null)) selected = square;
    else {
      const move = makeAMove({from: selected, to: square, promotion:"q"});
      if (move !== null) {
        selected = null;
        return true;
      } else {
        return false;
      }
    }
  }
  return (
    <div>
      <Chessboard position={game.fen()} boardWidth={500} onPieceDrop={onDrop} arePremovesAllowed={true}/>;
    </div>
  );
    
}

export default App;