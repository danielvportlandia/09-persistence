'use strict';

const logger = require('./logger');

module.exports = function bodyParser(req) {
  return new Promise((resolve, reject) => {
    logger.log(logger.INFO, `BODY-PARSER: top of file ${req.method}`);
    if (req.method !== 'POST' && req.method !== 'PUT') {
      logger.log(logger.INFO, `BODY-PARSER: before resolve req ${req}`);
      return resolve(req);
    }

    let message = '';
    req.on('data', (data) => {
      logger.log(logger.INFO, `BODY PARSER: chunked request data: ${data.toString()}`);
      message += data.toString();
    });
      
    req.on('end', () => {
      try {
        req.body = JSON.parse(message);
        logger.log(logger.INFO, `BODY-PARSER: at end of success ${req.body}`);
        return resolve(req);
      } catch (err) {
        logger.log(logger.ERROR, 'BODY PARSER: Error parsing the message on end of function.');
        return reject(err);
      }
    });
      
    req.on('error', (err) => {
      logger.log(logger.ERROR, `BODY PARSER: Error occured on parsing request body ${err}`);
      return reject(err);
    });
    logger.log(logger.INFO, 'BODY PARSER: parser is waiting for event.');
    return undefined;
  });
};
