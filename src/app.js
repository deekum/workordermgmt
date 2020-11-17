const { request } = require('express')
const express = require('express')
const { ObjectID, Timestamp } = require('mongodb')
require('./db/mongoose')

const company = require('./models/company')
const servicer = require('./models/servicer')
const technician = require('./models/technician')
const workorder = require('./models/workorder')
const technicianworkOrder = require('./models/technicianWorkOrder')
const workorderRouter = require('./routers/workorder')
const technicianRoute = require('./routers/technicianRoute')
const servicerRouter = require('./routers/servicer')
const {logger, serviceLogger} = require('./logger/logger')

const app = express()
app.use(express.json())

app.use(serviceLogger)

app.use(workorderRouter)
app.use(technicianRoute)
app.use(servicerRouter)

//Addedd winston loggers 
logger.info('Sample info log.')
logger.error('Sample error log.')
logger.debug('Sample debug log.')


// async function createNewCompany() {
//     const companyobject = new company({name: 'AC company'})
//     const result = await companyobject.save()
//     console.log(result)
// }

// createNewCompany().then(()=>{
//     console.log('company created')
// }).catch((err)=>{
//     console.log(err)
// })

//sample testing to create technician
// const createTechnician = async() =>{
//     const tech = new technician({
//         technicianid:1001,
//         firstname:'Adam',
//         middlename:' J',
//         lastname:'Morris',
//         age: 27,
//         emailId:'moris@test.com',
//         address:'CA',
//         phone:'123-321-2314'
//     })
//     await tech.save()
// }

// createTechnician().then((err)=>{
//     console.log('Technician created')
// }).catch((err)=>{
//     console.log(err)
// })

//Create sample Servicer
//const createServicer = async() => {
//    const servicerObject = new servicer({
//        name: 'EVRY'
//    })
//    await servicerObject.save()
//}

//createServicer().then(() => {
//    console.log('Servicer created')
//}).catch((err) => {
//    console.log('Error', err)
//})

//Create same workorder
// const createWorkOrder = async()=>{
//     const workOrderObject = new workorder({
//         workorderid: '1',
//         company: ObjectID('5f857c9881e28f2e1c49f6ad'),
//         decription: 'AC is not working',
//         category:'AC',
//         customerName: 'Deepak'
//     })
//     await workOrderObject.save()
// }
// createWorkOrder().then(()=>{
//     console.log('workOrder created')
// }).catch((err)=>{
//     console.log(err)
// })

//sample testing to create technician workorder
// const createTechnicianworkorder = async() =>{
//     const techworkOrder = new technicianworkOrder({
//         workorderid:1,
//         assignedBy:"5f86e8f22e33659854c143e1",//servicer id
//         assignedTo:1001,//technician id
//         jobDescription:'Complaint description',
//         jobCustomerAddress: 'Kormangala',
//         jobCustomerPhone:'123-321-2314'
        
//     })
//     await techworkOrder.save()
// }

// createTechnicianworkorder().then((err)=>{
//     console.log('createTechnicianworkorder created')
// }).catch((err)=>{
//     console.log(err)
// })

module.exports=app
