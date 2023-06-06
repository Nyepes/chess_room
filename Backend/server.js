const express = require('express');
const app = express();
http = require('http');
const cors = require('cors');
const { Server } = require('socket.io')

app.use(cors()); // Add cors middleware

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});


io.on('connection', (socket) => {
    console.log(`User Connected ${socket.id}`)
    let roomKey = "";
    socket.on('disconnect', () => {
        io.to(roomKey).emit('user_disconnect')
        console.log(`User Disconnected: ${socket.id}`);
        
    })

    socket.on('join_room', (room) => {
        roomKey = room;
        let clients = io.sockets.adapter.rooms.get(room);
        let size = clients? clients.size : 0;
        if (size === 0) {
            socket.join(room);
            io.to(socket.id).emit('join_room', 1);
        } else if (size === 1) {
            socket.join(room);
            io.to(socket.id).emit('join_room', 0);
            for (let client of clients) {
                io.to(room).emit('start_game')
            }
        } else {
            io.to(socket.id).emit('join_room', -1);
        }
    });

    socket.on('make_move', (data) => {
        const move = data.move;
        const room = data.room;
        const turn = data.turn;
        console.log(room);
        io.to(room).emit('recieve_move', {move:move, turn: turn});
    });

});

server.listen(4000, () => 'Server is running on port 3000');