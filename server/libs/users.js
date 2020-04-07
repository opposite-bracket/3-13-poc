const MongoDB = require('./db');

const COLLECTION = 'users';

const getCollection = async () => {
  console.log('getting collection');
  const mongo = await MongoDB.init();

  return mongo.db.collection(COLLECTION);
};

module.exports.createUser = async (socket) => {
  console.log('creating new user', socket.id);
  
  const collection = await getCollection();
  const result = await collection.insertOne({
    socketId: socket.id
  });
  console.log('instances created', result.insertedCount);
}

module.exports.deleteUser = async (socket) => {
  console.log('creating new user', socket.id);
  
  const collection = await getCollection();
  const result = await collection.removeOne({
    socketId: socket.id
  });
  console.log('instances removed', result.deletedCount);
}