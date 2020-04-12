const Users = require('../libs/users');

module.exports = (Io) => {

  Io.use(async (socket, next) => {
    let token = socket.handshake.query.token;
    console.debug(`Connectiong attempt by ${token}`);

    const user = await Users.getUserByToken(token);
    console.log('user found by token', user);
    if (token !== null) {
      console.log('allowing connection');
      return next();
    }
    console.log('prevengin user from connecting');
    return next(new Error('authentication error'));
  });

  Io.on('connection', async (socket) => {
    const token = socket.handshake.query.token;
    console.log('A user connected', token);

    await Users.createSocker(token, socket);
    
    socket.on('disconnect', function() {
      console.log('user disconnected');
      Users.deleteUser(socket)
    });
  });

};