const app = require('express')();
const http = require('http').createServer(app);
const PORT = 8080;
const { generateId } = require('./utils')
const io = require('socket.io')(http,{ 
    cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }});

http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});

io.on('connection', (socket) => { /* socket object may be used to send specific messages to the new connected client */
    console.log('new client connected');
    socket.emit('connection', null);
    socket.on('newGame', () => {
      const id = generateId();
      socket.join(id);
      const room = roomManager.addRoom(id, socket.id, 8);
      io.to(id).emit('newGame', room);
    });
});