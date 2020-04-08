require('dotenv').config();

const Express = require('express');
const App = Express();
const Http = require('http').createServer(App);
const Mongo = require('./libs/db');
const Io = require('socket.io')(Http);
const SocketConnection = require('./libs/users');

const SERVER_PORT = process.env.SERVER_PORT;

Io.on('connection', function(socket) {
  console.log('A user connected');

  SocketConnection.createUser(socket);
  
  socket.on('disconnect', function() {
    console.log('user disconnected');
    SocketConnection.deleteUser(socket)
  });
});

const runServer = async () => {
  console.log('starting server ...');
  await Mongo.init();
  await Mongo.dropDatabase();

  Http.listen(SERVER_PORT, function(){
    console.log(`listening on *:${SERVER_PORT}`);
  });
};

runServer();