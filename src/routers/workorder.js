const express = require('express')
const Workorder = require('../models/workorder')
const { ObjectID } = require('mongodb')
const Company = require('../models/company')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.post('/createworkorder', async (request, response)=>{
    try{
        const token = request.header('Authorization').replace('Bearer ','')
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const company = await Company.findOne({_id: decode._id})
        if(!company){
            console.log('Not able to identify company')
            throw new Error('Not able to identify company')
        }
        console.log('create order')
        const workorder = new Workorder(request.body)
        workorder.status = 'created'
        workorder.company = company._id 
        await workorder.save()
        response.status(201).send(workorder)
    } catch(error){
        console.log(error)
        response.status(400).send(error)
    }

})

module.exports = router