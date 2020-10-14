const express = require('express')
require('./db/mongoose')
const company = require('./models/company')
const technician = require('./models/technician')

const app = express()
app.use(express.json())

const port = process.env.PORT

// async function createNewCompany() {
//     const companyobject = new company({name: 'new company'})
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

app.listen(port , ()=>{
    console.log('Server started at port:'+port)
})