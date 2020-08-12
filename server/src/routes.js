const { Router } = require('express');

const routes = new Router();

routes.get('/', (request, response) => {
  return response.json({ message: 'Hello from GoBarber API!'});
});

module.exports = routes;
