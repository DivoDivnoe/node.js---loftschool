'use strict';

const yargs = require('yargs');
const serve = require('./server');

const PORT = 8000;

yargs
  .usage('Usage: $0 [option]')
  .help('help')
  .alias('help', 'h')
  .version('1.0.0')
  .alias('version', 'v')
  .command(
    'serve [port]',
    'start the server',
    yargs => {
      yargs.positional('port', {
        describe: 'port to listen',
        type: Number,
        default: PORT
      });
    },
    ({ port, interval, timeout }) => {
      serve(port, interval, timeout);
    }
  )
  .example('$0 serve 3000 --interval 5000 --timeout 10000')
  .option('interval', {
    alias: 'i',
    describe: 'timer log interval, ms',
    type: Number,
    default: 1000
  })
  .option('timeout', {
    alias: 't',
    describe: 'stop timer timeout, ms',
    type: Number,
    demandOption: true
  })
  .epilog('simple server with timer application').argv;
