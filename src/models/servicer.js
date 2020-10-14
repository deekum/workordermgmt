const mongoose = require('mongoose')

const servicerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        tokens: [{
            token: {
                type: String
            }
        }]
    }
)

const servicer = mongoose.model('Servicer', servicerSchema)
module.exports = servicer
