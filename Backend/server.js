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
        const { room } = data
        socket.join(room);
        chatRoom = room;
    });

    socket.on('make_move', (data) => {
        const move = data;
        // console.log(move);
        io.emit('recieve_move', move);
    });

});

server.listen(4000, () => 'Server is running on port 3000');