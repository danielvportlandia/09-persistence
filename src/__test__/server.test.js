'use strict';

const server = require('../lib/server');
const superagent = require('superagent');
const logger = require('../lib/logger');

const testPort = 5000;
const mockResource = { name: 'Bambi', breed: 'Deer' };
let mockId = null;

beforeAll(() => server.start(testPort));
afterAll(() => server.stop());

// In this lab, you MUST post first BEFORE you get
describe('VALID request to the API', () => {
  describe('POST /api/v1/zoo', () => {
    it('should respond with status 201 and create a new zoo', () => {
      return superagent.post(`:${testPort}/api/v1/zoo?${mockResource}`)
        .send(mockResource)
        .then((res) => {
          mockId = res.body.id;
          expect(res.body.name).toEqual(mockResource.name);
          expect(res.body.breed).toEqual(mockResource.breed);
          expect(res.status).toEqual(201);
        });
    });
    it('should respond with 400 if no request body was provided or the body was invalid', () => {
      return superagent.post(`:${testPort}/api/v1/zoo?test1=fakepost1%20${mockResource}`)
        .send(mockResource)
        .then((res) => {
          logger.log(logger.INFO, `TEST: successful post ${res.body}`);
        })
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
  });

  describe('GET /api/v1/zoo', () => {
    it('should respond with the a previously created zoo', () => {
      return superagent.get(`:${testPort}/api/v1/zoo?id=${mockId}`)
        .then((res) => {
          expect(res.body.name).toEqual(mockResource.name);
          expect(res.body.breed).toEqual(mockResource.breed);
          expect(res.status).toEqual(200);
        });
    });
    it('should respond with a 404 for valid requests made with an id that was not found', () => {
      return superagent.get(`:${testPort}/api/v1/zoo?id=fakeID`)
        .then((res) => {
          logger.log(logger.INFO, `TEST: 404 test ${res}`);
        })
        .catch((err) => {
          expect(err.status).toEqual(404);
        });
    });
    it('should respond with 400 if no id was provided in the request', () => {
      return superagent.get(`:${testPort}/api/v1/zoo`)
        .then((res) => {
          logger.log(logger.INFO, `TEST: 404 test ${res}`);
        })
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
  });
});
