const path = require('path');
// const config = require(path.join(__dirname, '../test/frasaja.json'));
const config = require(path.join(__dirname, '../test2/frasaja.json'));
// ../frasaja.json --> gets mounted in main/test (a new directory spec'd in yaml & Dockerfile)
const YAML = require('yamljs');
const fs = require('fs');

// NOTE: we need to make sure our config edge cases are handled in this file
// point of this file is to adjust the user's config file to get necessary info
// as well as create the commands we will be using for each docker image

// not anymore --> TODO: parse docker-compose.yaml file to make config object

// TODO: possible todo would be somehow add a key that shows to only
// rebuild this particular docker container when this directory changes
// may be done by parsing Dockerfiles

// =================PARSE COMMAND IN FRASAJA.JSON=================
// gives the directory in a command an absolute path
const fixPath = (str) => {
  let prev = '';
  let dir = '';
  let img = '';

  const terms = str.trim().split(' ').map((word, i) => {
    if(word.includes('.') || word.includes('/')){
      // dir = path.join(__dirname, '../test', word);
      dir = path.join(__dirname, '../test2', word);
      return dir;
    }
    if(word.includes(':')){
      img = word;
      return img;
    }
    if(prev === '-t' || prev === '--tag'){
      img = word + ':latest';
      return img;
    }

    prev = word;
    return word;
  })

  return {
    command: terms.join(' '),
    dir: dir,
    img: img
  };
}

// ====================ADD DOCKER COMMANDS================================
// add docker commands to the already existing kubernetes commands object
// created by addKube()
// containers that are spe
const addDocker = (build) => {
  const result = {};

  config.docker.forEach((script) => {
    const fixed = fixPath(script);

    if(build[fixed.img]){
      const split = fixed.command.split(fixed.img);

      result[fixed.img] = Object.assign({}, build[fixed.img], {
        dockerStart: split[0].trim(),
        dockerEnd: split[1].trim()
      });
    }
  })

  return result;
}


// ======================ADD KUBECTL COMMANDS===============================================
// parse yaml helps us create the necessary `kubectl set` statements for later
// parse yaml also saves the names of all of our original docker images

// search for `container` key
const search = (obj) => {
  return Object.keys(obj).reduce((cumm, key) => {
    if(key === "containers"){
      return cumm.concat(obj[key]);
    }
    if(typeof obj[key] === "object"){
      return cumm.concat(search(obj[key]));
    }
    return cumm;
  }, []);
}

// finds all the names of the docker containers we will be using
// get all yaml files and correlate docker image names with kubectl statements
const addKube = () => {
  return config.kubernetes.reduce((obj, kub) => {
    const fixed = fixPath(kub);
    const dir = fixed.dir;

    // read file and split by '---'
    const jsonArr = fs.readFileSync(dir, {
      encoding: 'utf-8'
    }).split('---').map((yamlString) => {
      return (dir.includes('.json')) ? JSON.parse(yamlString): YAML.parse(yamlString);
    });

    // go through keys until we find 'containers' key
    jsonArr.forEach((json) => {
      const containers = search(json);
      containers.forEach((container) => {
        const name = (container.image.includes(':')) ? container.image: container.image + ":latest";

        obj[name] = {
          kubeCreate: fixed.command,
          kubeSet: `kubectl set image ${json.kind.toLowerCase()}/${json.metadata.name} ${container.name}=`,
          dockerStart: '',
          dockerEnd: '',
          newName: '',
          newImageID: '',
          oldImageIDs: {}
        };
      })
    });

    return obj;
  }, {})
}

module.exports = addDocker(addKube());
