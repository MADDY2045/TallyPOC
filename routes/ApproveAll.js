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

router.get("/approvepayrollbatch",(req,res)=>{
    console.log("entered approve all");
    EmployeeSalaryMaster.find().exec().then(result=>{
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
        console.log('payrollbatchnetamount',payrollbatchnetamount);
        console.log('bulkempsalary',bulkempsalary);

    }).catch(err=>console.log(err));
    res.send("received your request");
});

module.exports = router;