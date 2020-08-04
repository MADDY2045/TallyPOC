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

router.get("/approvepayrollbatch",createmaster,async (req,res)=>{
    // console.log("entered approve all");
    await EmployeeSalaryMaster.find().exec().then(result=>{
        let bulkempsalary = [];
        if(result.length>0){
           result.map(item=>{
               if(item.approved===false){
                bulkempsalary.push(item);
               }else{
                   console.log("no items for approval");
               }

            })
        }
        res.send(bulkempsalary);
    }).catch(err=>console.log(err));

});

router.post("/approveallpayroll", (req,res)=>{
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
                      EmployeeSalaryMaster.find().then(result=>{
                        let reponseobj = {}
                          if(result.length>0){
                              console.log('tally response',jsonstring["RESPONSE"]["LASTVCHID"]);
                              result.map(item=>{
                                item.approved = true;
                                item.cancelflag = true;
                                item.tallyid = jsonstring["RESPONSE"]["LASTVCHID"];
                                  item.save().then(response=>{
                                      console.log(response)
                                      reponseobj["message"]="success";
                                      reponseobj["tallyid"]=item.tallyid;
                                      reponseobj["date"]=item.date;
                                      reponseobj["vouchertype"]=item.vouchertype;
                                      res.send(reponseobj);
                                  }).catch(err=>{
                                      console.log(err);
                                  })
                              })

                          }
                      }).catch(err=>console.log(err))

                  }else{

                  }
              }
          })
      }).catch(err=>console.log(err));
      }catch(error){
          console.log(error);
      }

});



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