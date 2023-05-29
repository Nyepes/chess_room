import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home  from "./pages/Home/Home";
import ChessGame  from "./pages/ChessGame/ChessGame";
import io from 'socket.io-client';
import "./App.css";
import { useState, useEffect } from 'react';

const socket = io.connect('http://localhost:4000');
function App() {
  const [room, setRoom] = useState('');
  const [color, setColor] = useState(true);


  return (
    <Router class = "base">
      <Routes>
        <Route path="/" element={
          <Home 
            socket = { socket } 
            room = {room} 
            setRoom = {setRoom}
            setColor = {setColor}/>}/>
        <Route path="/chess-room" element={
          <ChessGame 
            roomCode = { room }
            socket = { socket }
            color = { color }
            />
        }/>
      </Routes>
    </Router>
  )
}

export default App;