const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const idAutoIncrement = require('mongoose-auto-increment')

const companySchema = new mongoose.Schema(
    {
        companyId: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required:[true, 'Company Name is required'],
            unique:true            
        }, 
        companyAddress: {
            type: String,
            required:[true, 'Company Address is required'],
        },
        companyPhone: {
            type: String,
            validate:{
                validator: function(v){
                    return /\d{10}/.test(v);
                },
                message: props => '${props.value} is not a valid phone number'
            },
            required:[true,'Company phone is required']
        },
        token : {
            type: String,
            //required: true
        }
    }
)

// Hash the password before saving
companySchema.pre('save', async function(next){
    console.log('Middleware called before calling company save to add JWT')
    const company = this
    const token = jwt.sign({_id: company._id.toString()}, process.env.JWT_SECRET)
    company.token = token
    next()
})


idAutoIncrement.initialize(mongoose.connection)
companySchema.plugin(idAutoIncrement.plugin, {
    model:'company',
    field: 'companyId',
    startAt: 1,
    incrementBy: 1
})

const company = mongoose.model('Company', companySchema)
module.exports = company