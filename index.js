const app = require("express");
const http = require("http");
const PORT = 8080;

const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");

const server = http.createServer(app);
global.rooms = new Map();

// TODO: Change from localhost to deployed when ready
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://admin.socket.io/"],
        credentials: true,
    },
});

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});

//
io.on("connection", (socket) => {
    console.log("Socket id: " + socket.id);

    socket.on("new-room", (roomId) => {
        rooms.set(roomId, socket.id);
        console.log(rooms);
        socket.emit("new-msg", "welcome to HappyTappers, invite people you know to play!");
    });

    socket.on("join-room", (roomId) => {
        console.log(rooms);
        const roomData = rooms.has(roomId);
        console.log(roomData);
        if (roomData) {
            socket.join(roomId), socket.emit("join-msg", "welcome to HappyTappers");
        } else {
            socket.emit("wrong-way", "try another room");
        }
    });
});

instrument(io, {
    auth: false,
    mode: "development",
});
