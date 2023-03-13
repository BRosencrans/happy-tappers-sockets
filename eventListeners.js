const { userManagement, roomManagement, memGameManagement } = require("./management/index");

const rooms = new roomManagement();
const users = new userManagement();

function eventListeners(io) {
    io.on("connection", (socket) => {
        console.log("Socket id: " + socket.id);

        //Room Creation
        socket.on("new-room", (roomId) => {
            rooms.addRoom(roomId, socket.id, 4);
            console.log("current rooms", rooms);
            socket.emit("room-created", "welcome to HappyTappers, invite people you know to play!");
        });

        //User Joining Room
        socket.on("join-room", ({ roomId, username, userId }) => {
            if (rooms.roomExists(roomId) == false) {
                io.to(socket.id).emit("join-room-error", "Room not found.");
            }
            socket.join(roomId);
            const room = rooms.getRoom(roomId);
            console.log("room being joined", room);
            if (rooms.getUsers(roomId).length >= room.maxUsers) {
                io.to(socket.id).emit("join-room-error", "Room has max users.");
            }

            const newUser = users.addUser({ userId, roomId, socketId: socket.id, username });
            rooms.addUser(roomId, newUser);
            console.log("room after user joined", room);
            io.to(room.socketId).emit("user-num-changed", rooms.getUsers(roomId));
            io.to(socket.id).emit("joined-room");
        });

        //Leaving Room
        socket.on("leave-room", ({ roomId, userId }) => {
            if (rooms.getRoom(roomId) != null) {
                rooms.removeUser(roomId, userId);
                const room = rooms.getRoom(roomId);
                if (rooms.getUsers(roomId).length == 0) {
                    rooms.removeRoom(roomId);
                    console.log("rooms after empty room deleted", rooms);
                }
                io.to(room.socketId).emit("user-num-changed", rooms.getUsers(roomId));
                socket.leave(roomId);
                io.to(roomId).emit("left-room", `user ${socket.id} has left the room`);
            }
        });

        //Returning Room data updates
        socket.on("request-room-data", (roomId) => {
            const room = rooms.getRoom(roomId);
            let roomUsers;
            if (rooms.getUsers(roomId) != null) {
                roomUsers = rooms.getUsers(roomId);
            }
            io.to(roomId).emit("returned-room-data", { room, roomUsers });
        });
    });
}

module.exports = eventListeners;
