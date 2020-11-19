const request = require('supertest')
const app = require('../src/app')
const company = require('../src/models/company')

beforeAll(async()=>{
    await company.deleteMany()
})

test('create company test',async()=>{
    await request(app).post('/company/createcompany').send({        
        name: "TietoEvry",
        companyAddress : "Bangalore",        
        phone: "1234567890"
    }).expect(201)
})