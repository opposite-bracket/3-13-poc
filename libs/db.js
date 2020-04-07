const MongoClient = require('mongodb').MongoClient;

const DB_NAME = process.env.DB_NAME;
const MONGO_URI = process.env.MONGO_URI;

let instances = null;

module.exports.init = async () => {
  console.log('connecting to MongoDB', instances);

  const initDB = new Promise((resolve, reject) => {

    if(instances !== null){
      console.log('mongo instance found');
      return resolve(instances);
    }

    MongoClient.connect(MONGO_URI, { useUnifiedTopology: true }, function(err, client) {

      if(err) {
        console.log('failed to connect to MongoDB');
        return reject(err);
      }

      console.log('connected to MongoDB successfully');
     
      const db = client.db(DB_NAME);

      instances = { db, client };
     
      return resolve(instances);
    });
  });

  return initDB;
}
