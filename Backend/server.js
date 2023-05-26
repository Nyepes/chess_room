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

let chatRoom = '';

io.on('connection', (socket) => {
    console.log(`User Connected ${socket.id}`)
    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
    })
    socket.on('join_room', (data) => {
        socket.join(data);
        let clients = io.sockets.adapter.rooms;
        let size = clients.get(data)? clients.size : 0;
        if (size >= 2) return -1;
        if (size == 1) return 1;
        else return 0;
    });

    socket.on('make_move', (data) => {
        const move = data.move;
        const room = data.room;
        const turn = data.turn;
        console.log(turn);
        io.to(room).emit('recieve_move', {move:move, turn: turn});
    });

});

server.listen(4000, () => 'Server is running on port 3000');