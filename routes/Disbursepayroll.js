const express = require('express');
const router = express.Router();
const axios = require('axios');
var { parseString } = require('xml2js');
const TallyMaster = require('../models/TallyTransaction');
var dateFormat = require('dateformat');
var X2JS = require('x2js');
const PayHeadMaster = require('../models/PayrollPayheads');
const EmployeeSalaryMaster = require('../models/EmployeeSalaryDetails');
const { v4: uuidv4 } = require('uuid');

var { ledgercreator } = require('../helpers/LedgerCreationTemplate');
var { costcategory,costcentre } = require('../helpers/CostCentreTemplate');

var { payrolltallytemplate,payheadentrylist,ledgerentrieslist,bankallocationslist,individualpayhead,companyname,date,partyledgername,ledgerentryarray,categoryentrylistarray,category,employeeentrieslist,remoteid,employeeentrieslistamount,payheadallocationslist } = require('../helpers/payrolltemplatejson');

router.get('/approvesalary/:id',cleantemplates,createmaster,getEmployeesalary,async(req,res)=>{
    let x2js = new X2JS();
    const xmlstring = await x2js.js2xml(payrolltallytemplate);
    console.log(xmlstring);
    axios({url:'http://localhost:9000',method:'POST',headers:{ContentType: 'text/xml',charset:'UTF-8'},data:xmlstring})
    .then(response=>{
        const jsonstring = x2js.xml2js(response.data);
        parseString(response.data,(issue,result)=>{
            if(!issue){

                if(result["RESPONSE"]["ALTERED"][0]!=='0' || result["RESPONSE"]["COMBINED"][0]!=='0' || result["RESPONSE"]["CREATED"][0]!=='0'){
                    EmployeeSalaryMaster.find({id:req.params.id}).then(result=>{
                        if(result.length>0){
                            console.log('tally response',jsonstring["RESPONSE"]["LASTVCHID"]);
                          result[0].approved = true;
                          result[0].cancelflag = false;
                          result[0].tallyid = jsonstring["RESPONSE"]["LASTVCHID"];
                            result[0].save().then(response=>{
                                //console.log(response)
                                res.send("success");
                            }).catch(err=>{
                                console.log(err);
                            })
                        }
                    }).catch(err=>console.log(err))

                }else{
                    res.send(result["RESPONSE"]["LINEERROR"][0]);
                }
            }
        })

    }).catch(err=>console.log(err));
})


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
         payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["CATEGORYENTRY.LIST"][0]["CATEGORY"] = "Others";
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
    // console.log('temparray is',tempArray);
    return tempArray;
}



function createmaster(req,res,next){
    console.log(req.params.id);
    EmployeeSalaryMaster.find({id:req.params.id}).then(response=>{
        if(response.length>0){
            // console.log(response);
            if(response[0].transactiontype || response[0].name ){

                    if(response[0].transactiontype==='Cash'){
                        ledgercreator["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDESC"]["STATICVARIABLES"]["SVCURRENTCOMPANY"]="Main"
                        ledgercreator["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["LEDGER"]["MAILINGNAME.LIST"]["MAILINGNAME"]=response[0].transactiontype
                        ledgercreator["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["LEDGER"]["NAME.LIST"]["NAME"]=response[0].transactiontype
                        ledgercreator["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["LEDGER"]["PARENT"]="Cash-in-Hand"
                        ledgercreator["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["LEDGER"]["_NAME"]=response[0].transactiontype;
                    }else{
                        ledgercreator["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDESC"]["STATICVARIABLES"]["SVCURRENTCOMPANY"]="Main"
                        ledgercreator["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["LEDGER"]["MAILINGNAME.LIST"]["MAILINGNAME"]=response[0].transactiontype
                        ledgercreator["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["LEDGER"]["NAME.LIST"]["NAME"]=response[0].transactiontype
                        ledgercreator["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["LEDGER"]["PARENT"]="Bank Accounts"
                        ledgercreator["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["LEDGER"]["_NAME"]=response[0].transactiontype;
                    }

                    let x2js = new X2JS();
                    const xmlstring = x2js.js2xml(ledgercreator);
                    axios({url:'http://localhost:9000',method:'POST',headers:{ContentType: 'text/xml',charset:'UTF-8'},data:xmlstring})
                        .then(response=>{
                            if(response.data){
                                parseString(response.data,(issue,result)=>{
                                    if(!issue){
                                        // console.log(result);
                                    }
                                })
                            }
                        }).catch(err=>console.log(err));

                    costcategory["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["COSTCATEGORY"]["_NAME"]="Others";
                    costcategory["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["COSTCATEGORY"]["LANGUAGENAME.LIST"]["NAME.LIST"]["NAME"]="Others"
                    const xmlstringcostcategory = x2js.js2xml(costcategory);
                    axios({url:'http://localhost:9000',method:'POST',headers:{ContentType: 'text/xml',charset:'UTF-8'},data:xmlstringcostcategory})
                        .then(response=>{
                            if(response.data){
                                parseString(response.data,(issue,result)=>{
                                    if(!issue){
                                    //    console.log(result);
                                    }
                                })
                            }
                        }).catch(err=>console.log(err));

                  costcentre["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["COSTCENTRE"]["CATEGORY"]="Others";

                  costcentre["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["COSTCENTRE"]["FORPAYROLL"]="Yes"
                  costcentre["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["COSTCENTRE"]["ISEMPLOYEEGROUP"]="No"
                  costcentre["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["COSTCENTRE"]["LANGUAGENAME.LIST"]["NAME.LIST"]["NAME"]=response[0].name;
                  costcentre["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["COSTCENTRE"]["_NAME"]=response[0].name;

                  const xmlstringcostcentre = x2js.js2xml(costcentre);
                    axios({url:'http://localhost:9000',method:'POST',headers:{ContentType: 'text/xml',charset:'UTF-8'},data:xmlstringcostcentre})
                        .then(response=>{
                            if(response.data){
                                parseString(response.data,(issue,result)=>{
                                    if(!issue){
                                       console.log(result);
                                    }
                                })
                            }
                        }).catch(err=>console.log(err));
            }
        }
       next();
    }).catch(err=>console.log(err));

}

function cleantemplates(req,res,next){
    companyname = "";
    date="";
    partyledgername='';
    remoteid="";
    ledgerentryarray=[];
    ledgerentrieslist["LEDGERNAME"]="";
    ledgerentrieslist["AMOUNT"]="";
    employeeentrieslistamount='';
    payheadallocationslist=[];
    tempArray=[]
    payheadentrylist["PAYHEADALLOCATIONS.LIST"]=[];
    next();
}
module.exports = router;