const { fork, exec } = require('child_process');
const path = require('path');
const express = require('express');
const app = express();
const socket = require('socket.io');

// runWatch is called when the socket connects with client
// (ie user refreshes the page)
// creates process that run build.js and watch.js
// fork is similar to spawn but it creates special node js process
function runWatch(socket){
  socket.emit('refresh-page', {
    message: ['I\'m a socket message, yo']
  });

  // build.js is used to rebuild docker images
  // build.js sends messages to the parent about the rebuilt
  // docker image
  const buildPath = path.join(__dirname, './build.js');
  const build = fork(buildPath);

  build.on('message', (m) => {
    socket.emit('refresh-page', m);
  });
  // build.send({message: 'start'});

  // watch.js watches for changes in files
  // the watch process sends back messages on the changed files
  // the parent process then sends message to build.js process
  const watchPath = path.join(__dirname, './watch.js');
  const watch = fork(watchPath);

  watch.on('message', (m) => {
    socket.emit('refresh-page', m);
    build.send({message: 'go'});
  })
}

// ==============SERVER==================================
// send html requests for css and js files
app.use(express.static(path.resolve(__dirname, '../build')))

// serves the static html file that has the iframe that
// requests the test's exposed services
app.get('/', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, '../build/index.html'));
})

// run server and wait for socket connection
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// ==============SOCKET====================================
const io = socket(server);
io.on('connection', (socket) => {
  console.log('connected to socket');
  runWatch(socket);
});
