// Original Source: https://gist.github.com/fisch0920/39a7edc77c422cbf8a18
// NOTE: this adds a filename and line number to winston's output
// Example output: 'info (routes/index.js:34) GET 200 /index'

var path = require('path');
var PROJECT_ROOT = path.join(__dirname, '..');

/**
 * Attempts to add file and line number info to the given log arguments.
 */
export default function formatLogArguments (depth, args) {
  args = Array.prototype.slice.call(args);

  const calleeStrs = [];
  for(let i = 1; i <= depth; i++) { // the top of the stack is the logger creation, so that's not helpful
    var stackInfo = getStackInfo(i);
    if (stackInfo) {
      // get file path relative to project root
      calleeStrs.push('(' + stackInfo.relativePath + ':' + stackInfo.line + ')');
    }
  }

  const calleeStr = calleeStrs.join('<');
  if (typeof (args[0]) === 'string') {
    args[0] = calleeStr + ' ' + args[0];
  } else {
    args.unshift(calleeStr);
  }

  return args;
}

/**
 * Parses and returns info about the call stack at the given index.
 */
function getStackInfo (stackIndex) {
  // get call stack, and analyze it
  // get all file, method, and line numbers
  var stacklist = (new Error()).stack.split('\n').slice(3);

  // stack trace format:
  // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
  // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
  var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
  var stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;

  var s = stacklist[stackIndex] || stacklist[0];
  var sp = stackReg.exec(s) || stackReg2.exec(s);

  if (sp && sp.length === 5) {
    return {
      method: sp[1],
      relativePath: path.relative(PROJECT_ROOT, sp[2]),
      line: sp[3],
      pos: sp[4],
      file: path.basename(sp[2]),
      stack: stacklist.join('\n')
    };
  }
}
