const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:4000",
        methods: ["GET", "POST"]
    }
});

io.use((socket , next) => {
    const account = socket.handshake.auth;
    if(!Object.keys(account).length) {
        return next(new Error("Invalid email or password is wrong"));
    }
    socket.account = account;
    next();
})

io.on('connection', (socket) => {
    const users = [];
    io.of('/').sockets.forEach((item,index) => {
        users.push({
            id: item?.id,
            account: item?.account
        })
    })

    socket.emit("getAllUser", users);

    socket.broadcast.emit("userConnected", {
        id: socket?.id,
        account: socket?.account
    })

    socket.on("privateMessage", ({ message, to }) => {
        socket.to(to).emit("messageToReceiver", {
            message,
            from: socket?.id
        })
    })

    socket.on('disconnect', () => {
        console.log('disconnect');
    })
});

server.listen(5000, () => {
  console.log('listening on *:5000');
});
