import './ChessGame.css';
import { useState, useEffect, useRef } from 'react';
import { Chessboard } from "react-chessboard";
import {Chess} from "chess.js";
import EndGameAlert from './EndGameAlert';



function ChessGame({roomCode, socket, color, setColor}) {
  const started = useRef(false);
  const [game, setGame] = useState(new Chess());
  const g = useRef(game);
  function isWhite() {
    return color.current === 1;
  }
  function getColor() {
    return isWhite()? 'w' : 'b';
  }
  useEffect( () => {
    const handleDisconnect = () => {
      alert('Opponent Disconnected. You win');
    }
    socket.on('user_disconnect', handleDisconnect);
    return () => socket.off('user_disconnect', handleDisconnect);
  }, [socket])
  useEffect( () => {
    const startGame = () => {
      started.current = true;
    }
    socket.on('start_game', startGame);
    return () => socket.off('start_game', startGame);
  }, [socket])
  useEffect(() => {
    const handleReceiveMove = (data) => {
      if (data.turn !== isWhite()) {
        makeAMove(data.move)
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
    if (g.current.isGameOver()) {
      alert('game_over');
    }
    return result; // null if the move was illegal, the move object if the move was legal
  }
  function onDrop(sourceSquare, targetSquare) {
    // TODO Manage Under promotions
    if (sourceSquare === null || 
      g.current.get(sourceSquare).color === g.current.get(targetSquare).color ||
      g.current.get(sourceSquare).color !== getColor() || !started.current) {
      return false;
    }
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });
    socket.emit('make_move', {move: move, room: roomCode, turn: isWhite()});
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