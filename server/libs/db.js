const MongoClient = require('mongodb').MongoClient;

const DB_NAME = process.env.DB_NAME;
const MONGO_URI = process.env.MONGO_URI;

let instances = null;

module.exports.dropDatabase = async () => {
  console.debug('dropping database');

  if (instances === null) {
    console.debug('cannot drop database: connection does not exist');
    return null;
  }

  await instances.db.dropDatabase();

  console.debug('database dropped');
}

module.exports.init = async () => {
  console.debug('connecting to MongoDB');

  const initDB = new Promise((resolve, reject) => {

    if(instances !== null){
      console.debug('mongo instance found');
      return resolve(instances);
    }

    MongoClient.connect(MONGO_URI, { useUnifiedTopology: true }, function(err, client) {

      if(err) {
        console.debug('failed to connect to MongoDB');
        return reject(err);
      }

      console.debug('connected to MongoDB successfully');

      const db = client.db(DB_NAME);

      instances = { db, client };
     
      return resolve(instances);
    });
  });

  return initDB;
}
