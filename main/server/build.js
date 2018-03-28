const { spawn } = require('child_process');
const path = require('path');
const chalk = require('chalk');

const buildPath = path.join(__dirname, '../test');
const config = {
  "docker": [`docker build --rm -t my-server:v1 ${buildPath}`],
  "kube": ["kubectl create -f test/deployment.yaml"],
  "service": "my-service",
  "reload": "true"
};

const create = (command) => {
  const arr = command.trim().split(' ');
  const first = arr[0];
  arr.splice(0, 1);
  console.log(chalk.cyan("\n" + command));

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
      console.log('stderr:', chalk.red(`${data}`));
      res += `
      stderr: ${data}
      `;
    });

    deploy.on('close', (code) => {
      console.log('exit:', chalk.green(`child process exited with code ${code}`));
      resolve(res);
    });
  })
}


process.on('message', (m) => {
  // when all the docker containers finish building...
  // we send the data to index.js where it send the data back to the front end
  // through the socket
  const dockerPromises = config.docker.map((build) => { return create(build); });
  let message = '';

  Promise.all(dockerPromises).then((codes) => {
    message = codes;
    const cleanPromises = ['docker rmi $(docker images --filter "dangling=true" -q --no-trunc)'].map((command) => { return create(command); });
    return Promise.all(cleanPromises)
  })
  .then((code) => {
    const kubePromises = config.kube.map((command) => { return create(command); });
    return Promise.all(kubePromises);
  })
  .then((code) => {
    process.send({message: message});
  })
})
