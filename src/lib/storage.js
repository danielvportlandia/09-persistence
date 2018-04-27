'use strict';

const logger = require('./logger');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'), { suffix: 'Prom' });

const storage = module.exports = {};

// const memory = {};
// memory = {
//   'Zoos': {
//     '1234.567.89': {
//       'title': 'some title',
//       'content': 'some content',
//     }
//   }
// }

// schema is the type of resource, in this case zoo, and it will just be a 
// 'string' saying this is a zoo schema
// item is an actual object we'll pass in to post a newly created zoo
storage.create = function create(schema, item) {
  logger.log(logger.INFO, 'STORAGE: Created a new resource');
  // return new Promise((resolve, reject) => {
  if (!schema) return Promise.reject(new Error('Cannot create a new item, schema required'));
  if (!item) return Promise.reject(new Error('Cannot create a new item, item required'));
  const json = JSON.stringify(item);
  return fs.writeFileProm(`${__dirname}/../data/${schema}${item.id}.json`, json)
    .then(() => {
      logger.log(logger.INFO, 'STORAGE: Created a new resource.');
      return item;
    })
    .catch(err => Promise.reject(err));
  // if (!memory[schema]) memory[schema] = {};
  // memory[schema][item.id] = item;
  // return resolve(item);
  // });
};

storage.fetchOne = function fetchOne(schema, id) {
  return new Promise((resolve, reject) => {
    if (!schema) return reject(new Error('expected schema name'));
    if (!id) return reject(new Error('expected id'));
    if (!memory[schema]) return reject(new Error('schema not found'));
    const item = memory[schema][id];
    if (!item) {
      return reject(new Error('item not found'));
    } 
    return resolve(item);
  });
};

storage.fetchAll = function fetchAll(schema) {
  return new Promise((resolve, reject) => {
    if (!schema) return reject(new Error('expected schema name'));
    if (!memory[schema]) return reject(new Error('schema not found'));
    const item = memory[schema];
    if (!item) {
      return reject(new Error('item not found'));
    } 
    return resolve(item);
  });
};

storage.update = function update() {

};

storage.remove = function remove(schema, id) {
  return new Promise((resolve, reject) => {
    if (!schema) return reject(new Error('expected schema name'));
    if (!id) return reject(new Error('expected id'));
    if (!memory[schema]) return reject(new Error('schema not found'));
    const item = memory[schema][id];
    if (!item) {
      return reject(new Error('item not found'));
    }
    delete memory[schema][id];
    return resolve(undefined);
  });
};
