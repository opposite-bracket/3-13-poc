const MongoDB = require('./db');
const Uuid = require('uuid');

const COLLECTION = 'users';

const getCollection = async () => {
  console.debug('getting collection');
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

module.exports.createSocker = async (id, socket) => {
  console.debug('creating new socker', socket.id);
  
  const collection = await getCollection();
  const result = await collection.updateOne({ id }, {
    $set: {socketId: socket.id}
  }, {
    upsert: true
  });
  console.debug('instances upserted', result.insertedCount);
}

module.exports.deleteUser = async (socket) => {
  console.debug('creating new user', socket.id);
  
  const collection = await getCollection();
  const result = await collection.removeOne({
    socketId: socket.id
  });
  console.debug('instances removed', result.deletedCount);
}