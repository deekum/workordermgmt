const express = require('express')
const Workorder = require('../models/workorder')
const { ObjectID } = require('mongodb')
const Company = require('../models/company')
const Technician = require('../models/technician')
const jwt = require('jsonwebtoken')
const logger = require('../logger/logger')

const router = express.Router()

router.post('/createworkorder', async (request, response)=>{
    try{
        const token = request.header('Authorization').replace('Bearer ','')
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const company = await Company.findOne({_id: decode._id})
        if(!company){
            //logger.error('Not able to identify company')
            throw new Error('Not able to identify company')
        }
        //logger.info('create order')
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

router.post('/updateworkorder', async (request, response)=>{
    try{
        // const token = request.header('Authorization').replace('Bearer ','')
        // const decode = jwt.verify(token, process.env.JWT_SECRET)
        // const technician = await Technician.findOne({_id: decode._id})
        // if(!technician){
        //     logger.error('Not able to identify technician')
        //     throw new Error('Not able to identify technician')
        // }
        

        const updates = Object.keys(request.body)
        const allowedUpdates = ['workorderid','status']
        const isValidOperation =  updates.every((item)=>{
            return allowedUpdates.includes(item)
        })

        console.log(isValidOperation)
        if(!isValidOperation){
            //logger.error('Invalid request to update workorder status')
            return res.status(404).send('Invalid request to update workorder status')
        }
        const workorder = await Workorder.findOne({'workorderid':request.body.workorderid})
        if(!workorder){
            //logger.error('No workorder found with given id')
            response.status(404).send("No workorder found")
        }   
        workorder.status = request.body.status
        
        await workorder.save()
            
        response.status(200).send(workorder)
        
    } catch(error){
        console.log(error)
        //logger.error('Error while update workorder ',error)
        response.status(500).send(error)
    }

})

module.exports = router