import { useNavigate } from 'react-router-dom';
import './Home.css'
import { useEffect, useRef, useState } from 'react';
import Alert from '../Alert';
function Home({ socket, color, setColor, setRoom, room }) {
    const navigate = useNavigate();

    const isValidColor = () => {
        return color.current !== -1;
    }
    const join_room =  () => {
        if (isValidColor() && room !== "") {
            socket.emit('join_room',  room );
        }
    };
    useEffect(() => {
        const handleJoinRoom = (data) => {
            color.current = data;
            if (isValidColor) navigate('/chess-room');
        }
        socket.on('join_room', handleJoinRoom);
        
        return () => socket.off('join_room', handleJoinRoom);
      }, [socket]);
    return (
        <div>
            <Alert isVisible={!isValidColor()}></Alert>
            <div class="card">
            <div class="card-body">
                <h3>Chess-Room</h3>
                <br/>
                <input 
                    class="form-control form-control-lg" 
                    type="text" 
                    placeholder="Room Code" 
                    aria-label=".form-control-lg example"
                    onChange={(e) => setRoom(e.target.value)}></input>
                <br/>
                <button type="button" class="btn btn-primary btn-lg" onClick={join_room}>Go To Room </button>
                <br/>
                <br/>
                <br/>
                <br/>
                <button type="button" class="btn btn-primary btn-lg">Create Room</button>
                <br/>
                <br/>
             </div>
        </div>
        </div>

    )
}

export default Home;