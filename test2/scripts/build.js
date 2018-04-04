const { spawn, exec } = require('child_process');

const create = (file, arr) => {
  return new Promise((resolve, reject) => {
    const deploy = spawn(file, arr);

    deploy.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    deploy.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    deploy.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      resolve(code);
    })
  })
}

const promises = [];
promises.push(create('docker', ['build', '-t', 'frontend:v1', './frontend']))
promises.push(create('docker', ['build', '-t', 'backend:v1', './backend']))

// this will provide an error if already created
// however, you only need to rebuild image in order to see the change
Promise.all(promises).then((codes) => {
  return create('kubectl', ['create', '-f', 'deployment.yaml']);
}).then((code) => {
  console.log('Yay!');
  // return create('kubectl', ['create', '-f', 'service.yaml']);
})
