const { json } = require('express')
const request = require('request')
const workorder = require('../models/workorder')
const fetch = require('node-fetch')
const wrkOrderUrl = 'http://localhost:'+process.env.PORT+'/getworkorders/'

const getWorkOrder = async(workOrderid,callback)=>{
    const url = wrkOrderUrl+ workOrderid
    request({ url, json: true }, (err, res) => {
        if (err) {
            callback(err, undefined)
        }
        callback(undefined, res)
    })
 }

const getWorkOrderInfo = async(workOrderid)=>{
    const url = wrkOrderUrl+ workOrderid
    const data = await fetch(url)
    .then(res=> res.json())
    return data
}

const updateCompanyWorkOrder = (workOrderid,status,callback)=>{
    const data = JSON.stringify({
        "workorderid":workOrderid,
        "status":status
    })
    
    request.post({
        headers: {'Content-Type': 'application/json','Content-Length': data.length },
        hostname: 'localhost',
        port: process.env.PORT,
        url: 'http://localhost:'+process.env.PORT+'/updateworkorder',
        method: 'POST',
        body: data
    
    },async(error,res,body)=>{
        if(res.statusCode != 200){
           callback(undefined,body)
        }
    })
}

const convertPhoneNumber = (phoneNumber)=>{
  return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/,"$1-$2-$3")
}

module.exports = {getWorkOrder,getWorkOrderInfo,updateCompanyWorkOrder,convertPhoneNumber}