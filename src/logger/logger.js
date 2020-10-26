const winston  = require('winston')
const { format, level } = require('winston')
const path = require('path')
const {combine,timestamp, label} = format

const logger = {
    console:winston.createLogger({
        level: 'info',
        format: combine(
            winston.format.colorize(),
            label({label:'workOrderMgmt'}),
            timestamp(),
            winston.format.printf(info => `${info.timestamp} [${info.label}] [${info.level}]: ${info.message}`)
        ),
        transports: new winston.transports.Console()
    }),
    file:winston.createLogger({
        level:'error',
        format: combine(
            label({label:'workOrderMgmt'}),
            timestamp(),
            winston.format.printf(info => `${info.timestamp} [${info.label}] [${info.level}]: ${info.message}`)
        ),
        transports: [
            new winston.transports.File({ dirname: './log',filename: '/workordermgmt_error.log',level: 'info'})
        ]
    })
}

module.exports = logger