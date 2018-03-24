const { spawn } = require('child_process');
const path = require('path');
const chalk = require('chalk');

const buildPath = path.join(__dirname, '../../test');
const config = {
  "docker": [`docker build -t my-server:v1 ${buildPath}`],
  "kube": ["kubectl create -f test/deployment.yaml"],
  "service": "my-service",
  "reload": "true",
  "html": "test/index.html"
};

const create = (command) => {
  const arr = command.trim().split(' ');
  const first = arr[0];
  arr.splice(0, 1);
  console.log(chalk.cyan("\n" + command));

  return new Promise((resolve, reject) => {
    const deploy = spawn(first, arr);

    deploy.stdout.on('data', (data) => {
      console.log('stdout:', `${data}`);
    });

    deploy.stderr.on('data', (data) => {
      console.log('stderr:', chalk.red(`${data}`));
      // reject(command);
    });

    deploy.on('close', (code) => {
      console.log('exit:', chalk.green(`child process exited with code ${code}`));
      resolve(code);
    });
  })
}

// build all docker images then create kubernetes objects

// const kubePromises = config.kube.map((build) => { return create(build); });

// this will provide an error if already created
// however, you only need to rebuild image in order to see the change
process.on('message', (m) => {
  console.log('BUILD RECEIVED', m.message);
  const dockerPromises = config.docker.map((build) => { return create(build); });

  Promise.all(dockerPromises).then((codes) => {
    // console.log(buildPath);
    console.log("\t" + chalk.green(`Docker containers rebuilt.`));
    process.send({message: "done"})
    // return Promise.all(kubePromises);
  })
  // .then((code) => {
  //   console.log("\t" + chalk.green(`Kubernetes objects rebuilt.`));
  //   process.send({message: "done"})
  // })
})
