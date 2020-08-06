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
var { costcategory,costcentre} = require('../helpers/CostCentreTemplate');
var { attendance } = require('../helpers/Attendance');

router.get('/approvesalary/:id',createmaster,createattendance,(req,res)=>{
    try{
        EmployeeSalaryMaster.find({id:req.params.id}).exec().then(result=>{
            if(result.length>0){
                console.log(result);
                res.send(result);
            }
        }).catch(err=>console.log(err));
    }catch(error){
        console.log(error);
    }
})

router.post('/getapprovalresponse/:id',(req,res)=>{
    try{
      // console.log(req.body.data);
       axios({url:'http://localhost:9000',method:'POST',headers:{ContentType: 'text/xml',charset:'UTF-8'},data:req.body.data})
    .then(response=>{
        let x2js = new X2JS();
        const jsonstring = x2js.xml2js(response.data);
        parseString(response.data,(issue,result)=>{
            if(!issue){
                console.log('result is ',result)
                if(result["RESPONSE"]["ALTERED"][0]!=='0' || result["RESPONSE"]["COMBINED"][0]!=='0' || result["RESPONSE"]["CREATED"][0]!=='0'){
                    EmployeeSalaryMaster.find({id:req.params.id}).then(result=>{

                        if(result.length>0){
                            console.log('tally response',jsonstring["RESPONSE"]["LASTVCHID"]);
                          result[0].approved = true;
                          result[0].cancelflag = false;
                          result[0].tallyid = jsonstring["RESPONSE"]["LASTVCHID"];
                            result[0].save().then(response=>{
                                console.log(response)
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
    }catch(error){
        console.log(error);
    }
})


function createmaster(req,res,next){
    console.log(req.params.id);
    EmployeeSalaryMaster.find({id:req.params.id}).then(response=>{
        if(response.length>0){
            // console.log(response);
            if(response[0].transactiontype || response[0].name ){
                req.body = response;
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
                                       //console.log(result);
                                    }
                                })
                            }
                        }).catch(err=>console.log(err));
            }
        }

       next();
    }).catch(err=>console.log(err));

}

function createattendance(req,res,next){
    let tempobj={}
    let templeave={}
    let tempovertime={}
    attendance["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["VOUCHER"]["ATTENDANCEENTRIES.LIST"]=[];
    attendance["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["VOUCHER"]["EFFECTIVEDATE"]='';
    attendance["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["VOUCHER"]["DATE"]='';
    attendance["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["VOUCHER"]["_REMOTEID"]='';
if(req.body[0].present !== 0 ){
    console.log("entered attendance");
    console.log(req.body);
    attendance["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["VOUCHER"]["EFFECTIVEDATE"]=dateFormat(req.body[0].date,"yyyymmdd");
    attendance["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["VOUCHER"]["DATE"]=dateFormat(req.body[0].date,"yyyymmdd");
    attendance["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["VOUCHER"]["_REMOTEID"]=uuidv4();
    tempobj["NAME"] = req.body[0].name;
    tempobj["ATTENDANCETYPE"] = "Present";
    tempobj["ATTDTYPETIMEVALUE"] = ` ${req.body[0].present}`;
    tempobj["NAME"] = req.body[0].name;
    attendance["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["VOUCHER"]["ATTENDANCEENTRIES.LIST"].push(tempobj)
    if(req.body[0].leave!== 0){
        templeave["NAME"] = req.body[0].name;
        templeave["ATTENDANCETYPE"] = "Leave";
        templeave["ATTDTYPETIMEVALUE"] = ` ${req.body[0].leave}`;
        templeave["NAME"] = req.body[0].name;
        attendance["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["VOUCHER"]["ATTENDANCEENTRIES.LIST"].push(templeave)
    }
    if(req.body[0].overtime!== 0){
        tempovertime["NAME"] = req.body[0].name;
        tempovertime["ATTENDANCETYPE"] = "overtime";
        tempovertime["ATTDTYPEVALUE"] = ` ${req.body[0].overtime} hrs`;
        tempovertime["NAME"] = req.body[0].name;
        attendance["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"]["VOUCHER"]["ATTENDANCEENTRIES.LIST"].push(tempovertime)
    }

    let x2js = new X2JS();
    const xmlattendance = x2js.js2xml(attendance);
    console.log(xmlattendance);
    axios({url:'http://localhost:9000',method:'POST',headers:{ContentType: 'text/xml',charset:'UTF-8'},data:xmlattendance})
        .then(response=>{
            if(response.data){
                parseString(response.data,(issue,result)=>{
                    if(!issue){
                       console.log('attendance :::',result);
                    }
                })
            }
        }).catch(err=>console.log(err));
    next()
}else{
    console.log("entered manual");
    next();
}
}
module.exports = router;