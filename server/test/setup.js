const Mongo = require('../libs/models/db');

before(async () => {
  await require('dotenv').config();
  await Mongo.init();
  await Mongo.dropDatabase();
  // await Mongo.createIndexes();
});