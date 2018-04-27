'use strict';

const bodyParser = require('./body-parser');
const urlParser = require('./url-parser');
const response = require('./response');

const Router = module.exports = function router() {
  this.routes = {
    GET: {
      // Just a hard-coded example
      // '/api/v1/zoo': (req, res) => {},
      // '/api/v1/zoo/:id': (req, res) => {},
    },
    POST: {},
    PUT: {},
    DELETE: {},
  };
};

Router.prototype.get = function get(endpoint, callback) {
  this.routes.GET[endpoint] = callback;
};

Router.prototype.post = function post(endpoint, callback) {
  this.routes.POST[endpoint] = callback;
};

Router.prototype.put = function put(endpoint, callback) {
  this.routes.PUT[endpoint] = callback;
};

Router.prototype.deleteItem = function deleteItem(endpoint, callback) {
  this.routes.DELETE[endpoint] = callback;
};

Router.prototype.route = function route() {
  return (req, res) => {
    Promise.all([
      urlParser(req),
      bodyParser(req),
    ])
      .then(() => {
        if (typeof this.routes[req.method][req.url.pathname] === 'function') {
          this.routes[req.method][req.url.pathname](req, res);
          return;
        }
        response.sendText(res, 404, 'Route Not Found FROM HERE');
      })
      .catch((err) => {
        if (err instanceof SyntaxError) {
          response.sendText(res, 404, err.message);
          return undefined;
        }
        response.sendText(res, 400, err.message);
        return undefined;
      });
  };
};
