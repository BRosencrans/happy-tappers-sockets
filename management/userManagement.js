class userManagement {
    constructor() {
        this.users = [];
    }

    addUser({ userId, roomId, socketId, username }) {
        const user = {
            userId,
            roomId,
            socketId,
            username,
            score: 0,
        };
        this.users.push(user);
        return user;
    }

    removeUser({ userId }) {
        const leavingUser = this.users.find((user) => user.userId === userId);

        if (leavingUser) {
            this.users = this.users.filter((user) => user.userId !== userId);
        }
        return leavingUser;
    }

    getUser(userId) {
        return this.users.find((user) => user.userId === userId);
    }
}

module.exports = userManagement;
