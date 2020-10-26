const request = require('supertest')
const app = require('../src/app')
const technician = require('../src/models/technician')


beforeAll(async()=>{
    await technician.deleteMany()
})

test('create technician test',async()=>{
    await request(app).post('/technician/createTechnician').send({
        age: 20,
        firstname: "prachanda3",
        middlename: "J",
        lastname: "KUllaa3",
        emailId: "prachanda3@test.com",
        address: "PA",
        phone: "123-321-2314"
    }).expect(201)
})

test('test duplicate technician', async()=>{
    await request(app).post('/technician/createTechnician').send({
        age: 20,
        firstname: "prachanda3",
        middlename: "J",
        lastname: "KUllaa3",
        emailId: "prachanda3@test.com",
        address: "PA",
        phone: "123-321-2314"
    }).expect(400)
})