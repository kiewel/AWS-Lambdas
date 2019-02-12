let chalk = require('chalk');
let moment = require('moment');

let defaults = {
  timeFormat: 'HH:mm:ss.SSS',
  timePrefix: '[',
  timeSuffix: ']',
  output: console.log
}

class Logger {
  constructor(options) {
    this.settings = Object.assign({}, defaults, options);
    this.timers = [];
    this.indent = 0;
  }

  log(message) {
    let time = this.time();
    let indent = ' ' + '    '.repeat(this.indent);
    this.settings.output(time + indent + message);
  }

  success(message) {
    this.log(chalk.green(message));
  }

  warn(message) {
    this.log(chalk.yellow(message));
  }

  error(message) {
    this.log(chalk.red(message));
  }

  blockStart(message) {
    this.log(message);
    this.indent += 1;
    this.timers.push(process.hrtime());
  }

  blockEnd(message) {
    let executionTime = this.formatHrend(process.hrtime(this.timers.pop()));
    this.indent -= 1;
    this.log(message + ' ' + executionTime);
  }

  time() {
    let time = '';
    time += chalk.dim(this.settings.timePrefix);
    time += chalk.blue(moment().format(this.settings.timeFormat));
    time += chalk.dim(this.settings.timeSuffix);
    return time;
  }

  formatHrend(hrend) {
    return chalk.cyan(hrend[0] ? hrend[0] + 's' : Math.round(hrend[1]/1000000) + 'ms');
  }
}

module.exports = (new Logger());
