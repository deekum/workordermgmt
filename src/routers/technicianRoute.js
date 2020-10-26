const express = require("express")
const Technician = require("../models/technician")
const TechnicianWorkOrder = require("../models/technicianWorkOrder")
const technicianRouter = new express.Router()
const {Mongoose} = require('mongoose')
const { request, response } = require("express")
const { update } = require("../models/technician")


// Get List of technicians
technicianRouter.get('/technician/getTechnicianList',async(request,response)=>{
    try {

        const tech = await Technician.find()
        response.status(200).send(tech)
        
    } catch (error) {
        response.status(400).send(error)
    }
})

// Get Technician
technicianRouter.get('/technician/getTechnician',async(request,response)=>{
    try {
        const techId = request.body
        console.log(techId)

        const tech = await technician.findById(techId)
        response.status(200).send(tech)
        
    } catch (error) {
        response.status(400).send(error)
    }
})

// Create Technician
technicianRouter.post('/technician/createTechnician',async(request,response)=>{
    const newtechnician = new Technician(request.body)
    try {
            await newtechnician.save()
            response.status(200).send(newtechnician)

    } catch (error) {
        response.status(400).send(error)
    }
})

//Servicer Assign work to technician
technicianRouter.post('/technician/assignWorkToTech',async(request,response)=>{
    const job = new TechnicianWorkOrder(request.body)
    // const validParameters = ['workorderid','assignedBy','assignedTo','jobDescription','jobCustomerAddress','jobCustomerPhone']
    // const isValidParameters = technicianParams.every((update) =>validParameters.includes(update))
    // if(!isValidParameters){
    //     response.status(400).send({error:'Invalid Parameter to udapte'})
    // } 
    try {

        TechnicianWorkOrder.countDocuments({
                workorderid:request.body.workorderid,
                assignedTo:request.body.assignedTo},async(err,count)=>{
           //Check fo duplicate job assignment
            if (count == 0) {
                await job.save()
                response.status(200).send(job)
            } else {
                response.status(409).send({Error:"Job is already assigned to Technician"})
            }
        })
    } catch (error) {
        response.status(400).send(error)
    }
})

module.exports = technicianRouter