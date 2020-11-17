const express = require('express')
const Servicer = require("../models/servicer")
const jwt = require('jsonwebtoken')
const servicerRouter = new express.Router()

//Create Servicer
servicerRouter.post('/createServicer', async (req, res) => {   
    const servicerObject = new Servicer(req.body)
    try {
        const token = await servicerObject.generateAuthToken()
        await servicerObject.save()      
        res.status(201).send({servicerObject, token})
    } catch (error) {
        res.status(400).send(error)
    }
})

//Get Servicers based on JWT token
servicerRouter.get('/getServicer', async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const servicers = await Servicer.findOne({ _id: decode._id, 'tokens.token': token})
        if(!servicers){
            return res.status(404).send(servicers)
        }
        res.send(servicers)                    
    } catch(error) {
        res.status(500).send(error)
    }
})
module.exports = servicerRouter
