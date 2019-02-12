let path   = require('path');
let rimraf = require('rimraf');
let logger = require('./logger.js');

function clearTemp(config) {
  let temp = path.resolve(__dirname, config.paths.root, config.paths.temp);

  return new Promise((resolve, reject) => {
    rimraf(temp, () => {
      logger.success(`Cleaning [SUCCESS]`);
      resolve();
    });
  });
}

module.exports = clearTemp;
