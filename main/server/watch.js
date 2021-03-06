const chokidar = require('chokidar');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs')

let obj = {
  event: [],
  path: []
};

const watchPath = path.resolve(__dirname, '../test');

// this listens until there is a larger array of paths and events
// limits the number of calls we make to the front end
function send(e){
  setTimeout(() => {
    if(e > 0 && e >= obj.event.length){
      const str = "Change in files:\n\t" + obj.path.filter(function(path, i){
        return obj.path.indexOf(path) === i;
      }).join("\n\t") + "\npid: " + process.pid;

      // sends a message back to parent process in index.js
      process.send({message: [str]});

      obj = {
        event: [],
        path: []
      };

      return send(0);
    }
    return send(obj.event.length);
  }, 1000);
}
send(0);

const client = chokidar.watch([watchPath], {
  persistent: true,
  usePolling: true,
  interval: 500
});

// collects the paths and events when a file changes
client.on('all', function(event, path){
  obj.event.push(event);
  obj.path.push(path);
});

process.once('SIGINT', function() {  // ctrl C
  client.close();
  process.exit(0);
  console.log("SIGINT");
});
