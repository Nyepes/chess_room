import './ChessGame.css';
import { useState, useEffect } from 'react';
import { Chessboard } from "react-chessboard";
import {Chess} from "chess.js";



function ChessGame({roomCode, socket}) {
  const [game, setGame] = useState(new Chess());
  const [c, setColor] = useState(-1);
  function isWhite(){
    return c === 1? true : false;
  } 

  useEffect(() => {
    socket.on('join_room', (data) => {
      console.log(`color ${data}`);

      setColor(data);
    });
  }, [socket]);

  useEffect(() => {
    socket.on('recieve_move', (data) => {
      console.log(c)
      if (data.turn !== isWhite()) {
        const gameCopy = Object.assign(Object.create(Object.getPrototypeOf(game)), game);
        console.log(data.move);
        const result = gameCopy.move(data.move);
        console.log(result);
        setGame(gameCopy);
      }
    });
  }, [socket, c, game, setGame]);

  function makeAMove(move) {
    const gameCopy = Object.assign(Object.create(Object.getPrototypeOf(game)), game);
    const result = gameCopy.move(move);
    if (result === null) return false;
    setGame(gameCopy);
    socket.emit('make_move', {move: move, room: roomCode, turn: isWhite()});
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
    return move;
  }
  // function onSquareClick(square) {
  //   if (game.get(square).color === game.turn() || (game.get(square).color === game.turn() && selected === null)) selected = square;
  //   else {
  //     const move = makeAMove({from: selected, to: square, promotion:"q"});
  //     if (move !== null) {
  //       selected = null;
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }
  // }
  return (
    <div class = "board">
      <div class="alert alert-light alert-sm" role="alert">
        Room Code: { roomCode }
      </div>
      <h6 align = "center" class= "timer">Time</h6>
      <Chessboard 
        position={game.fen()} 
        onPieceDrop={onDrop} 
        arePremovesAllowed={true}
        boardOrientation={isWhite()? 'white' : 'black'}/>
      <h6 align = "center" class= "timer">Time</h6>
    </div>
  );
    
}

export default ChessGame;