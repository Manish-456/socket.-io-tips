const express = require("express");
const app = express();
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
app.use(cors());
const server = http.createServer(app);

const port = process.env.PORT || 9000;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    method: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on('join_room', (room) => {
    socket.join(room);
  })
  socket.on("notification", notification => {
    socket.broadcast.to(notification.room).emit("receive_notification", notification);
  })

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  })
});

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

server.listen(port, () => {
  console.log("Server running on port ", port);
});


// important tips of socket.io

// sending to sender-client only
// socket.emit('message', "this is a test");

// sending to all clients, include sender
// io.emit('message', "this is a test");

// sending to all clients except sender
// socket.broadcast.emit('message', "this is a test");

// sending to all clients in 'game' room(channel) except sender
// socket.broadcast.to('game').emit('message', 'nice game');

// sending to all clients in 'game' room(channel), include sender
// io.in('game').emit('message', 'cool game');

// sending to sender client, only if they are in 'game' room(channel)
// socket.to('game').emit('message', 'enjoy the game');

// sending to all clients in namespace 'myNamespace', include sender
// io.of('myNamespace').emit('message', 'gg');

// sending to individual socketid
// socket.broadcast.to(socketid).emit('message', 'for your eyes only');

// list socketid
// for (var socketid in io.sockets.sockets) {}
// or
// Object.keys(io.sockets.sockets).forEach((socketid) => {});