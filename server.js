const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let activeConnections = 0;
let requestsProcessed = 0;

io.on('connection', (socket) => {
  activeConnections++;
  io.emit('info', { activeConnections, requestsProcessed });

  socket.on('get_fibonacci', (data) => {
    const n = data.n;
    const result = fibonacci(n);
    requestsProcessed++;
    io.emit('result', { result });
    io.emit('info', { activeConnections, requestsProcessed });
  });

  socket.on('disconnect', () => {
    activeConnections--;
    io.emit('info', { activeConnections, requestsProcessed });
  });
});

function fibonacci(n) {
  const memo = {};

  function fib(n) {
    if (n <= 1) {
      return n;
    }

    if (memo[n]) {
      return memo[n];
    }

    memo[n] = fib(n - 1) + fib(n - 2);
    return memo[n];
  }

  return fib(n);
}

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
