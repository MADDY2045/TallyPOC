const express = require('express');
const router = express.Router();
var dateFormat = require('dateformat');
const PayHeadMaster = require('../models/PayrollPayheads');
const EmployeeSalaryMaster = require('../models/EmployeeSalaryDetails');

var { payrolltallytemplate } = require('../helpers/payrolltemplatejson');



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


 router.post('/createemployeesalary',getnetamount,(req,res)=>{
     try{

        const { name,role,id,payhead,date,transactiontype,account,instrumentnumber,instrumentdate,ifsc,txntypeflag } = req.body.data;
        const formatteddate = dateFormat(date,"yyyy-mm-dd");

        EmployeeSalaryMaster.find({id}).exec().then(docs=>{
            if(docs.length>0){
                    console.log("id already exists!!!");
            }else{
                let netpay = req.netAmount;
                const newSalaryData = new EmployeeSalaryMaster({account,date:formatteddate,id,ifsc,instrumentdate,instrumentnumber,name,payhead,role,transactiontype,netpay });
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


router.get('/getallemployeesalarydetails',(req,res)=>{
    EmployeeSalaryMaster.find().exec().then(result=>{
        if(result.length>0){
            res.send(result);

        }
    }).catch(err=>console.log(err))
})

function getnetamount(req,res,next){
    let tempAmountArray = [];
    let netAmount = 0;
    let { payhead } = req.body.data;
    setTimeout(()=>{
        PayHeadMaster.find().exec().then(response=>{
            if(response){
                response.map(item=>{
                   payhead.map(element=>{
                       if(Object.keys(element)[0]===item.payhead){
                           if(item.type==='earnings'){
                            tempAmountArray.push((Number(element[Object.keys(element)[0]])))
                           }else{
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
module.exports=router;