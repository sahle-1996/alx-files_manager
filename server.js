import express from 'express';
import { env } from 'process';

const routes = require('./routes/index');

const server = express();
const serverPort = env.PORT || 5000;

server.use(express.json());
server.use(routes);

server.listen(serverPort, '127.0.0.1', () => {
  console.log(`Server running on http://127.0.0.1:${serverPort}`);
});

export default server;
