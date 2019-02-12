let logger      = require('./scripts/logger.js');
let metalsmith  = require('./scripts/metalsmith.js');
let publish     = require('./scripts/publish.js');
let clearTemp   = require('./scripts/clearTemp.js');

async function build(config) {
  logger.blockStart('Build started');
  await clearTemp(config)
  await metalsmith(config);
  await publish(config);
  logger.blockEnd('Build finished');
}

module.exports = build;
