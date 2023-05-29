import './ChessGame.css';
import { useState, useEffect, useRef } from 'react';
import { Chessboard } from "react-chessboard";
import {Chess} from "chess.js";



function ChessGame({roomCode, socket}) {
  const [game, setGame] = useState(new Chess());
  const [color, setColor] = useState(1);
  const c = useRef(color);
  const g = useRef(game);
  function isWhite(){
    return c.current === 1? true : false;
  }

  useEffect(() => {
    const handleJoinRoom = (data) => {
      console.log(`color ${data}`);
      setColor(data);
      c.current = data;
    }
    socket.on('join_room', handleJoinRoom);

    return () => socket.off('join_room', handleJoinRoom);
  }, [socket]);

  useEffect(() => {
    const handleReceiveMove = (data) => {
      console.log(c.current)
      if (data.turn !== isWhite()) {
        const gameCopy = Object.assign(Object.create(Object.getPrototypeOf(g.current)), g.current);
        console.log(data.move);
        const result = gameCopy.move(data.move);
        console.log(result);
        setGame(gameCopy);
        g.current = gameCopy;
      }
    }
    socket.on('recieve_move', handleReceiveMove);
    return () => socket.off('recieve_move', handleReceiveMove);
  }, [socket]);

  function makeAMove(move) {
    const gameCopy = Object.assign(Object.create(Object.getPrototypeOf(g.current)), g.current);
    const result = gameCopy.move(move);
    if (result === null) return false;
    setGame(gameCopy);
    g.current = gameCopy;
    socket.emit('make_move', {move: move, room: roomCode, turn: isWhite()});
    return result; // null if the move was illegal, the move object if the move was legal
  }
  function onDrop(sourceSquare, targetSquare) {
    //TODO Manage Under promotions
    if (sourceSquare === null || g.current.get(sourceSquare).color === g.current.get(targetSquare).color) {
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
        position={g.current.fen()} 
        onPieceDrop={onDrop} 
        arePremovesAllowed={true}
        boardOrientation={isWhite()? 'white' : 'black'}/>
      <h6 align = "center" class= "timer">Time</h6>
    </div>
  );
    
}

export default ChessGame;