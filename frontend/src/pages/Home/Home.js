import { Link } from 'react-router-dom';
import './Home.css'
import { useEffect } from 'react';
function Home({ socket, room, setRoom, setColor }) {
    const join_room =  () => {
        if (room !== "") {
            let c = socket.emit('join_room',  room );
        }
    };
    return (
        <div>
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
                <Link to="/chess-room">
                    <button type="button" class="btn btn-primary btn-lg" onClick={join_room}>Go To Room </button>
                </Link>
                <br/>
                <br/>
                <br/>
                <br/>
                <Link to="/chess-room">
                    <button type="button" class="btn btn-primary btn-lg">Create Room</button>
                </Link>
                <br/>
                <br/>
             </div>
        </div>
        </div>

    )
}

export default Home;