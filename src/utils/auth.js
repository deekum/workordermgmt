const jwt = require('jsonwebtoken')
const technician = require('../models/technician')

const auth = async(req,res,next)=>{
try {
    const token = req.header('Authorization').replace('Bearer ','')
    const decoded = jwt.verify(token,'hello')
    const tech = await technician.findOne({_id:decoded._id, 'tokens.token':token})

    if(!tech){
        throw new Error()
    }
    req.token = token
    req.tech = tech
    next()
} catch (error) {
    {
        res.status(500).send({Error:'Please Authenticate'})
    }
}
}
module.exports = auth