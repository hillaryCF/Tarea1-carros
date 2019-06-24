const http = require('http');

const Router = require('./core/router.js');
const students = require('./controllers/students.js')

const routes = [
  {
    method: 'GET',
    path: 'api/v1/brands',
    controller: students.getAll,
  }
];

const server = http.createServer(Router.Register(routes));
server.listen(5000,() => console.log('Server running on: 127.0.0.1:5000'));