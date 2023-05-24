import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home  from "./Home"
import ChessGame  from "./ChessGame"
import io from 'socket.io-client'
const socket = io.connect('http://localhost:4000')
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/chess-room" element={<ChessGame/>}/>
      </Routes>
    </Router>
  )
}

export default App;