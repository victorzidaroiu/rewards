import http from 'http';
import _debug from 'debug';
import dotenv from 'dotenv';
import app from './app';

const debug = _debug('server');
dotenv.config({ silent: true });

const port = process.env.PORT || 3000;
app.set('port', port);
const server = http.createServer(app);
server.listen(port);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      debug(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      debug(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
  ? `Pipe ${addr}`
  : `Port ${addr.port}`;

  debug(`Started app on ${bind}`);
}

server.on('error', onError);
server.on('listening', onListening);
