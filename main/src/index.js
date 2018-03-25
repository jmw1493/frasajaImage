const { fork, exec } = require('child_process');
const path = require('path');
const express = require('express');
const app = express();
const socket = require('socket.io');


function runWatch(socket){
  const buildPath = path.join(__dirname, './build.js');
  const build = fork(buildPath);

  socket.emit('refresh-page', {
    message: 'I\'m a socket message, yo'
  });

  build.on('message', (m) => {
    socket.emit('refresh-page', m);
  });
  build.send({message: 'go'});

  const watchPath = path.join(__dirname, './watch.js');
  const watch = fork(watchPath);

  watch.on('message', (m) => {
    socket.emit('refresh-page', m);
    build.send({message: 'go'});
  })
}


app.get('/', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, './index.html'));
})

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
const io = socket(server);

io.on('connection', (socket) => {
  console.log('connected to socket');
  runWatch(socket);
});
