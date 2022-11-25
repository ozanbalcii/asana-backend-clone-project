const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'section-service' },
    transports: [
      new winston.transports.File({ filename: 'v1/src/logs/section/error.log', level: 'error' }), 
      new winston.transports.File({ filename: 'v1/src/logs/section/info.log', level: 'info' }), 
      new winston.transports.File({ filename: 'v1/src/logs/section/combined.log' }),   
    ],
  });

  module.exports = logger;