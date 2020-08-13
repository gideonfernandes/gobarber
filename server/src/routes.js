const { Router } = require('express');
const User = require('./app/models/User');

const routes = new Router();

routes.get('/', async (request, response) => {
  const user = await User.create({
    name: 'Diego Fernandes',
    email: 'diego@rocketseat.com.br',
    password_hash: '123456789',
  });

  return response.json(user);
});

module.exports = routes;
