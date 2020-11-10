const request = require('supertest')
const app = require('../src/app')
const workorder = require('../src/models/workorder')
const company = require('../src/models/company')
let token ;
let workorderid;
    

beforeAll(async()=>{
    jest.setTimeout(20000)
    console.log('jest timeout set to 20000')
    await workorder.deleteMany()
    const companyobject = new company({name: 'AC company'})
    const result = await companyobject.save()
    token = result.token
    console.log('token:'+token)
})


 test('should create a work order',async()=>{
    const response = await request(app)
        .post('/createworkorder')
        .set('Authorization','Bearer '+token)
        .send({
            decription: "New AC installation",
            category: "AC",
            customerName: "Sumit Kumar",
            customerPhone: "8427675680",
            customerAddress: "zirakpur, punjab"
        })
        //console.log(response)
        //console.log(response.body)
        workorderid= response.body.workorderid
        console.log('workorderid:'+workorderid)
        expect(response.res.statusCode).toEqual(201)
        
 })

test('should update a work order',async()=>{
    await request(app).post('/updateworkorder').send({
        workorderid,
        status: "assigned"
    }).expect(200)
})


test('should get work orders for company',async()=>{
    await request(app).get('/company/getworkorders')
    .set('Authorization','Bearer '+token)
    .send().expect(200)
})


test('should get all work orders',async()=>{
    await request(app).get('/getallworkorders').send({
    }).expect(200)
})
