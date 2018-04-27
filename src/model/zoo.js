'use strict';

const uuidv4 = require('uuid/v4');
const logger = require('../lib/logger');

module.exports = class {
  constructor(name, breed) {
    if (!name || !breed) throw new Error('POST request requires name and breed');
    this.id = uuidv4();
    this.name = name;
    this.breed = breed;
    logger.log(logger.INFO, `ZOO: Created a new zoo: ${JSON.stringify(this)}`);
  }
};
