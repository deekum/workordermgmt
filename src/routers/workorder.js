const express = require('express')
const Workorder = require('../models/workorder')
const Company = require('../models/company')
const jwt = require('jsonwebtoken')
const {logger, serviceLogger} = require('../logger/logger')

const router = express.Router()

router.post('/createworkorder', async (request, response)=>{
    try{
        const token = request.header('Authorization').replace('Bearer ','')
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const company = await Company.findOne({_id: decode._id})
        if(!company){
            logger.error('Not able to identify company')
            throw new Error('Not able to identify company')
        }
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
        const updates = Object.keys(request.body)
        const allowedUpdates = ['workorderid','status']
        const isValidOperation =  updates.every((item)=>{
            return allowedUpdates.includes(item)
        })

        logger.debug('is Valid for input for updateworkorder:'+isValidOperation)
        if(!isValidOperation){
            logger.error('Invalid request to update workorder status')
            return response.status(404).send('Invalid request to update workorder status')
        }
        const workorder = await Workorder.findOne({'workorderid':request.body.workorderid})
        if(!workorder){
            logger.error('No workorder found with given id')
            return response.status(404).send("No workorder found")
        }   
        workorder.status = request.body.status
        await workorder.save()
            
        response.status(200).send(workorder)
        
    } catch(error){
        console.log(error)
        logger.error('Error while update workorder ',error)
        response.status(500).send(error)
    }

})

router.get("/company/getworkorders/:workorderid?", async (request, response)=>{
    const workorderid = request.params.workorderid
    try{
        const token = request.header('Authorization').replace('Bearer ','')
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        
        const company = await Company.findOne({_id: decode._id})
        if(!company){
            logger.error('getworkorders is not requested by a valid company')
            throw new Error('Not able to identify company')
        } 

        let workorders
        if(!workorderid){
            workorders = await Workorder.find({company}).select('-company -_id -__v')   
        } else {
            workorders = await Workorder.findOne({company,workorderid}).select('-company -_id -__v')  
        }
        console.log(workorders)
        if(!workorders){
            logger.error('No workorder found')
            return response.status(404).send("No workorder found")
        }   
        response.status(200).send(workorders)
        
    } catch(error){
        console.log(error)
        logger.error('Error while fetching workorders ',error)
        response.status(500).send(error)
    }

})

router.get("/getworkorders/:workorderid?", async (request, response)=>{
    const workorderid = request.params.workorderid
    try{
        let workorders
        if(!workorderid){
            workorders = await Workorder.find().select('-_id -__v').populate({
                path:'company',
                select:'name -_id'
            })     
        } else {
            workorders = await Workorder.findOne({workorderid}).select('-_id -__v').populate({
                path:'company',
                select:'name -_id'
            })   
        }
        
        if(!workorders){
            logger.error('No workorder found')
            return response.status(404).send("No workorder found")
        }   
        response.status(200).send(workorders)
        
    } catch(error){
        console.log(error)
        logger.error('Error while fetching all workorders ',error)
        response.status(500).send(error)
    }

})

router.post('/cancelworkorder', async (request, response)=>{
    try {
        const updates = Object.keys(request.body)
        const allowedUpdates = ['workorderid', 'reason']
        const isValidOperations = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOperations) {
            logger.error('Invalid request to cancel the workorder')
            return response.status(404).send({ error: 'Invalid request to cancel the workorder' })
        }
        if(!request.body.reason){
            logger.error('Reason is required to cancel the workorder')
            return response.status(404).send({ error: 'Reason is required to cancel the workorder' })
        }
        const workorder = await Workorder.findOneAndUpdate({ 'workorderid': request.body.workorderid }, { 'status':'cancelled' }, { new: true, runValidators: true })
        if (!workorder) {
            logger.error('No workorder found for the given id')
            return response.status(404).send({ error: 'No workorder found for the given id' })
        }
        response.status(200).send(workorder)
    } catch (error) {
        logger.error('Error while cancelling workorder ', error)
        response.status(500).send(error)
    }
})

module.exports = router
