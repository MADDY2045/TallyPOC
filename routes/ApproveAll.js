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

router.get("/approvepayrollbatch",cleantemplates,createmaster,async(req,res)=>{
    // console.log("entered approve all");
    await EmployeeSalaryMaster.find().exec().then(result=>{
        let payrollbatchnetamount = 0;
        let bulkempsalary = [];
        if(result.length>0){
           result.map(item=>{
               if(item.approved===false){
                payrollbatchnetamount += item.netpay;
                bulkempsalary.push(item);
               }else{
                   console.log("no items for approval");
               }

            })
        }
        if(bulkempsalary.length>0){
            payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["LEDGERENTRIES.LIST"]=[];
            payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["CATEGORYENTRY.LIST"][0]["EMPLOYEEENTRIES.LIST"]=[];
            payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDESC"]["STATICVARIABLES"]["SVCURRENTCOMPANY"] = "Main";
            if(bulkempsalary && bulkempsalary[0] && bulkempsalary[0].date){
                const formatteddate = dateFormat(bulkempsalary[0].date,"yyyymmdd");
                payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["DATE"]=formatteddate;
            }
            payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["_REMOTEID"]=uuidv4();



               const filteredArray = bulkempsalary.filter(item=>item.transactiontype!=='Cash');

               if(filteredArray.length > 0){

                if(payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["LEDGERENTRIES.LIST"].length===0){
                payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["PARTYLEDGERNAME"]=filteredArray[0].transactiontype;
                ledgerentrieslist["LEDGERNAME"]=filteredArray[0].transactiontype;
                ledgerentrieslist["AMOUNT"]=payrollbatchnetamount
                const formatteddate = dateFormat(filteredArray[0].date,"yyyymmdd");
                bankallocationslist["DATE"]=formatteddate;
                bankallocationslist["INSTRUMENTDATE"]=filteredArray[0].instrumentdate;
                bankallocationslist["IFSCODE"]=filteredArray[0].ifsc;
                bankallocationslist["ACCOUNTNUMBER"]=filteredArray[0].account;
                bankallocationslist["PAYMENTFAVOURING"]=filteredArray[0].name;
                bankallocationslist["AMOUNT"]=payrollbatchnetamount;
                payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["LEDGERENTRIES.LIST"].push(ledgerentrieslist);
                payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["LEDGERENTRIES.LIST"][0]["BANKALLOCATIONS.LIST"].push(bankallocationslist);
                }
            }
               else
               {
                   if(payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["LEDGERENTRIES.LIST"].length===0){
                    console.log("entered else also");
                    if(bulkempsalary && bulkempsalary[0] && bulkempsalary[0].transactiontype){
                        ledgerentrieslist["LEDGERNAME"]=bulkempsalary[0].transactiontype;
                        payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["PARTYLEDGERNAME"]=bulkempsalary[0].transactiontype;
                        ledgerentrieslist["AMOUNT"]=payrollbatchnetamount;
                        payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["LEDGERENTRIES.LIST"].push(ledgerentrieslist);
                    }
                }
               }
               payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["CATEGORYENTRY.LIST"][0]["CATEGORY"] = "Others";
            bulkempsalary.map(employee=>{
                const result = getemployeeslist(employee);
                if(payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["CATEGORYENTRY.LIST"][0]["EMPLOYEEENTRIES.LIST"].length<bulkempsalary.length){
                    payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["CATEGORYENTRY.LIST"][0]["EMPLOYEEENTRIES.LIST"].push(result);
                }
            })

            let x2js = new X2JS();
        const payrollbatchxmlstring = x2js.js2xml(payrolltallytemplate);
        let responsetallyid = '';
        let responsedate = '';
        //console.log(payrollbatchxmlstring);
        axios({url:'http://localhost:9000',method:'POST',headers:{ContentType: 'text/xml',charset:'UTF-8'},data:payrollbatchxmlstring})
        .then(response=>{
                if(response.data){
                    const jsonstring = x2js.xml2js(response.data);
            parseString(response.data,(issue,result)=>{
                if(!issue){

                    if(result["RESPONSE"]["ALTERED"][0]!=='0' || result["RESPONSE"]["COMBINED"][0]!=='0' || result["RESPONSE"]["CREATED"][0]!=='0'){
                        EmployeeSalaryMaster.find().then(result=>{
                            if(result.length>0){
                                console.log('tally response',jsonstring["RESPONSE"]["LASTVCHID"]);
                                result.map(eachflag=>{
                                    eachflag.approved = true;
                                    eachflag.cancelflag = true;
                                    eachflag.tallyid = jsonstring["RESPONSE"]["LASTVCHID"];
                                    responsetallyid=jsonstring["RESPONSE"]["LASTVCHID"];
                                    responsedate = eachflag.date;
                                    eachflag.save().then(response=>{
                                        //console.log(response)
                                    }).catch(err=>{
                                        console.log(err);
                                    })
                                })
                            }
                            return res.send({tallyid:responsetallyid,message:"success",date:responsedate});
                        }).catch(err=>console.log(err))

                    }else{
                        //res.send(result["RESPONSE"]["LINEERROR"][0]);
                    }
                }
            })
                }
        }).catch(err=>console.log(err))
        }


    }).catch(err=>console.log(err));

});

