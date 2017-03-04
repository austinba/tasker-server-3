import winston from 'winston';
import _ from 'underscore';
import formatLogArguments from '~/helpers/formatLogs';

const consoleTransportSettings = {
  level:       'debug',
  prettyPrint: true,
  colorize:    true,
  silent:      false,
  timestamp:   false
};

const fileTransportSettings =    {
  prettyPrint: false,
  level:       'info',
  silent:      false,
  colorize:    true,
  timestamp:   true,
  filename:    './server.log',
  maxsize:     40000,
  maxFiles:    100,
  json:        false
}

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, consoleTransportSettings);
winston.add(winston.transports.File, fileTransportSettings);
winston.setLevels(winston.config.syslog.levels);  // RFC5424 Levels, emerg: 0, alert: 1, crit: 2, error: 3, warning: 4, notice: 5, info: 6, debug: 7


function stringify(obj) {         // convert anything (not just JSON) to a string
  if (typeof obj === 'undefined') return;
  if (obj instanceof Error      ) return obj.toString() + '\n' + obj.stack;
  if (typeof obj !== 'object'   ) return obj.toString();
  return JSON.stringify(obj, null, 2)
};

const winstonEnhanced = {};  // stringify arguments and report file name & line number of error
_.each(['debug', 'info', 'notice', 'warning', 'error', 'crit', 'alert', 'emerg'], level => {
  winstonEnhanced[level] = (...args) => winston[level](...formatLogArguments(1, args.map(stringify)));
});

export default winstonEnhanced;
