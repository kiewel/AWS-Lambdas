let config = require('./config.js');
let build = require('./build.js');

build(config).then(process.exit);