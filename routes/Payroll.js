const express = require('express');
const path = require('path');
const router = express.Router();
const axios = require('axios');
var { parseString } = require('xml2js');
const TallyMaster = require('../models/TallyTransaction');
var dateFormat = require('dateformat');
var template = require('../helpers/payrollxml');
// var X2JS = require('x2js');
var { payrolltallytemplate,payheadentrylist,ledgerentrieslist } = require('../helpers/payrolltemplatejson');

let payheaditeratingarray = payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]['CATEGORYENTRY.LIST'][0]['EMPLOYEEENTRIES.LIST'][0]['PAYHEADALLOCATIONS.LIST']


router.get('/getpayrolldetails',(req,res)=>{
    payheadentrylist["PAYHEADNAME"]="Basic Pay";
    payheadentrylist["ISDEEMEDPOSITIVE"]="Yes";
    payheadentrylist["AMOUNT"]="1000";
    payheadentrylist["PAYHEADSORTORDER"]="1";
    payheaditeratingarray.push(payheadentrylist);
    payheadentrylist["PAYHEADNAME"]="DA";
    payheadentrylist["ISDEEMEDPOSITIVE"]="Yes";
    payheadentrylist["AMOUNT"]="100";
    payheadentrylist["PAYHEADSORTORDER"]="2";
    payheaditeratingarray.push(payheadentrylist);

    console.log( payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]['CATEGORYENTRY.LIST'][0]['EMPLOYEEENTRIES.LIST'][0]['PAYHEADALLOCATIONS.LIST'])


res.send(payheadentrylist)
   })

module.exports=router;

