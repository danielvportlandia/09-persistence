'use strict';

const logger = require('../lib/logger');
const Zoo = require('../model/zoo');
const storage = require('../lib/storage');
const response = require('../lib/response');

module.exports = function routeZoo(router) {
  router.post('/api/v1/zoo', (req, res) => {
    logger.log(logger.INFO, 'ZOO-ROUTE: POST /api/v1/zoo');

    try {
      const newZoo = new Zoo(req.body.name, req.body.breed);
      storage.create('zoo', newZoo)
        .then((zoo) => {
          response.sendJSON(res, 201, zoo);
          return undefined;
        });
    } catch (err) {
      logger.log(logger.ERROR, `ZOO-ROUTE: There was a bad request ${err}`);
      response.sendText(res, 400, err.message);
      return undefined;
    }
    return undefined;
  });

  router.get('/api/v1/zoo', (req, res) => {
    if (!req.url.query.id) {
      response.sendText(res, 400, 'Your request requires an id, bad request.');
      return undefined;
    }

    storage.fetchOne('zoo', req.url.query.id)
      .then((item) => {
        response.sendJSON(res, 200, item);
        return undefined;
      })
      .catch((err) => {
        logger.log(logger.ERROR, err, JSON.stringify(err));
        response.sendText(res, 404, err.message);
        return undefined;
      });
      
    return undefined;
  });
  
  router.get('/api/v1/zoo/all', (req, res) => {
    storage.fetchAll('zoo')
      .then((zoos) => {
        const zooArray = [];
        Object.keys(zoos).forEach(key => zooArray.push(zoos[key].id));
        response.sendJSON(res, 200, zoos);
        return undefined;
      })
      .catch((err) => {
        logger.log(logger.ERROR, err, JSON.stringify(err));
        response.sendText(res, 404, err.message);
        return undefined;
      });
  }); // GET ALL

  router.deleteItem('/api/v1/zoo/remove', (req, res) => {
    if (!req.url.query.id) {
      response.sendText(res, 404, 'Your request requires an id');
      return undefined;
    }

    storage.remove('zoo', req.url.query.id)
      .then(() => {
        response.sendJSON(res, 204, 'Item successfully removed');
        return undefined;
      })
      .catch((err) => {
        logger.log(logger.ERROR, err, JSON.stringify(err));
        response.sendText(res, 404, err.message);
        return undefined;
      });
    return undefined;
  });
};
