const fs = require('fs');
const path = require('path');
const brands = require('../inventories/brand.json');
const {
  end
} = require('../funcion.js');

function GET(req, res) {
  end(res, brand);
}

function POST(req, res) {
  getData({
    res,
    req
  }, parsed => {
    let prop = parsed.brand ? parsed.brand.toLowerCase() : null;
    let obj = {
      id: brands.length + 1,
      brand: prop,
      description: parsed.description ? parsed.description : null
    }
    if (prop) {
      if (brands.indexOf(prop) === -1) {
        brands.push(obj);
        fs.writeFile(path.resolve('../inventories/brand.json'), JSON.stringify(brands), throwErr);
        success(res, brands);
      } else
        error(res,{error: 'The brand already exists'});
    } else {
      error(res, `The property <<brand>> returns ${prop} in the object ${JSON.stringify(parsed)}`);
    }
  });
}

module.exports = {
  GET,
  POST
}