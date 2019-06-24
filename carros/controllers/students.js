const fs = require('fs');
const Response = require('../core/response');

const FILE_NAME = `${__dirname}/../inventories/brand.json`;

function getAll (req, res) {
  let data = {};
  let students = require(FILE_NAME).data;
  data.data = students;
  Response.Send(res, data);
}

function validateQuery( ) {
    if(!query) return [];
    let errors = [];
    if(query.sortBy && !SORT_FIELDS.includes(query.sortBy))
        errors.push(new Error(`Invalid query param sortBy, available: ${SORT_FIELDS.join(' ')}`));
    if(query.sortOrder && (query.sortOrder !== 'asc' && query.sortOrder !== 'desc'))
        errors.push(new Error(`Invalid query param sortOrder, must be "asc" or "desc"`));
    if(query.page && (+query.page <= 0 || isNaN(+query.page)))
        errors.push(new Error(`Invalid query page must be a number.`));
    if(query.pageItems && (+query.pageItems <= 0 || isNaN(+query.pageItems)))
        errors.push(new Error(`Invalid query pageItems must be a number.`));
    return errors
}

function search(data, searchText) {
    let regex = new RegExp(searchText, 'gi');
    return data.filter(student => {
        if(regex.test(student.name)) return true;
        if(regex.test(student.age)) return true;
    });
}

function sort(data, sortBy, sortOrder) {
    let sorting = {
        name: (a, b) => a.name.localeCompare(b.name),
        age: (a, b) => {
            if(+a.age < +b.age) return -1;
            if(+a.age > +b.age) return 1;
            return 0;
        },
        id: (a, b) => {
            if(a.id < b.id) return -1;
            if(a.id > b.id) return 1;
            return 0;
        },
    }
    data = data.sort(sorting[sortBy]);
    if(sortOrder === 'asc') return data.reverse();
    return data;
}

function create (req, res, route) {
    let student = sanitize(route.body);
    let errors = validate(student);

    if(errors.length) return Response.BadRequest(res, errors);

    let students = require(FILE_NAME);
    student.id = ++students.counter;
    students.data.push(student);

    save(students)
        .then(() => Response.Send(res, student))
        .catch(err => Response.ApplicationError(res, err));
}

function validate(student) {
    let errors = [];

    if(!student) errors.push(new Error(`Invalid student data.`));
    if(!student.name) errors.push(new Error(`Student name required.`));
    if(!student.age) errors.push(new Error(`Student age required.`));
    if(isNaN(+student.age)) errors.push(new Error(`Student age must be an number.`));

    return errors;
}

function save (students) {
    return new Promise((resolve, reject) => {
        fs.writeFile(FILE_NAME, JSON.stringify(students), err => err ? reject(err) : resolve(students));
    });
}

function getOne(req, res, route) {
    let id = +route.params.id;

    let student = findById(id);
    if(student) return Response.Send(res, student);

    Response.ApplicationError(res, new Error(`Students ID: ${id} not found`));
}

function findById (id) {
    let students = require(FILE_NAME);
    return students.data.find(student => student.id === id);
}

function sanitize2 (student) {
    return FIELDS
        .reduce((data, field) => Object.assign(data, {[`${field}`]: student[field]}), {});
}

function sanitize (source, fields = FIELDS) {
    return fields
        .filter(field => source[field])
        .reduce((data, field) => Object.assign(data, {[`${field}`]: source[field]}), {});
}

function updateOne (req, res, route) {
    let id = +route.params.id;
    let body = sanitize(route.body);

    let student = findById(id);
    if(!student) return Response.ApplicationError(res, new Error(`Students ID: ${id} not found`));

    let students = require(FILE_NAME);
    Object.assign(student, body); // update the student

    let idx = students.data.findIndex(s => s.id === id);
    if(idx < -1) return Response.ApplicationError(res, new Error(`Could not update student ID: ${id}`));

    students.data[idx] = student;
    save(students)
        .then(() => Response.Send(res, student))
        .catch(err => Response.ApplicationError(res, err));
}

function report (req, res, route) {
    let students = require(FILE_NAME);
    let data = students.data
        .reduce((t, student, i) => {
            Object.keys(student).forEach(key => {
                t += `${key}:${student[key]}`;
                t += i < students.data.length ? '\n' : '';
            });
            return t;
        }, '');

    Response.Send(res, data, {
        'contentType': 'text/csv'
    });
}

module.exports = {
    getAll,
    getOne,
    create,
    updateOne,
    report,
};