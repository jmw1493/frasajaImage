const { fork, exec } = require('child_process');
const path = require('path');
const express = require('express');
const app = express();
const socket = require('socket.io');

const { spawn } = require('child_process');

const files = {
  'favicon.ico': true,
  'network.svg': true,
  'refresh-button.svg': true,
  'trash.svg': true,
  'bundle.js': true,
  'styles.css': true
}

// runWatch is called when the socket connects with client
// (ie user refreshes the page)
// creates process that run build.js and watch.js
// fork is similar to spawn but it creates special node js process
function runWatch(socket){
  // build.js is used to rebuild docker images
  // build.js sends messages to the parent about the rebuilt
  // docker image
  const buildPath = path.join(__dirname, './build.js');
  const build = fork(buildPath);

  build.on('message', (m) => {
    socket.emit('refresh-page', m);
  });

  // watch.js watches for changes in files
  // the watch process sends back messages on the changed files
  // the parent process then sends message to build.js process
  const watchPath = path.join(__dirname, './watch.js');
  const watch = fork(watchPath);

  watch.on('message', (m) => {
    // TODO: restart build.js if change to a yaml/json file
    socket.emit('refresh-page', m);
    build.send({message: 'go'});
  })
}

// ==============SERVER==================================
// send the services created
app.get('/services', (req, res, next) => {
  const getServices = spawn('kubectl', ['get', 'services']);
  let response = '';

  getServices.stdout.on('data', (data) => {
    response += data;
  });

  getServices.stderr.on('data', (data) => {
    response += data;
  });

  getServices.on('close', (code) => {
    res.locals.data = response
    next();
  });
}, (req, res, next) => {
  // NOTE: take out 'ExternalName' later if necessary
  // for now returning services that are exposed on minikube
  // do not includes the kubernetes exposed service or our service
  const rows = res.locals.data.split('\n');
  const labels = [];

  const filteredRows = rows.reduce((record, row, i) => {
    const exposed = ['kubernetes ', 'kubernetes-frasaja ', 'ClusterIP', 'ExternalName'].reduce((bool, word) => {
      return bool && !row.includes(word);
    }, true);

    if(!exposed){
      return record;
    }

    const columns = row.split(' ');
    const obj = {};

    columns.forEach((col) => {
      if(!i && col){
        labels.push(col);
      }
      else if(col){
        const key = labels[Object.keys(obj).length];
        obj[key] = col;
      }
    })

    if(Object.keys(obj).length){
      const ports = obj['PORT(S)'];
      obj.PORT = ports.slice(ports.indexOf(':'), ports.indexOf('/'))
      record.push(obj);
    }
    return record;

  }, []);

  res.json({
    services: filteredRows
  });
})

// ================STATIC FILES=======================================
// serves loading html for iframe
app.get('/loading', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, '../build/loading.html'));
})

app.get('/:file', (req, res, next) => {
  if(files[req.params.file]){
    res.sendFile(path.resolve(__dirname, `../build/${req.params.file}`));
  }
  else {
    res.sendFile(path.resolve(__dirname, '../build/index.html'));
  }
})

app.get('/service/:file', (req, res, next) => {
  if(files[req.params.file]){
    res.sendFile(path.resolve(__dirname, `../build/${req.params.file}`));
  }
  else {
    res.sendFile(path.resolve(__dirname, '../build/index.html'));
  }
})

// serves the static html file that has the iframe that
// requests the test's exposed services
app.get('*', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, '../build/index.html'));
})

// ===============RUN SERVER=======================================
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
