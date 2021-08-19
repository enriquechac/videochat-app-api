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

io.on('connection', function(socket){
  console.log(io.engine.clientsCount);
  console.log(io.sockets);
  console.log();
	io.sockets.emit("user-joined", socket.id, io.engine.clientsCount, Object.keys(io.sockets.clients));

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