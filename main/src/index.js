const { fork, exec } = require('child_process');
const path = require('path');
const express = require('express');
const app = express();
// const buildPath = path.join(__dirname, './build.js');
// console.log(buildPath);
// console.log(__dirname);

const buildPath = path.join(__dirname, './build.js');
const build = fork(buildPath);
build.on('message', (m) => {
  console.log('PARENT got message from build:', m.message);
});
build.send({message: 'go'});

const watchPath = path.join(__dirname, './watch.js');
const watch = fork(watchPath);
watch.on('message', (m) => {
  console.log('PARENT got message from watch:', m.message);
  setTimeout(() => {
    build.send({message: 'go'});
  }, 1000);
})


// app.get('/', (req, res, next) => {
//   exec(`ls`, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`exec error: ${error}`);
//       res.send(error);
//       return;
//     }
//     console.log(`stdout: ${stdout}`);
//     console.log(`stderr: ${stderr}`);
//     res.send(buildPath);
//   });
// })
//
//
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Server listening on ${PORT}`);
// })
