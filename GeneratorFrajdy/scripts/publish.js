let ncp    = require('ncp').ncp;
let path   = require('path');
let rimraf = require('rimraf');

let logger = require('./logger.js');

ncp.limit = 16;

function publish(config) {
  let temp = path.resolve(__dirname, config.paths.root, config.paths.temp);
  let results = path.resolve(__dirname, config.paths.root, config.paths.results);

  return new Promise((resolve, reject) => {
    rimraf(results, () => {
      ncp(temp, results, (err) => {
        if (err) {
          logger.error(`Publish [ERROR]`);
          reject(err); 
        } else {
          logger.success(`Publish [SUCCESS]`);
          resolve();
        }
      });
    });
  });
}

module.exports = publish;
