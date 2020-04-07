require('dotenv').config();

const Express = require('express');
const App = Express();
const Http = require('http').createServer(App);
const Io = require('socket.io')(Http);
const SocketConnection = require('./libs/socket-connection');

App.use(Express.static('static'));

App.get('/', function(req, res){
  console.log('loading index.html');
  res.sendFile(__dirname + '/static/html/index.html');
});

Io.on('connection', function(socket){
  console.log('A user connected');

  SocketConnection.createUser(socket);
  
  socket.on('disconnect', function() {
    console.log('user disconnected');
    SocketConnection.deleteUser(socket)
  });
});

Http.listen(3000, function(){
  console.log('listening on *:3000');
});