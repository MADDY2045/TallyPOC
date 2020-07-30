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
        console.log("called after middleware");
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


 router.post('/createemployeesalary',getnetamount,(req,res)=>{
     try{
        const { name,role,id,payhead,date,transactiontype,account,instrumentnumber,instrumentdate,ifsc,txntypeflag } = req.body.data;
        console.log(id);
        EmployeeSalaryMaster.find({id}).exec().then(docs=>{
            if(docs.length>0){
                    console.log("id already exists!!!");
            }else{
                let netpay = req.netAmount;
                const newSalaryData = new EmployeeSalaryMaster({account,date,id,ifsc,instrumentdate,instrumentnumber,name,payhead,role,transactiontype,netpay });
                setTimeout(()=>{
                    const saveddata = newSalaryData.save().then(result=>{
                        if(result){
                            console.log("saved successfully");
                        }
                    }).catch(err=>console.log(err))
                     res.send("received")
                },300)

            }
        }).catch(err=>console.log(err))

     }catch(error){console.log(error)}

 })
module.exports=router;

function getnetamount(req,res,next){
    let tempAmountArray = [];
    let netAmount = 0;
    let { payhead } = req.body.data;
     console.log('payhead',payhead);

     setTimeout(()=>{
        PayHeadMaster.find().exec().then(response=>{
            if(response){
                // console.log(response);
                response.map(item=>{
                   payhead.map(element=>{
                       if(Object.keys(element)[0]===item.payhead){
                           if(item.type==='earnings'){
                            console.log(Object.keys(element)[0],item.payhead,item.type,element[Object.keys(element)[0]]);
                            tempAmountArray.push((Number(element[Object.keys(element)[0]])))
                           }else{
                            console.log(Object.keys(element)[0],item.payhead,item.type,element[Object.keys(element)[0]]);
                            tempAmountArray.push(-(Number(element[Object.keys(element)[0]])))
                           }

                       }
                    })
                })
            }
        }).catch(err=>console.log(err))
     },0)


    setTimeout(()=>{
       tempAmountArray.map(amount=>{
            netAmount += amount
        })
        req.tempAmountArray = tempAmountArray;
        req.netAmount = netAmount;
        next();
    },100)

}