const express = require("express")
const Technician = require("../models/technician")
const servicer = require("../models/servicer")
const TechnicianWorkOrder = require("../models/technicianWorkOrder")
const technicianRouter = new express.Router()
const {Mongoose} = require('mongoose')
const { request, response } = require("express")
const { update } = require("../models/technician")
const technician = require("../models/technician")
const auth = require("../utils/auth")
const {getWorkOrder,updateCompanyWorkOrder, getWorkOrderInfo,convertPhoneNumber} = require("../utils/utils")
const statusDictionay = {1:'created', 2:'assigned', 3:'scheduled', 4:'onsite', 5:'completed', 6:'cancelled'}

// Get List of technicians
technicianRouter.get('/technician/getTechnicianList',auth,async(request,response)=>{
    try {

        const tech = await Technician.find()
        response.status(200).send(tech)
        
    } catch (error) {
        response.status(400).send(error)
    }
})

// Get Technician
technicianRouter.get('/technician/getTechnician',auth,async(request,response)=>{
    try {
        // const techId = request.body
        // console.log(techId)

        // const tech = await technician.findById(techId)
        response.status(200).send(request.tech)
        
    } catch (error) {
        response.status(400).send(error)
    }
})

// Create Technician
technicianRouter.post('/technician/createTechnician',async(request,response)=>{
    const technician = new Technician(request.body)
    try {
            await technician.save()
            const authToken = await technician.generateJWTAuthToken()
            response.status(201).send({technician,authToken})

    } catch (error) {
        response.status(400).send(error)
    }
})

//Technician login

technicianRouter.post('/technician/login', async(request,response)=>{
    try {
        console.log(request.body.emailId,request.body.passowrd)
        const tech = await Technician.findTechnician(request.body.emailId,request.body.passowrd);
        const techAuth = await tech.generateJWTAuthToken()

        if(!tech){
            response.status(400).send()
        }
        response.send({tech,techAuth})
    } catch (error) {
        response.status(500).send({Error: 'Unable to login'})    
    }
    
})

//Servicer Assign work to technician
technicianRouter.post('/technician/assignWorkToTech',async(request,response)=>{
const workOrderInfo = await getWorkOrderInfo(request.body.workorderid)
  
const phno = convertPhoneNumber(workOrderInfo.customerPhone)

const tech = await Technician.findOne({"technicianid":request.body.assignedTo}).select('firstname lastname')
const servicername = await servicer.findOne({"_id":request.body.assignedBy}).select("servicerName")

const techname = tech.firstname+" "+tech.lastname

const assignInput ={
    "workorderid":request.body.workorderid,
    "assignedBy":request.body.assignedBy,
    "assignedTo":request.body.assignedTo,
    "jobDescription":workOrderInfo.decription,
    "jobCustomerAddress":workOrderInfo.customerAddress,
    "jobCustomerPhone":phno
}

const job = new TechnicianWorkOrder(assignInput)
 
    // const job = new TechnicianWorkOrder(request.body)
    
    try {

        TechnicianWorkOrder.countDocuments({
                workorderid:request.body.workorderid},async(err,count)=>{
           //Check for duplicate job assignment
            if (count == 0) {
                await job.save()
                job.set({"jobStatus":statusDictionay[job.jobStatus]}) 

                response.status(200).send({
                    "jobPriority": job.jobPriority,
                    "jobStatus": statusDictionay[job.jobStatus],
                    "_id": job._id,
                    "workorderid": job.workorderid,
                    "assignedBy": servicername.servicerName,
                    "assignedTo": techname,
                    "jobDescription": job.jobDescription,
                    "jobCustomerAddress": job.jobCustomerAddress,
                    "jobCustomerPhone": job.jobCustomerPhone
                })
            } else {
                response.status(409).send({Error:"Job is already assigned to Technician"})
            }
        })
    } catch (error) {
        response.status(400).send(error)
    }
})

//Update technician workOrder status
technicianRouter.patch('/technician/updateWorkStatus', async(req,res)=>{
    const keys = Object.keys(req.body)
    const workOrderKeys = ['workorderid','jobStatus']
    const isValidKey = keys.every((workOrderupdate)=> workOrderKeys.includes(workOrderupdate))
    

    if(!isValidKey){
        res.status(400).send({error:"Not a valid key"})
    }

    //check if technician is valid
    try {
       const wo_id = req.body.workorderid
       const wo_status = statusDictionay[req.body.jobStatus]

        getWorkOrder(req.body.workorderid,async(err,data)=>{
            if(data.statusCode !=200){
                throw new Error({Error: "Not a valid work order"})
            //res.send({Error: "Not a valid work order"})
            }else{
                try {
                    const workorder  = await TechnicianWorkOrder.findOneAndUpdate(
                        {workorderid:wo_id},
                        {jobStatus:req.body.jobStatus},
                        {new:true,runValidators:true})
                     //update company workorder status
                     updateCompanyWorkOrder(wo_id,wo_status,async(err,data)=>{
                        if (data.statusCode !=200) {
                            throw new Error("Not a valid status")
                        }
                    })
                  res.status(200).send(workorder)
                } catch (error) {
                    res.status(404).send(error)
                }
            }
        })       
    } catch (error) {
        res.status(404).send(error.message)
    }
})

//logout
technicianRouter.post('/technician/logout',auth,async(req,res)=>{
    console.log('logout')
    try {
        req.tech.tokens = req.tech.tokens.filter((token)=>{
            return token.token != req.token
        })

        await req.tech.save()
        res.send({Info:'Logged Out successfully'})
    } catch (error) {
       res.status(500).send() 
    }
})

module.exports = technicianRouter