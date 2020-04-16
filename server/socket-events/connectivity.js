const Users = require('../libs/users');

module.exports = (Io) => {
  Io.use(async (socket, next) => {
    let token = socket.handshake.query.token;
    console.debug(`Connectiong attempt by ${token}`);

    const user = await Users.getUserByToken(token);
    console.debug('user found by token', token);
    if (token !== null && user !== null) {
      console.debug('allowing connection');
      return next();
    }
    console.debug('preventing user from connecting');
    return next(new Error('authentication error'));
  });

  Io.on('connection', async (socket) => {
    const token = socket.handshake.query.token;
    console.debug('A user connected', token, socket.id);

    await Users.createSocker(token, socket);
    const users = await Users.getConnectedUsers();

    Io.emit('update-users', { users });

    console.debug('sending all connected users');

    socket.on('disconnect', async () => {
      console.debug('user disconnected', socket.id);
      await Users.deleteUserConnection(socket.id);
      const users = await Users.getConnectedUsers();
      Io.emit('update-users', { users });
    });
  });

};