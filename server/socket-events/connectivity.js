const Users = require('../libs/users');

module.exports = (Io) => {

  Io.use((socket, next) => {
    let token = socket.handshake.query.token;
    console.log('token', token);
    // if (isValid(token)) {
    //   return next();
    // }
    // return next(new Error('authentication error'));
    return next();
  });

  Io.on('connection', function(socket) {
    console.log('A user connected');

    // Users.createSocker(id, socket);
    
    socket.on('disconnect', function() {
      console.log('user disconnected');
      Users.deleteUser(socket)
    });
  });

};