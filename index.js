const app = require('express');
const http = require('http')
const PORT = 8080;

const  { Server } = require ('socket.io')


const server = http.createServer(app);
global.rooms= new Map()


const io = new Server (server,{ 
    cors: {
    origin: "http://localhost:3000",
    
  }});

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});

io.on('connection', (socket) => { 

socket.on("new-room", (roomId) => {
  rooms.set(roomId, socket.id)
  console.log(roomId)
});
    
const { roomId } = socket.handshake.query;
socket.join(roomId)
   
    
   
    
});