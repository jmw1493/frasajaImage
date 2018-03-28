const { spawn } = require('child_process');
const path = require('path');
const config = require(path.join(__dirname, '../test/frasaja.json'))

const create = (command) => {
  const arr = command.trim().split(' ');
  const first = arr[0];
  arr.splice(0, 1);

  arr.forEach((word, i) => {
    if(arr[i].includes('.')){
      arr[i] = path.join(__dirname, '../test', arr[i])
    }
  })

  // spawn creates a new process
  // we add events listeners to the process and send the
  // data back to the parent process in index.js
  return new Promise((resolve, reject) => {
    const deploy = spawn(first, arr);
    let res = '';

    deploy.stdout.on('data', (data) => {
      console.log('stdout:', `${data}`);
      res += `
      stdout: ${data}
      `
    });

    deploy.stderr.on('data', (data) => {
      res += `
      stderr: ${data}
      `;
    });

    deploy.on('close', (code) => {
      resolve(res);
    });
  })
}

// kubepromises are placed outside because we want them to only be called once
// when the front-end first connects
const kubePromises = config.kubernetes.map((command) => { return create(command); });
let created = false;

// when all the docker containers finish building...
// we send the data to index.js where it send the data back to the front end
// through the socket
process.on('message', (m) => {
  const dockerPromises = config.docker.map((build) => { return create(build); });
  let message = '';

  Promise.all(dockerPromises).then((codes) => {
    message = codes;
    return Promise.all(kubePromises);
  })
  .then((code) => {
    if(!created){
      created = true;
      process.send({message: message.concat(code)});
    }
    else {
      process.send({message: message});
    }
  })
})
