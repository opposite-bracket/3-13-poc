const Express = require('express');
const App = Express();
const Http = require('http').createServer(App);
const Io = require('socket.io')(Http);

App.use(Express.static('static'));

App.get('/', function(req, res){
  res.sendFile(__dirname + '/static/html/index.html');
});

Io.on('connection', function(socket){
  console.log('A user connected');
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

Http.listen(3000, function(){
  console.log('listening on *:3000');
});