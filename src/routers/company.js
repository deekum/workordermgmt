const express = require('express')
const company = require("../models/company")
const jwt = require('jsonwebtoken')
const companyRouter = new express.Router()

//Create Company
companyRouter.post('/createCompany', async (req, res) => {   
    const companyObject = new company(req.body)
    try {        
        await companyObject.save()      
        res.status(201).send({companyObject})
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

//Get Company based on JWT token
companyRouter.get('/getCompany', async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const companies = await company.findOne({ _id: decode._id, 'tokens.token': token})
        if(!companies){
            return res.status(404).send(companies)
        }
        res.send(companies)                    
    } catch(error) {
        res.status(500).send(error)
    }
})

module.exports = companyRouter