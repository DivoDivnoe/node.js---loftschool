'use strict';

const http = require('http');
const { delay } = require('./utils');

const logTime = () => console.log(new Date().toString());

const serve = (port, interval, timeout) => {
  http
    .createServer(async (req, res) => {
      logTime();
      const intervalId = setInterval(logTime, interval);

      await delay(timeout);
      clearInterval(intervalId);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(new Date().toString());
    })
    .listen(port);
};

module.exports = serve;
