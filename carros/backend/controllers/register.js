const {
  test,
  end,
} = require('../funcion.js');

function register(routes) {
  return (req, res) => {
    res.setHeader('Access-Control-Alllow-Origin', '*');

    if (test(req, routes.brands.path)) {
      let f = routes.brands
        .controller[req.method];

      if (!f) end(res, { error: `the method ${req.method} is not in brands` });
      else f(req, res);

    } else if (test(req, routes.cars.path)) {
      let f = routes.cars
        .controller[req.method];

      if (!f) end(res, { error: `the method ${req.method} is not in cars` });
      else f(req, res);

    } else end(res, { error: 'resource not found', status: 404 });

  }
}
module.exports = register;