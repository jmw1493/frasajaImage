const { spawn } = require('child_process');
const path = require('path');
const config = require(path.join(__dirname, './config.js'));
const images = Object.keys(config);

const imageCache = {}; // stores ids of built images
let init = false;

// ===========================CALLBACKS USED IN CREATE()==================================================
// callback for when a docker container successfully builds
// image is the original name/tag of the docker container ie `my-server:v1`
const successDockerBuild = (image) => {
  const built = 'Successfully built ';
  const tagged = 'Successfully tagged ';

  return (message) => {
    const i = message.indexOf(built);
    if(i > -1){
      const id = message.slice(i + built.length);
      if(config[image].newImageID) {
        config[image].oldImageIDs.push(config[image].newImageID);
      }
      config[image].newImageID = id.slice(0, id.indexOf('\n')).trim();
    }

    const j = message.indexOf(tagged);
    if(j > -1){
      const name = message.slice(i + tagged.length);
      config[image].newName = name.slice(0, name.indexOf('\n')).trim();
    }
  }
}

// remove image ID from oldImageIDs when image is successfully deleted
const onSuccessDockerRemove = (image, oldID) => {
  return (message) => {
    const index = config[image].oldImageIDs.indexOf(oldID);
    config[image].oldImageIDs.splice(index, 1);
  }
}

const onErrorDockerRemove = (command, image, oldID) => {
  return (message) => {
    
  }
}

// ===========================CREATE PROMISES TO CONTROL FLOW==============================================
const create = (command, errCB=function(){}, successCB=function(){}) => {
  const arr = command.trim().split(' ');
  const first = arr[0];
  arr.splice(0, 1);

  // spawn creates a new process
  // we add events listeners to the process and send the
  // data back to the parent process in index.js
  return new Promise((resolve, reject) => {
    const deploy = spawn(first, arr);
    let res = '';

    deploy.stdout.on('data', (data) => {
      successCB('' + data);
      res += `stdout: ${data}`
    });

    deploy.stderr.on('data', (data) => {
      errCB('' + data);
      res += `stderr: ${data}`;
    });

    deploy.on('close', (code) => {
      resolve(res);
    });
  })
}

// ========================WHEN FILES CHANGE==========================================
// we get a message from index.js (parent) when watch.js notices a change in files
// when all the docker containers finish building...
// we send the data to index.js where it send the data back to the front end
// through the socket
process.on('message', (m) => {
  if(!init) return;
  const date = ":v" + Date.now();

  // build docker containers
  // a new set of promises have to be created since the old promises are resolved
  // every container name (key) in config object should have a ':' --> config.js adds ':latest' if a tag is not specified
  // so we just switch out the old tag for the new one
  // the new tag is then recorded in the callback in config[image].newName
  const dockerPromises = images.map((image) => {
    const newName = image.slice(0, image.indexOf(':')) + date;
    return create(`${config[image].dockerStart} ${newName} ${config[image].dockerEnd}`, ()=>{}, successDockerBuild(image));
  });

  Promise.all(dockerPromises).then((codes) => {
    // reset kubernetes objects with the newName of the container
    const setKubePromises = images.map((image) => {
      return create(`${config[image].kubeSet}${config[image].newName}`);
    });
    process.send({message: codes});
    return Promise.all(setKubePromises)
  })
  .then((codes) => {
    // wait for setKubePromise to ACTUALLY finish
    // if we do not wait, then the we get an error when we try to remove the docker container
    // saying the container is still in use
    // TODO: come up with a better gaurantee to not continue until we switch over
    const waitPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('DONE WAITING');
      }, 5000);
    });
    process.send({message: codes});
    return Promise.all([waitPromise]);
  })
  .then((res) => {
    // delete old docker containers
    // when the docker image is successfully deleted,
    // the id is removed from config[image].oldImageIDs
    const removeDockerImagesPromises = images.reduce((arr, image) => {
      const promises = config[image].oldImageIDs.map((oldID) => {
        const command = `docker rmi ${oldID} -f`;
        return create(command, onErrorDockerRemove(command, image, oldID), onSuccessDockerRemove(image, oldID));
      })
      return arr.concat(promises);
    }, []);

    process.send({message: res});
    return Promise.all(removeDockerImagesPromises)
  })
  .then((codes) => {
    // send messages to front-end socket
    process.send({message: codes});
    process.send({message: [JSON.stringify(config)]});
  })
})

// ==========================RUN BUILD ON CONNECT=============================================
// this is run at the very beginning to build the docker images and kubernetes clusters
// build docker containers
const dockerPromises = images.map((image) => { return create(`${config[image].dockerStart} ${image} ${config[image].dockerEnd}`, ()=>{}, successDockerBuild(image)); });

Promise.all(dockerPromises).then((codes) => {
  // create kubernetes objects
  const kubePromises = images.map((image) => { return create(config[image].kubeCreate); });
  process.send({message: codes});
  return Promise.all(kubePromises)
}).then((codes) => {
  // set init to true so the on message listener knows the docker containers
  // and kubernetes objects are good to go
  init = true;
  process.send({message: codes});
  process.send({message: [JSON.stringify(config)]});
})
