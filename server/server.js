require('dotenv').config();

const Express = require('express');
const App = Express();
const Http = require('http').createServer(App);
const Mongo = require('./libs/db');
const Cors = require('cors');
const BodyParser = require('body-parser');
const Io = require('socket.io')(Http);
const ConnectivitySocketEvents = require('./socket-events/connectivity');
const UserRouter = require('./controllers/user');

App.use(Cors({
  origin: 'http://localhost:3000',
  // some legacy browsers (IE11, various SmartTVs) choke on 204
  optionsSuccessStatus: 200
}));

App.use(BodyParser.json());

const SERVER_PORT = process.env.SERVER_PORT;
const API_VERSION = '/v1';

// load socket event
ConnectivitySocketEvents(Io);

// load controller actions
App.use(`${API_VERSION}/users`, UserRouter);

const runServer = async () => {
  console.debug('starting server ...');
  await Mongo.init();
  await Mongo.dropDatabase();

  Http.listen(SERVER_PORT, function(){
    console.debug(`listening on *:${SERVER_PORT}`);
  });
};

runServer();