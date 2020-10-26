const mongoose = require('mongoose')
const validator = require('validator')
require('../db/mongoose')
const jobIdGenerator = require('mongoose-auto-increment')

const technicianWorkOrderSchema = mongoose.Schema({
    jobid:{
        type:Number,
        required:true
    },
    workorderid:{
        type:Number,
        required:true        
    },
    assignedBy:{
        type:mongoose.ObjectId,
        required:true        
    },
    assignedTo:{
        type:Number,
        required:true        
    },
    jobDescription:{
        type:String,
        required:true
    },
    jobCustomerAddress:{
        type:String,
        required: true,
    },
    jobCustomerPhone:{
        type:String,
        validate:{
            validator: function(v){
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: props => '${props.value} is not a valid phone number '
        },
        required:[true,'Customer phone is required'],

    },
    //Job Priority Codes Low, Normal, High
    jobPriority:{
        type:String,
        default:"Normal"
    },
    //Job Status Codes Assigned:1,Inprogress-2,on hold-3,completed-4,cancelled-5
    jobStatus:{
        type:Number,
        default:1        
    }
})

jobIdGenerator.initialize(mongoose.connection)
technicianWorkOrderSchema.plugin(jobIdGenerator.plugin, {
    model:'technicianWorkOrder',
    field: 'jobid',
    startAt: 1,
    incrementBy: 1
})

//creation of technicianWorkOrder model
const technicianWorkOrder = mongoose.model('technicianWorkOrder', technicianWorkOrderSchema)
module.exports = technicianWorkOrder