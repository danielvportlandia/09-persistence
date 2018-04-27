'use strict';

const response = module.exports = {};

response.sendJSON = (res, status, data) => {
  res.writeHead(status, { 'Content-Type': 'application/JSON' });
  res.write(JSON.stringify(data));
  res.end();
  return undefined;
}; // you cannot pass in something !string to res.write.

response.sendText = (res, status, msg) => {
  res.writeHead(status, { 'Content-Type': 'text/plain' });
  res.write(msg);
  res.end();
  return undefined;
}; // errors are sent back in strings so content type is text.

