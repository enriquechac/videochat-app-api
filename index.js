const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);


//Inicializacion de SocketIo
// Ademas abro el cross origin al local host.
const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    }
  });



//GET Se envia un html al cargar el api en la link
app.get('/', (req, res) => {
  res.send('<h1>API del VIDEOCHAT by enriquechac</h1>');
});


// Se escucha al conectarce un nuevo socket (cliente)
io.on('connection', (socket) => {
  console.log('Se conecto un nuevo usuario con id: ', socket.id);

  // Al recibir un nuevo mensaje, se envia a todos, menos al que lo envio.
  socket.on('message', (data) => {
    socket.broadcast.emit('message', data);
    console.log(data);
  });



  // Al unirse a un nuevo cuarto.
  socket.on('room:join', (roomId) => {
    const roomExist = io.sockets.adapter.rooms.has(roomId);

    // Si no existe la habitacion, se crea y se le envia al usuario.
    if (roomExist == false) {
      console.log(`Creando room ${roomId} y enviando room:created`)
      socket.join(roomId)
      socket.emit('room:created', roomId)

    } else if (roomExist == true) {
      console.log(`Uniendose a room: ${roomId} y enviando room:joined`)
      socket.join(roomId)
      socket.emit('room:join', roomId)
    } 
  })

  socket.on('room:joined', (roomId) => {
    socket.broadcast.to(roomId).emit('room:user_joined', socket.id)
  })

  socket.on('webrtc_offer', (event) => {
    console.log(`Enviando oferta a user con id: ${event.userID}`)
    socket.broadcast.to(event.userID).emit('webrtc_offer', event)
  })

  socket.on('webrtc_answer', (event) => {
    console.log(`Enviando respuesta a user con id ${event.userID}`)
    console.log(event)
    socket.broadcast.to(event.userID).emit('webrtc_answer', event)
  })
  socket.on('webrtc_ice_candidate', (event) => {
    console.log(`Enviando ice_candidate a user con id ${event.userID}`)
    socket.broadcast.to(event.userID).emit('webrtc_ice_candidate', event)
  })

  socket.on('disconnecting', () => {
    var rooms = Array.from(socket.rooms)
    io.to(rooms[1]).emit('room:user_disconect', socket.id)
  });
  // io.of("/").adapter.on("leave-room", (room, id) => {
  //   console.log(`socket ${id} has leave room ${room}`);
  // });

  // Al desconectarce un socket
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});





// Escuchar en el purto 3030

const port = process.env.PORT || 3030
server.listen(port, () => {
  console.log(`listening on *:${port}`);
});