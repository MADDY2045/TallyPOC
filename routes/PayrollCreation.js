const express = require('express');
const path = require('path');
const router = express.Router();
const axios = require('axios');
var { parseString } = require('xml2js');
const TallyMaster = require('../models/TallyTransaction');
var dateFormat = require('dateformat');
var template = require('../helpers/payrollxml');
var X2JS = require('x2js');
var DomParser = require('dom-parser');
const PayHeadMaster = require('../models/PayrollPayheads');
const EmployeeSalaryMaster = require('../models/EmployeeSalaryDetails');
const { v4: uuidv4 } = require('uuid');

var { payrolltallytemplate,payheadentrylist,ledgerentrieslist,bankallocationslist,individualpayhead } = require('../helpers/payrolltemplatejson');
const {response}=require('express');

var companyname = payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDESC"]["STATICVARIABLES"]["SVCURRENTCOMPANY"];
var date = payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["DATE"];
var partyledgername = payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]
["PARTYLEDGERNAME"];
var ledgerentryarray = payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["LEDGERENTRIES.LIST"];
var categoryentrylistarray = payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["CATEGORYENTRY.LIST"];
var category = payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["CATEGORYENTRY.LIST"][0]["CATEGORY"];
var employeeentrieslist = payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["CATEGORYENTRY.LIST"][0]["EMPLOYEEENTRIES.LIST"];




router.get('/getpayrolldetails',(req,res)=>{

    res.send(payrolltallytemplate)

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

router.get('/approvesalary/:id',cleantemplates,getEmployeesalary,async(req,res)=>{
    let x2js = new X2JS();
    const xmlstring = await x2js.js2xml(payrolltallytemplate);
    axios({url:'http://localhost:9000',method:'POST',headers:{ContentType: 'text/xml',charset:'UTF-8'},data:xmlstring})
    .then(response=>{
        console.log(response.data)
        parseString(response.data,(issue,result)=>{
            if(!issue){

                if(result["RESPONSE"]["ALTERED"][0]!=='0' || result["RESPONSE"]["ALTERED"][0]!=='0' || result["RESPONSE"]["CREATED"][0]!=='0'){
                    EmployeeSalaryMaster.find({id:req.params.id}).then(result=>{
                        if(result.length>0){
                            console.log(result[0].approved);
                            result[0].approved = true;
                            result[0].save().then(response=>{
                                console.log(response)
                            }).catch(err=>{
                                console.log(err);
                            })
                        }
                    }).catch(err=>console.log(err))
                    res.send("success");
                }else{
                    res.send(result["RESPONSE"]["LINEERROR"][0]);
                }
            }
        })

    }).catch(err=>console.log(err));


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

async function getEmployeesalary (req,res,next){
    let employeesortorder = 0;
    let tempobj={}
    try{
        tempobj= await EmployeeSalaryMaster.find({id:req.params.id}).exec().then(response=>{
        if(response.length>0){
           req.employeesalarydetail = response[0];
            return response[0]
        }}).catch(err=>console.log(err))

        payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDESC"]["STATICVARIABLES"]["SVCURRENTCOMPANY"] = "Main";
        const formatteddate = dateFormat(tempobj.date,"yyyymmdd");
        payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["DATE"]=formatteddate;
        payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["PARTYLEDGERNAME"]=tempobj.transactiontype;
        payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["_REMOTEID"]=uuidv4();
        if(payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["LEDGERENTRIES.LIST"].length===0){
            if(tempobj.transactiontype==='Cash'){
                ledgerentrieslist["LEDGERNAME"]=tempobj.transactiontype;
                ledgerentrieslist["AMOUNT"]=tempobj.netpay;
                payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["LEDGERENTRIES.LIST"].push(ledgerentrieslist);
            }else{
                /*bank allocation */
                ledgerentrieslist["LEDGERNAME"]=tempobj.transactiontype;
                ledgerentrieslist["AMOUNT"]=tempobj.netpay;
                payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["LEDGERENTRIES.LIST"].push(ledgerentrieslist);
                bankallocationslist["DATE"]=formatteddate;
                bankallocationslist["INSTRUMENTDATE"]=tempobj.instrumentdate;
                bankallocationslist["IFSCODE"]=tempobj.ifsc;
                bankallocationslist["ACCOUNTNUMBER"]=tempobj.account;
                bankallocationslist["PAYMENTFAVOURING"]=tempobj.name;
                bankallocationslist["AMOUNT"]=tempobj.netpay;
                payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["LEDGERENTRIES.LIST"][0]["BANKALLOCATIONS.LIST"].push(bankallocationslist);
                //console.log(tempobj)
            }
        }


         employeesortorder += 1;
        if(employeeentrieslist.length===0){
            employeeentrieslist.push(payheadentrylist);
        }
        employeeentrieslist[0]["EMPLOYEENAME"]=tempobj.name;
        employeeentrieslist[0]["EMPLOYEESORTORDER"]=employeesortorder;
        employeeentrieslist[0]["AMOUNT"]=-tempobj.netpay;

            let result=[];
            let sortorder =0;
            tempobj.payhead.map(item=>{
                sortorder +=1;
                result=getpayheaddetails(item,tempobj);
            })

            result.map(item=>{
               if(payheadentrylist["PAYHEADALLOCATIONS.LIST"].length < tempobj.payhead.length){
                   payheadentrylist["PAYHEADALLOCATIONS.LIST"].push(item);
                }
            })
            next();
    }catch(error){console.log(error)}
}



let tempArray=[];
let sortnumber = 0;
function getpayheaddetails(item,response){
    let tempobj={}
    if(Object.keys(item)[0]==='Basic Pay' || Object.keys(item)[0]==='DA' || Object.keys(item)[0]==='HRA' || Object.keys(item)[0]==='TA' || Object.keys(item)[0]==='Medical Allowance'){
        sortnumber += 1;
        tempobj["PAYHEADNAME"]=Object.keys(item)[0];
        tempobj["ISDEEMEDPOSITIVE"]="Yes";
        tempobj["PAYHEADSORTORDER"]=sortnumber;
        tempobj["AMOUNT"]=-Object.values(item)[0];

        tempArray.push(tempobj);
    }else{
        sortnumber += 1;
        tempobj["PAYHEADNAME"]=Object.keys(item)[0];
        tempobj["ISDEEMEDPOSITIVE"]="No";
        tempobj["PAYHEADSORTORDER"]=sortnumber;
        tempobj["AMOUNT"]=Object.values(item)[0];

        tempArray.push(tempobj);
    }
    return tempArray;
}


function cleantemplates(req,res,next){
    payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDESC"]["STATICVARIABLES"]["SVCURRENTCOMPANY"] = "";
    payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["DATE"]="";
    payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["PARTYLEDGERNAME"]='';
    payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["_REMOTEID"]="";
    payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["LEDGERENTRIES.LIST"]=[];
    ledgerentrieslist["LEDGERNAME"]="";
    ledgerentrieslist["AMOUNT"]="";
    payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["CATEGORYENTRY.LIST"][0]["EMPLOYEEENTRIES.LIST"]["AMOUNT"]='';
    payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["CATEGORYENTRY.LIST"][0]["EMPLOYEEENTRIES.LIST"]["PAYHEADALLOCATIONS.LIST"]=[];
    tempArray=[]
    payheadentrylist["PAYHEADALLOCATIONS.LIST"]=[];
    next();
}
module.exports=router;