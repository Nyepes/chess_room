import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home  from "./pages/Home/Home";
import ChessGame  from "./pages/ChessGame/ChessGame";
import io from 'socket.io-client';
import "./App.css";
const socket = io.connect('http://localhost:4000');
function App() {
  return (
    <Router class = "base">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/chess-room" element={<ChessGame/>}/>
      </Routes>
    </Router>
  )
}

export default App;