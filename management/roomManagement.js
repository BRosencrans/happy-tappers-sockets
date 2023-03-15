class RoomManagement {
    constructor() {
        this.rooms = [];
    }

    addRoom(id, socketId, maxUsers) {
        const room = { id, socketId, maxUsers, users: [] };
        console.log("adding room", room);
        this.rooms.push(room);
        return room;
    }

    removeRoom(id) {
        if (this.roomExists(id)) {
            const removedRoom = this.rooms.filter((room) => room.id == id)[0];
            console.log(removedRoom);
            if (removedRoom) {
                this.room = this.rooms.filter((room) => room.id != id);
            }

            return removedRoom;
        }
    }

    getRoom(id) {
        if (this.roomExists(id)) {
            return this.rooms.find((room) => room.id == id);
        }
    }

    addUser(roomId, user) {
        const room = this.getRoom(roomId);
        console.log("room to add user", room);
        if (room.users.length >= room.maxUsers) {
            return false;
        }

        room.users.push(user);
    }

    removeUser(roomId, userId) {
        // if (this.roomExists(roomId)) {
        //     const room = this.getRoom(roomId);
        //     console.log("room to remove user", room);
        //     room.users.filter((user) => user.userId !== userId);
        // }
        console.log(this.rooms.find((room) => room.id == roomId));
        if (this.roomExists(roomId)) {
            const updateUsers = this.getRoom(roomId).users.filter((user) => user.userId !== userId);
            console.log(updateUsers);
            this.getRoom(roomId).users = updateUsers;
        }
    }

    // removeUser(socketId) {
    //     // loop over rooms to find room with user that has this socket id
    //     console.log("removing user", socketId);
    //     console.log(this);
    //     for (let i = 0; i < this.rooms.length; i++) {
    //         console.log("room object: ", this.rooms[i]);
    //         const currUsers = this.rooms[i].users;
    //         console.log("current users", currUsers);
    //         const targetUser = currUsers.find((user) => user.socketId == socketId);
    //         console.log("target user", targetUser);
    //         if (targetUser) {
    //             console.log(this.rooms[i]);
    //             const targetIndex = currUsers.indexOf(targetUser);
    //             console.log(targetIndex);
    //             const updatedUsers = this.rooms[i].users.splice(targetIndex, 1);
    //             console.log(updatedUsers);
    //             this.rooms[i].users = updatedUsers;
    //             console.log(this.rooms[i]);
    //         }
    //     }

    // }

    getUsers(roomId) {
        if (this.roomExists(roomId)) {
            const room = this.getRoom(roomId);
            return room.users || [];
        }
    }

    addToUserScore(roomId, userId, score) {
        const room = this.getRoom(roomId);
        const user = room.users.filter((user) => user.userId == userId)[0];

        if (user == null) {
            return false;
        }

        user.score += score;
    }

    roomExists(id) {
        const found = this.rooms.find((room) => room.id === id);

        if (found) {
            return true;
        }

        return false;
    }
}

module.exports = RoomManagement;
