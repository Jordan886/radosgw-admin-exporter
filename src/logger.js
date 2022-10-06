const winston = require('winston')
const { config } = require('./config')

const logger = winston.createLogger({
  level: config.log_level,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.splat(),
    // winston.format.align(),
    winston.format.printf(((log) => `${log.timestamp} [${log.level}]: ${log.message}`)),
  ),
  transports: [new winston.transports.Console()],
});

module.exports = logger
