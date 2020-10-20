const mongoose = require('mongoose')
const FKHelper = require('./helpers/FKHelper')
const autoincrement = require('mongoose-auto-increment')

const allowedStatus = ['created', 'assigned', 'scheduled', 'onsite', 'completed', 'cancelled']
                    
const workorderSchema = new mongoose.Schema(
    {
        workorderid:{
            type:Number,
            //required:true,
            
        },
        company:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Company',
            required:true,
            validate : {
                validator: function (input) {
                    return FKHelper(mongoose.model('Company'),input)
                },
                message : 'Company does not exist.'
            }
        },
        decription: {
            type:String,
            required:true,
            trim:true
        },
        category: {
            type:String,
            required:true,
            trim:true
        },
        customerName : {
            type:String,
            required:true,
            trim:true
        },
        customerPhone : {
            type:String,
            required: true,
            validate:{
                validator: function(v){
                    return /\d{10}/.test(v);
                },
                message: props => 'not a valid phone number '
            }
        },
        customerAddress:{
            type:String,
            required:true,
            trim: true
        },
        status:{
            type:String,
            default: 'Created',
            validate : {
                validator: function(value){
                    return (allowedStatus.includes(value))
                },
                message: props =>'${props.value} is not a valid status.'
            }
        },
        servicer:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Servicer",
            validate : {
                validator: function (input) {
                    return FKHelper(mongoose.model('Servicer'),input)
                },
                message : 'Servicer does not exist.'
            }
        },
        technician:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Technician",
            validate : {
                validator: function (input) {
                    return FKHelper(mongoose.model('Technician'),input)
                },
                message : 'Technician does not exist.'
            }
        },
        comment:{
            type:String,
            trim: true
        },
        image:{
            type:Buffer
        }

    }
)

autoincrement.initialize(mongoose.connection)
workorderSchema.plugin(autoincrement.plugin, {
    model:'WorkOrder',
    field: 'workorderid',
    startAt: 1,
    incrementBy: 1
})

const workorder = mongoose.model('WorkOrder',workorderSchema)
module.exports = workorder