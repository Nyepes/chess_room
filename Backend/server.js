const app = require('express')()
const server = require('http').createServer(app)
const socket_io = require('socket.io')(server)

server.listen(4444, () => {
    console.log("Server Started")
})

