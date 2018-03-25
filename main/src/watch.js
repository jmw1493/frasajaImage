const chokidar = require('chokidar');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs')

let obj = {
  event: [],
  path: []
};

const watchPath = path.resolve(__dirname, '../test');
//
// function watch(){
//   setTimeout(() => {
//     // exec('cd test && ls', (err, stdout, stderr) => {
//     //   if (err || stderr) {
//     //     process.send({message: [`err: ${stderr || err}`]});
//     //     return;
//     //   }
//     //   process.send({message: [`stdout: ${stdout}`]});
//     //   watch();
//     // });
//     fs.readFile(watchPath, (err, data) => {
//       if (err) {
//         process.send({message: [`err: ${stderr || err}`]});
//       }
//       process.send({message: [`stdout: ${stdout}`]});
//       console.log(data);
//     });
//
//   }, 1000);
// }
//
// watch();

function send(e){
  setTimeout(() => {
    if(e > 0 && e === obj.event.length){
      const str = "Change in files:\n\t" + obj.path.filter(function(path, i){
        return obj.path.indexOf(path) === i;
      }).join("\n\t") + "\npid: " + process.pid;

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
  interval: 100
});

client.on('all', function(event, path){
  obj.event.push(event);
  obj.path.push(path);
  // if(event === 'add'){
  //   return;
  // }
  // process.send({message: [`${event}: ${path}`]});
});


process.once('SIGINT', function() {  // ctrl C
  client.close();
  process.exit(0);
  console.log("SIGINT");
});

process.send({
  message: "Listener process connected...\npid: " + process.pid
})
