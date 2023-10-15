const ansi = require('ansi-colors');

function logWithPrefix(message, level = 'info') {
  const prefix = ansi.green("[VuxiLaunch]");
  const timestamp = ansi.gray(new Date().toLocaleString());
  let formattedMessage = '';

  switch (level) {
    case 'info':
      formattedMessage = ansi.cyan(`[${level.toUpperCase()}] ${message}`);
      break;
    case 'warn':
      formattedMessage = ansi.yellow(`[${level.toUpperCase()}] ${message}`);
      break;
    case 'error':
      formattedMessage = ansi.red(`[${level.toUpperCase()}] ${message}`);
      break;
    default:
      formattedMessage = ansi.white(`[${level.toUpperCase()}] ${message}`);
  }

  console.log(`${timestamp} ${prefix} ${formattedMessage}`);
}

function initLogWindow(filename) {
  logWithPrefix(`A iniciado con éxito la pestaña de ${filename}`);
  console.log('------------')
}

module.exports = {
  info: (message) => logWithPrefix(message, 'info'),
  warn: (message) => logWithPrefix(message, 'warn'),
  error: (message) => logWithPrefix(message, 'error'),
  initLogWindow: initLogWindow,
};