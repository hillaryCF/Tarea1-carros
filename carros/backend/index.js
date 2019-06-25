const http = require('http');
const register = require('./controllers/register.js');
const brandcontroller = require('./controllers/brand.js');
const carscontroller = require('./controllers/car.js')

const routes = {
  cars:{
    path: 'api/v1/cars',
    controller: carscontroller,
  },
  brands:{
    path: 'api/v1/brands',
    controller: brandcontroller,
  }

}



const server = http.createServer(register(routes));
server.listen(5000,() => console.log('Server running on: 127.0.0.1:5000'));