const express = require('express'), routes = require('./routes');
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
/*

// Se escucha al conectarce un nuevo socket (cliente)
io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  // Al recibir un nuevo mensaje, se envia a todos, menos al que lo envio.
  socket.on('message', (data) => {
    socket.broadcast.emit('message', data);
    console.log(data);
  });



  // Al unirse a un nuevo cuarto.
  socket.on('join', (roomId) => {
    const roomExist = io.sockets.adapter.rooms.has(roomId)



    // These events are emitted only to the sender socket.
    if (roomExist == false) {
      console.log(`Creating room ${roomId} and emitting room_created socket event`)
      socket.join(roomId)
      socket.emit('room_created', roomId)
      console.log(io.sockets.adapter.rooms)



    } else if (roomExist == true) {
      console.log(`Joining room ${roomId} and emitting room_joined socket event`)
      socket.join(roomId)
      socket.emit('room_joined', roomId)



    } else {
      console.log(`Can't join room ${roomId}, emitting full_room socket event`)
      socket.emit('full_room', roomId)
    }
  })





  socket.on('start_call', (roomId) => {
    console.log(`Broadcasting start_call event to peers in room ${roomId}`)
    socket.broadcast.to(roomId).emit('start_call')
  })



  socket.on('webrtc_offer', (event) => {
    console.log(`Broadcasting webrtc_offer event to peers in room ${event.roomId}`)
    socket.broadcast.to(event.roomId).emit('webrtc_offer', event.sdp)
  })


  
  socket.on('webrtc_answer', (event) => {
    console.log(`Broadcasting webrtc_answer event to peers in room ${event.roomId}`)
    socket.broadcast.to(event.roomId).emit('webrtc_answer', event.sdp)
  })
  


  socket.on('webrtc_ice_candidate', (event) => {
    console.log(event)
    console.log(`Broadcasting webrtc_ice_candidate event to peers in room ${event.roomId}`)
    socket.broadcast.to(event.roomId).emit('webrtc_ice_candidate', event)
  })


  // Al desconectarce un socket
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

*/


io.on('connection', function(socket){
	io.sockets.emit("user-joined", socket.id, io.engine.clientsCount, Object.keys(io.sockets.clients().sockets));

	socket.on('signal', (toId, message) => {
		io.to(toId).emit('signal', socket.id, message);
  });

  socket.on("message", function(data){
    io.sockets.emit("broadcast-message", socket.id, data);
  })

	socket.on('disconnect', function() {
		io.sockets.emit("user-left", socket.id);
	})
});





// Escuchar en el purto 3030

const port = process.env.PORT || 3030
server.listen(port, () => {
  console.log(`listening on *:${port}`);
});