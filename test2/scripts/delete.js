const { spawn, exec } = require('child_process');

const remove = (file, arr) => {
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
promises.push(remove('kubectl', ['delete', 'deployment', 'frontend-deployment']))
promises.push(remove('kubectl', ['delete', 'deployment', 'backend-deployment']))

// this will provide an error if already created
// however, you only need to rebuild image in order to see the change
Promise.all(promises).then((codes) => {
  return remove('kubectl', ['delete', 'service', 'my-service'])
}).then((code) => {
  console.log('Yay!');
})
