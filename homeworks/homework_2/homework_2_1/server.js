'use strict';

const http = require('http');
const { delay } = require('./utils');

const serve = (port, interval, timeout) => {
  http
    .createServer(async (req, res) => {
      const intervalId = setInterval(() => {
        console.log(new Date().toString());
      }, interval);

      await delay(timeout);
      clearInterval(intervalId);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(new Date().toString());
    })
    .listen(port);
};

module.exports = serve;
