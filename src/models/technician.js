const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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
        unique:[true,'Technician already exist with same email-id'],
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
    passowrd:{
        type:String,
        required: true,
        trim:true,
        minlength:6,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain password')
            }
        }
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

//middleware pre function to execute for password hasing

technicianSchema.pre('save', async function(err,doc,next){
    const technician = this
       if(technician.isModified('passowrd')){
        technician.passowrd = await bcrypt.hash(technician.passowrd,8)
       }
       next()
   })
   
   
   //generate Auth Token
   technicianSchema.methods.generateJWTAuthToken = async function() {
       const tech = this
       const token = jwt.sign({_id:tech._id.toString()},"hello")
       
       //save technician token to db
       tech.tokens = tech.tokens.concat({token})
       try {
        await tech.save()
       } catch (error) {
           
       }
       
       return token
   }
   
   //technician Login
   technicianSchema.statics.findTechnician = async (email, password) =>{
       
       const tech = await technician.findOne({emailId:email})
       

       if(tech == 'null'|| !tech ){
           throw new Error ('Unable to login1')
       }
       const istechnicianMatch = await bcrypt.compare(password,tech.passowrd)
       if(!istechnicianMatch){
           throw new Error('Unable to login2');
       }
       console.log("technician Login-2")
       return tech
   }

   technicianSchema.methods.toJSON = function(){
       const tech = this
       const techObject = tech.toObject()

       delete techObject.passowrd
       delete techObject.tokens
       return techObject
   }

//creation of technician model
const technician = mongoose.model('technician', technicianSchema)
module.exports = technician