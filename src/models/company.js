const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
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


const company = mongoose.model('Company', companySchema)
module.exports = company