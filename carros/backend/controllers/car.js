const fs = require('fs');
const path = require('path');
const cars = require('../inventories/cars.json');
const {
  end,
  getData,
  throwErr
} = require('../controllers/funcion.js');

function GET(req,res){
  end(res, {data: cars});
};
function POST(req,res){
  getData({
    res,
    req
  }, parsed => {
    let prop = parsed.car ? parsed.car.toLowerCase() : null;
    let obj = {
      id: cars.length + 1,
      car: prop,
      description: parsed.description ? parsed.description : null
    }
    if (prop) {
      if (cars.map(o => o.car).indexOf(prop) === -1) {
        cars.push(obj);
          fs.writeFile(path.resolve('./inventories/brand.json'), JSON.stringify(brands), throwErr);
          end(res, {data:cars});
      } else
        end(res,{error: 'The brand already exists'});
    } else {
      end(res, {error:`The property <<brand>> returns ${prop} in the object ${JSON.stringify(parsed)}`});
    }
  });
};
function DELETE(req,res){

};
function PUT(req,res){

};
module.exports = {
  GET,
  POST,
  DELETE,
  PUT
}