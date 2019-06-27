const {
  test,
  end,
} = require('./funcion.js');
const brands = ('../inventories/brand.json');
const cars = ('../inventories/cars.json');
function register(routes) {
  return (req, res) => {
    res.setHeader('Access-Control-Alllow-Origin', '*');
    if (test(req, routes.brands.path)) {
      let f = routes.brands.controller[req.method];
    
      if (!f) end(res, { error: `the method ${req.method} is not in brands`});
      else f (req, res);

    } else if (test(req, routes.cars.path)) {
      let c = routes.cars.controller[req.method];
    if (!c) end(res, { error: `the method ${req.method} is not in cars` });
      else c(req, res);

    } else end(res, { error: 'resource not found', status: 404 });

  }
}
module.exports = register;