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

router.get('/approvesalary/:id',createmaster,(req,res)=>{
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


module.exports = router;