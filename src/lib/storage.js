'use strict';

const logger = require('./logger');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'), { suffix: 'Prom' });

const storage = module.exports = {};

storage.create = function create(schema, item) {
  logger.log(logger.INFO, 'STORAGE: Created a new resource');
  if (!schema) return Promise.reject(new Error('Cannot create a new item, schema required'));
  if (!item) return Promise.reject(new Error('Cannot create a new item, item required'));
  const json = JSON.stringify(item);
  return fs.writeFileProm(`${__dirname}/../data/${schema}/${item.id}.json`, json)
    .then(() => {
      logger.log(logger.INFO, 'STORAGE: Created a new resource.');
      return item;
    })
    .catch(err => Promise.reject(err));
};  

storage.fetchOne = function fetchOne(schema, id) {
  return fs.readFileProm(`${__dirname}/../data/${schema}/${id}`)
    .then((data) => {
      if (!schema) return Promise.reject(new Error('expected schema name'));
      if (!id) return Promise.reject(new Error('expected id'));
      const item = JSON.parse(data.toString());
      return item;
    })
    .catch(err => Promise.reject(err.message));
};

storage.fetchAll = function fetchAll(schema) {
  return fs.readdirProm(`${__dirname}/../data/${schema}`)
    .then((files) => {
      return files;
    })
    .catch(err => Promise.reject(err.message));
};

storage.update = function update() {

};

storage.remove = function remove(schema, id) {
  return fs.unlinkProm(`${__dirname}/../data/${schema}/${id}`)
    .then((err) => {
      if (err) {
        Promise.reject(err.message);
      }
      return Promise.resolve('Success!');
    });
};

