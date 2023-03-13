class RoomManagement {
    constructor() {
        this.rooms = [];
    }

    addRoom(id, socketId, maxUsers) {
        const room = { id, socketId, maxUsers, users: [] };
        this.rooms.push(room);
        return room;
    }

    removeRoom(id) {
        const removedRoom = this.rooms.filter((room) => room.id == id)[0];

        if (removedRoom) {
            this.room = this.rooms.filter((room) => room.id != id);
        }

        return removedRoom;
    }

    getRoom(id) {
        return this.rooms.find((room) => room.id == id);
    }

    addUser(roomId, user) {
        const room = this.getRoom(roomId);

        if (room.Users.length >= room.maxUsers) {
            return false;
        }

        room.Users.push(user);
    }

    removeUser(roomId, userId) {
        const room = this.getRoom(roomId);

        room.users.filter((user) => user.userId != userId);
    }

    getUsers(roomId) {
        const room = this.getRoom(roomId);
        return room.users;
    }

    // updateUserstatus(roomId, userId, playerIsReady) {
    //     const room = this.getRoom(roomId);
    //     const player = room.Users.filter((player) => player.playerId === playerId)[0];

    //     if (player == null) {
    //         return false;
    //     }

    //     player.isReady = playerIsReady;
    // }

    addToUserscore(roomId, userId, score) {
        const room = this.getRoom(roomId);
        const user = room.users.filter((user) => user.userId == userId)[0];

        if (user == null) {
            return false;
        }

        user.score += score;
    }

    // allReady(roomId) {
    //     const room = this.getRoom(roomId);
    //     room.Users.forEach((player) => {
    //         if (player.isReady === false) {
    //             return false;
    //         }
    //     });

    //     return true;
    // }

    roomExists(id) {
        const found = this.rooms.find((room) => room.id === id);

        if (found) {
            return true;
        }

        return false;
    }
}

module.exports = RoomManagement;
