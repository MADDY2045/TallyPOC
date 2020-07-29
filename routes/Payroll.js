const express = require('express');
const path = require('path');
const router = express.Router();
const axios = require('axios');
var xml2js = require('xml2js');
const TallyMaster = require('../models/TallyTransaction');
var dateFormat = require('dateformat');
var template = require('../helpers/payrollxml');
var X2JS = require('x2js');
var DomParser = require('dom-parser');
const PayHeadMaster = require('../models/PayrollPayheads');
const EmployeeSalaryMaster = require('../models/EmployeeSalaryDetails');

var { payrolltallytemplate,payheadentrylist,ledgerentrieslist,bankallocationslist } = require('../helpers/payrolltemplatejson');




router.get('/getpayrolldetails',(req,res)=>{

    res.send(payrolltallytemplate)

    // let x2js = new X2JS();
    // const xmlstring = x2js.js2xml(payrolltallytemplate);

    // axios({url:'http://localhost:9000',method:'POST',headers:{ContentType: 'text/xml',charset:'UTF-8'},data:xmlstring})
    // .then(response=>{
    //     console.log(response.data);
    // }).catch(err=>console.log(err));
    // res.send(payrolltallytemplate);
   });

 router.post("/createpayheadmaster",async(req,res)=>{
    try{
        const payhead = req.body.payhead;
        const type = req.body.type;

        const newpayheaddata = new PayHeadMaster({payhead,type});
        const saveddata = await newpayheaddata.save().then(response=>{
            res.send(response)
        }).catch(err=>{
            console.log(err);
        })

    }catch(error){
        console.log(error);
    }
 })

 router.post('/createemployeesalary',async(req,res)=>{
     try{
        console.log(req.body);
        const { name,role,id,payhead,date,transactiontype,account,instrumentnumber,instrumentdate,ifsc,txntypeflag } = req.body.data;
       const newSalaryData = new EmployeeSalaryMaster({account,date,id,ifsc,instrumentdate,instrumentnumber,name,payhead,role,transactiontype });
       const saveddata = await newSalaryData.save().then(result=>{
           if(result){
               console.log("saved successfully");
           }
       }).catch(err=>console.log(err))
        res.send("received")
     }catch(error){console.log(error)}

 })
module.exports=router;

