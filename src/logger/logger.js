const winston  = require('winston')
const expressWinston = require('express-winston')

const logger = winston.createLogger({
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf((info)=>{
                return `${info.timestamp}  [${info.level}]: ${info.message}`
            })
        ),
        transports: [
            new winston.transports.Console({
                level: 'debug'
            }),
            new winston.transports.File({
                filename: './log/workorders.log',
            }),
        ]
    })

expressWinston.requestWhitelist.push('body');
expressWinston.responseWhitelist.push('body');

const serviceLogger = expressWinston.logger({
    transports: [
        new winston.transports.File({filename: './log/workorders.log'})
    ],
    format: winston.format.combine(
      winston.format.json(),
    //   winston.format.timestamp(),      
    //   winston.format.printf((info)=>{
    //     return `${info.timestamp}  [${info.level}]: ${info.message}`
    //   })
    ),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    //msg: "HTTP {{req.url}} {{req.body}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) { return false; }, // optional: allows to skip some log messages based on request and/or response
  })


module.exports = {logger, serviceLogger}
