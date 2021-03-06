const mongoose = require('mongoose')
const validator = require('validator')
const servicerIdAutoIncrement = require('mongoose-auto-increment')
const jwt = require('jsonwebtoken')

const servicerSchema = new mongoose.Schema(
    {
        servicerid: {
            type: Number,
            required: true
        },
        servicerName: {
            type: String,
            required: [true, 'Servicer Name is required'],
        },
        servicerAddress: {
            type: String,
            required: [true, 'Servicer Address is required'],
        },
        servicerPhone: {
            type: String,
            validate:{
                validator: function(v){
                    return /\d{10}/.test(v);
                },
                message: props => '${props.value} is not a valid phone number'
            },
            required:[true, 'Servicer Phone Number is required']
        },
        token : {
            type: String
        }
    }
)

servicerIdAutoIncrement.initialize(mongoose.connection)
servicerSchema.plugin(servicerIdAutoIncrement.plugin, {
    model:'servicer',
    field: 'servicerid',
    startAt: 1,
    incrementBy: 1
})

servicerSchema.methods.generateAuthToken = async function () {
    const servicer = this
    const token = jwt.sign({ _id: servicer._id.toString()}, process.env.JWT_SECRET)
    servicer.token = token
    return token
}

const servicer = mongoose.model('Servicer', servicerSchema)
module.exports = servicer
