const Users = require('../libs/users');

module.exports = (Io) => {

  Io.use(async (socket, next) => {
    let token = socket.handshake.query.token;
    console.debug(`Connectiong attempt by ${token}`);

    const user = await Users.getUserByToken(token);
    console.debug('user found by token', user, token);
    if (token !== null && user !== null) {
      console.debug('allowing connection');
      return next();
    }
    console.debug('preventing user from connecting');
    return next(new Error('authentication error'));
  });

  Io.on('connection', async (socket) => {
    const token = socket.handshake.query.token;
    console.debug('A user connected', token);

    await Users.createSocker(token, socket);
    
    socket.on('disconnect', function() {
      console.debug('user disconnected');
      Users.deleteUser(socket)
    });
  });

};