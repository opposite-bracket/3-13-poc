const MongoDB = require('./db');
const Uuid = require('uuid');

const COLLECTION = 'users';

const getCollection = async () => {
  console.debug(`getting collection ${COLLECTION}`);
  const mongo = await MongoDB.init();

  return mongo.db.collection(COLLECTION);
};

module.exports.createUser = async (email, name) => {
  console.debug('creating new user', email, name);
  
  const collection = await getCollection();
  const token = Uuid.v4();
  const commandResult = await collection.updateOne({ email }, {
    $set: {email, name, token}
  }, {
    upsert: true
  });
  console.debug('instances upserted', commandResult.result);

  return {
    name,
    token
  };
}

module.exports.createSocker = async (token, socket) => {
  console.debug('creating new socker', socket.id);
  
  const collection = await getCollection();
  const result = await collection.updateOne({ token }, {
    $set: {socketId: socket.id}
  }, {
    upsert: true
  });
  console.debug('instances upserted', result);
}

module.exports.deleteUserConnection = async (socketId) => {
  console.debug('deleting user by token', socketId);
  
  const collection = await getCollection();
  const result = await collection.updateOne({ socketId }, {
    $set: { socketId: null }
  });
  console.debug('Removing user connection', result.updateCount);
}

module.exports.getUserByToken = async(token) => {
  console.debug('getting user by token', token);
  
  const collection = await getCollection();
  const result = await collection.findOne({
    token
  });
  console.debug('user found by token');
  return result;
}

module.exports.getConnectedUsers = async () => {
  console.debug('getting connected users');
  
  const collection = await getCollection();
  const result = await collection.find({
    socketId: {$ne: null}
  }, {_id: 1, name: 1, socketId: 1});
  
  console.debug('loaded connected users');

  return result.toArray();
}