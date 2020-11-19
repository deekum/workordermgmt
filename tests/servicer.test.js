const request = require('supertest');
const app = require('../src/app')
const Servicer = require('../src/models/servicer')

const servicerTest = {
    servicerName: "India Mart",
    servicerAddress: "Mumbai",
    servicerPhone: "9876546555"
}

beforeEach(async () => {
    await Servicer.deleteMany()
})

test('create a new servicer', async () => {
    await request(app).post('/createServicer').send(servicerTest).expect(201)
})
