const { userManagement, roomManagement, memGameManagment } = require("./management/index");

const rooms = new roomManagement();
const users = new userManagement();

const cards = [
    { src: "/cards/budgie.png" },
    { src: "/cards/crane.png" },
    { src: "/cards/duck.png" },
    { src: "/cards/flamingo.png" },
    { src: "/cards/parrot.png" },
    { src: "/cards/penguin.png" },
    { src: "/cards/toucan.png" },
];

function eventListeners(io) {
    io.on("connection", (socket) => {
        console.log("Socket id: " + socket.id);

        //Room Creation
        socket.on("new-room", ({ roomId, username, userId }) => {
            rooms.addRoom(roomId, socket.id, 4);
            console.log("current rooms", rooms);
            socket.emit("room-created", "welcome to HappyTappers, invite people you know to play!");
            // add user to new room
            socket.join(roomId);
            const newUser = users.addUser(userId, roomId, socket.id, username);
            rooms.addUser(roomId, newUser);
            console.log(rooms.getRoom(roomId));
        });

        //User Joining Room
        socket.on("join-room", ({ roomId, username, userId }) => {
            console.log("room being joined", roomId);
            if (rooms.roomExists(roomId) == false) {
                io.to(socket.id).emit("join-room-error", "Room not found.");
            }

            const room = rooms.getRoom(roomId);
            if (rooms.getUsers(roomId).length >= room.maxUsers) {
                io.to(socket.id).emit("join-room-error", "Room has max users.");
            }
            // check for if user exists in room already

            socket.join(roomId);
            console.log("current rooms", rooms);
            socket.to(roomId).emit("joined-room", {
                message: `${username} joined the room.`,
                username: "SYSTEM",
            });
            const newUser = users.addUser(userId, roomId, socket.id, username);
            rooms.addUser(roomId, newUser);
            console.log("room after user joined", room);
            io.in(roomId).emit("user-num-changed", rooms.getUsers(roomId));
            // io.emit("user-num-changed"), rooms.getUsers(roomId);
        });

        //Leaving Room
        socket.on("leave-room", ({ roomId, userId }) => {
            console.log("LEAVE ROOM");
            // console.log("does the room exist", rooms.roomExists(roomId));
            // console.log("roomManagement", rooms);
            // console.log("roomId", roomId);
            // console.log("userId", userId[0]);
            console.log(roomId, userId[0]);
            // rooms.removeUser(socket.id);
            rooms.removeUser(roomId, userId[0]);
            const usersArr = rooms.getUsers(roomId);
            console.log("users left in room", usersArr);
            io.in(roomId).emit("user-num-changed", usersArr);
            socket.leave(roomId);
            if (rooms.getUsers(roomId).length == 0) {
                rooms.removeRoom(roomId);
                // console.log("rooms after empty room deleted", rooms);
            }

            // io.in(roomId).emit("left-room", `user ${socket.id} has left the room`);
        });

        //Returning Room data updates
        socket.on("request-room-data-joinroom", (roomId) => {
            console.log("request on join button");
            if (rooms.roomExists(roomId)) {
                const room = rooms.getRoom(roomId);
                io.to(socket.id).emit("returned-room-data", { room });
            } else {
                io.to(socket.id).emit("returned-room-data", false);
            }
        });

        socket.on("request-room-data", (roomId) => {
            console.log("request in room");
            if (rooms.roomExists(roomId)) {
                const room = rooms.getRoom(roomId);
                io.to(socket.id).emit("returned-room-data", { room });
            } else {
                io.to(socket.id).emit("returned-room-data", false);
            }
        });

        //game logic
        socket.on("start-game", (roomId) => {
            const memGame = new memGameManagment(rooms.getUsers(roomId));
        });

        socket.on("disconnect", () => {
            rooms.removeUser(socket.id);
        });
    });
}

module.exports = eventListeners;
