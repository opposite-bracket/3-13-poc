var Express = require('express');
var Router = Express.Router();

const Users = require('../libs/users');

Router.post('/', async (req, res) => {
  console.debug('creating new user from API ', req.body);
  const user = await Users.createUser(req.body.email, req.body.name);

  return res.send({
    name: user.name,
    token: user.token
  });
});

module.exports = Router;