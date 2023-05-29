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
        let clients = io.sockets.adapter.rooms.get(data);
        let size = clients? clients.size : 0;
        if (size != 2) return;
        let i = 0
        for (const client of clients) {
            console.log(client);
            io.to(client).emit('join_room', i);
            i += 1;
        }
        // io/*.to(clients.get(data)[0])*/.emit('join_room', 0);
        // io/*.to(clients.get(data)[1])*/.emit('join_room', 1);
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