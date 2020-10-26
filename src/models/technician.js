const mongoose = require('mongoose')
const validator = require('validator')
require('../db/mongoose')
const idGenerator = require('mongoose-auto-increment')

const technicianSchema = mongoose.Schema({
    technicianid:{
        type:Number,
        required:true
    },
    firstname: {
        type:String,
        required:true,
        trim:true
    },
    middlename: {
        type:String,
        required:true,
        trim:true
    },
    lastname: {
        type:String,
        required:true,
        trim:true
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error("Invalid Age")
            }
        }
    },
    emailId:{
        type:String,
        trim:true,
        lowercase:true,
        required:[true, 'Technician email id is required'],
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Provide valid email ID')
            }
        }
    },
    address:{
        type:String,
        required: true,
    },
    phone:{
        type:String,
        validate:{
            validator: function(v){
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: props => '${props.value} is not a valid phone number '
        },
        required:[true,'Technician phone is required'],

    },
    tokens:[{
        token:{
            type:String
        }
    }],
    avatar:{
        type:Buffer
    }
})

idGenerator.initialize(mongoose.connection)
technicianSchema.plugin(idGenerator.plugin, {
    model:'technician',
    field: 'technicianid',
    startAt: 1,
    incrementBy: 1
})

//creation of technician model
const technician = mongoose.model('technician', technicianSchema)
module.exports = technician