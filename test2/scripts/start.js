const { spawn } = require('child_process');

const server = spawn('nodemon', ['frontend/server.js']);
const dbServer = spawn('nodemon', ['backend/dbServer.js']);

server.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

server.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

server.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

dbServer.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

dbServer.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

dbServer.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