let employeesortorder = 0;

function getemployeeslist(employee){
    //console.log(employee.payhead.length);
    employeesortorder += 1;
    let tempobj = {}
    tempobj["EMPLOYEENAME"]=employee.name;
    tempobj["EMPLOYEESORTORDER"]=employeesortorder;
    tempobj["AMOUNT"]=-employee.netpay;
    tempobj["PAYHEADALLOCATIONS.LIST"]=[];
    employee.payhead.map(eachpayhead=>{
        const output = getpayhead(eachpayhead);
        //console.log('output is::',output)
            tempobj["PAYHEADALLOCATIONS.LIST"].push(output);
        })
    return tempobj;
}

let sortnumber = 0;
function getpayhead(eachpayhead){
   let tempobj={}
    if(Object.keys(eachpayhead)[0]==='Basic Pay' || Object.keys(eachpayhead)[0]==='DA' || Object.keys(eachpayhead)[0]==='HRA' || Object.keys(eachpayhead)[0]==='TA' || Object.keys(eachpayhead)[0]==='Medical Allowance'){
        sortnumber += 1;
        tempobj["PAYHEADNAME"]=Object.keys(eachpayhead)[0];
        tempobj["ISDEEMEDPOSITIVE"]="Yes";
        tempobj["PAYHEADSORTORDER"]=sortnumber;
        tempobj["AMOUNT"]=-Object.values(eachpayhead)[0];
        return tempobj;

    }else{
        sortnumber += 1;
        tempobj["PAYHEADNAME"]=Object.keys(eachpayhead)[0];
        tempobj["ISDEEMEDPOSITIVE"]="No";
        tempobj["PAYHEADSORTORDER"]=sortnumber;
        tempobj["AMOUNT"]=Object.values(eachpayhead)[0];
        return tempobj;

    }

}

async function cleantemplates(req,res,next){
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



function createmaster(req,res,next){

    EmployeeSalaryMaster.find().then(response=>{
        if(response.length>0){

             response.map(item=>{
               if(item.transactiontype || item.name ){

                    if(item.transactiontype==='Cash'){
                        ledgercreator["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDESC"]["STATICVARIABLES"]["SVCURRENTCOMPANY"]="Main"
                        ledgercreator["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["LEDGER"]["MAILINGNAME.LIST"]["MAILINGNAME"]=item.transactiontype
                        ledgercreator["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["LEDGER"]["NAME.LIST"]["NAME"]=item.transactiontype
                        ledgercreator["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["LEDGER"]["PARENT"]="Cash-in-Hand"
                        ledgercreator["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["LEDGER"]["_NAME"]=item.transactiontype;
                    }else{
                        ledgercreator["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDESC"]["STATICVARIABLES"]["SVCURRENTCOMPANY"]="Main"
                        ledgercreator["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["LEDGER"]["MAILINGNAME.LIST"]["MAILINGNAME"]=item.transactiontype
                        ledgercreator["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["LEDGER"]["NAME.LIST"]["NAME"]=item.transactiontype
                        ledgercreator["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["LEDGER"]["PARENT"]="Bank Accounts"
                        ledgercreator["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["LEDGER"]["_NAME"]=item.transactiontype;
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

                    costcategory["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["COSTCATEGORY"]["_NAME"]=item.role;
                    costcategory["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["COSTCATEGORY"]["LANGUAGENAME.LIST"]["NAME.LIST"]["NAME"]=item.role
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
                  costcentre["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["COSTCENTRE"]["LANGUAGENAME.LIST"]["NAME.LIST"]["NAME"]=item.name;
                  costcentre["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["COSTCENTRE"]["FORPAYROLL"]="Yes"
                  costcentre["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["COSTCENTRE"]["ISEMPLOYEEGROUP"]="No"
                  costcentre["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["COSTCENTRE"]["_NAME"]=item.name;

                  const xmlstringcostcentre = x2js.js2xml(costcentre);
                    axios({url:'http://localhost:9000',method:'POST',headers:{ContentType: 'text/xml',charset:'UTF-8'},data:xmlstringcostcentre})
                        .then(response=>{
                            if(response.data){
                                parseString(response.data,(issue,result)=>{
                                    if(!issue){
                                       //console.log(result);
                                    }
                                })
                            }
                        }).catch(err=>console.log(err));
            }
             })

        }

    }).catch(err=>console.log(err));
    next();
}

module.exports = router;