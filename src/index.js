const express = require('express')
require('./db/mongoose')
const company = require('./models/company')

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



app.listen(port , ()=>{
    console.log('Server started at port:'+port)
})