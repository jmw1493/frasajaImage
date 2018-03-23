const chokidar = require('chokidar');
const path = require('path');

let obj = {
  event: [],
  path: []
};

function send(e){
  setTimeout(() => {
    if(e > 0 && e === obj.event.length){
      const str = "Change in files:\n\t" + obj.path.filter(function(path, i){
        return obj.path.indexOf(path) === i;
      }).join("\n\t") + "\npid: " + process.pid;

      process.send({message: str});

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

const client = chokidar.watch([path.resolve(__dirname, '../../test')], {
  persistent: true
});

client.on('all', function(event, path){
  obj.event.push(event);
  obj.path.push(path);
});


process.once('SIGINT', function() {  // ctrl C
  client.close();
  process.exit(0);
  console.log("SIGINT");
});

process.send({
  message: "Listener process connected...\npid: " + process.pid
})
