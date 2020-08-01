var payrolltallytemplate = {
    "ENVELOPE": {
    "HEADER": {
    "TALLYREQUEST": "Import Data"
    },
    "BODY": {
    "IMPORTDATA": {
    "REQUESTDESC": {
    "REPORTNAME": "All Masters",
    "STATICVARIABLES": {
    "SVCURRENTCOMPANY": ""
    }
    },
    "REQUESTDATA": {
    "TALLYMESSAGE": [
    {
    "VOUCHER": {
    "OLDAUDITENTRYIDS.LIST": [{
            "OLDAUDITENTRYIDS": "-1",
            "_TYPE": "Number"
    }],
    "DATE": "",
    "GUID": "0bbd5096-36a4-4111-a30b-ffd161b46c91-00000531",
    "VOUCHERTYPENAME": "Payroll",
    "VOUCHERNUMBER": "",
    "PARTYLEDGERNAME": "",
    "CSTFORMISSUETYPE": "",
    "CSTFORMRECVTYPE": "",
    "FBTPAYMENTTYPE": "Default",
    "PERSISTEDVIEW": "PaySlip Voucher View",
    "VCHGSTCLASS": "",
    "DIFFACTUALQTY": "No",
    "ISMSTFROMSYNC": "No",
    "ASORIGINAL": "No",
    "AUDITED": "No",
    "FORJOBCOSTING": "No",
    "ISOPTIONAL": "No",
    "EFFECTIVEDATE": "",
    "USEFOREXCISE": "No",
    "ISFORJOBWORKIN": "No",
    "ALLOWCONSUMPTION": "No",
    "USEFORINTEREST": "No",
    "USEFORGAINLOSS": "No",
    "USEFORGODOWNTRANSFER": "No",
    "USEFORCOMPOUND": "No",
    "USEFORSERVICETAX": "No",
    "ISEXCISEVOUCHER": "No",
    "EXCISETAXOVERRIDE": "No",
    "USEFORTAXUNITTRANSFER": "No",
    "IGNOREPOSVALIDATION": "No",
    "EXCISEOPENING": "No",
    "USEFORFINALPRODUCTION": "No",
    "ISTDSOVERRIDDEN": "No",
    "ISTCSOVERRIDDEN": "No",
    "ISTDSTCSCASHVCH": "No",
    "INCLUDEADVPYMTVCH": "No",
    "ISSUBWORKSCONTRACT": "No",
    "ISVATOVERRIDDEN": "No",
    "IGNOREORIGVCHDATE": "No",
    "ISVATPAIDATCUSTOMS": "No",
    "ISDECLAREDTOCUSTOMS": "No",
    "ISSERVICETAXOVERRIDDEN": "No",
    "ISISDVOUCHER": "No",
    "ISEXCISEOVERRIDDEN": "No",
    "ISEXCISESUPPLYVCH": "No",
    "ISGSTOVERRIDDEN": "No",
    "GSTNOTEXPORTED": "No",
    "IGNOREGSTINVALIDATION": "No",
    "ISVATPRINCIPALACCOUNT": "No",
    "ISBOENOTAPPLICABLE": "No",
    "ISSHIPPINGWITHINSTATE": "No",
    "ISOVERSEASTOURISTTRANS": "No",
    "ISDESIGNATEDZONEPARTY": "No",
    "ISCANCELLED": "No",
    "HASCASHFLOW": "Yes",
    "ISPOSTDATED": "No",
    "USETRACKINGNUMBER": "No",
    "ISINVOICE": "No",
    "MFGJOURNAL": "No",
    "HASDISCOUNTS": "No",
    "ASPAYSLIP": "Yes",
    "ISCOSTCENTRE": "No",
    "ISSTXNONREALIZEDVCH": "No",
    "ISEXCISEMANUFACTURERON": "No",
    "ISBLANKCHEQUE": "No",
    "ISVOID": "No",
    "ISONHOLD": "No",
    "ORDERLINESTATUS": "No",
    "VATISAGNSTCANCSALES": "No",
    "VATISPURCEXEMPTED": "No",
    "ISVATRESTAXINVOICE": "No",
    "VATISASSESABLECALCVCH": "No",
    "ISVATDUTYPAID": "Yes",
    "ISDELIVERYSAMEASCONSIGNEE": "No",
    "ISDISPATCHSAMEASCONSIGNOR": "No",
    "ISDELETED": "No",
    "CHANGEVCHMODE": "No",
    "ALTERID": "",
    "MASTERID": "",
    "VOUCHERKEY": "187196149596184",
    "EXCLUDEDTAXATIONS.LIST":[],
    "OLDAUDITENTRIES.LIST": [],
    "ACCOUNTAUDITENTRIES.LIST":[],
    "AUDITENTRIES.LIST":[],
    "DUTYHEADDETAILS.LIST":[],
    "SUPPLEMENTARYDUTYHEADDETAILS.LIST": [],
    "EWAYBILLDETAILS.LIST":[],
    "INVOICEDELNOTES.LIST": [],
    "INVOICEORDERLIST.LIST": [],
    "INVOICEINDENTLIST.LIST":[],
    "ATTENDANCEENTRIES.LIST": [],
    "ORIGINVOICEDETAILS.LIST": [],
    "INVOICEEXPORTLIST.LIST": [],
    "LEDGERENTRIES.LIST":[],
    "CATEGORYENTRY.LIST":[
        {
            "CATEGORY": "",
            "EMPLOYEEENTRIES.LIST": []
            }

    ],
    "PAYROLLMODEOFPAYMENT.LIST": [],
    "ATTDRECORDS.LIST": [],
    "GSTEWAYCONSIGNORADDRESS.LIST": [],
    "GSTEWAYCONSIGNEEADDRESS.LIST": [],
    "TEMPGSTRATEDETAILS.LIST": [],
    "_REMOTEID": "",
    "_VCHKEY": "0bbd5096-36a4-4111-a30b-ffd161b46c91-0000aa41:00000018",
    "_VCHTYPE": "Payroll",
    "_ACTION": "Create",
    "_OBJVIEW": "PaySlip Voucher View"
    },
    "_xmlns:UDF": "TallyUDF"
    }]
    }
    }
    }
    }
    }

var ledgerentrieslist = {
        "OLDAUDITENTRYIDS.LIST":[{
        "OLDAUDITENTRYIDS": "-1",
        "_TYPE": "Number"
        }],
        "LEDGERNAME": "",
        "GSTCLASS": "",
        "ISDEEMEDPOSITIVE": "No",
        "LEDGERFROMITEM": "No",
        "REMOVEZEROENTRIES": "No",
        "ISPARTYLEDGER": "Yes",
        "ISLASTDEEMEDPOSITIVE": "No",
        "ISCAPVATTAXALTERED": "No",
        "ISCAPVATNOTCLAIMED": "No",
        "AMOUNT": "",
        "SERVICETAXDETAILS.LIST": [],
        "BANKALLOCATIONS.LIST": [],
        "BILLALLOCATIONS.LIST": [],
        "INTERESTCOLLECTION.LIST":[],
        "OLDAUDITENTRIES.LIST": [],
        "ACCOUNTAUDITENTRIES.LIST": [],
        "AUDITENTRIES.LIST": [],
        "INPUTCRALLOCS.LIST": [],
        "DUTYHEADDETAILS.LIST": [],
        "EXCISEDUTYHEADDETAILS.LIST": [],
        "RATEDETAILS.LIST": [],
        "SUMMARYALLOCS.LIST": [],
        "STPYMTDETAILS.LIST":[],
        "EXCISEPAYMENTALLOCATIONS.LIST":[],
        "TAXBILLALLOCATIONS.LIST": [],
        "TAXOBJECTALLOCATIONS.LIST":[],
        "TDSEXPENSEALLOCATIONS.LIST":[],
        "VATSTATUTORYDETAILS.LIST": [],
        "REFVOUCHERDETAILS.LIST": [],
        "INVOICEWISEDETAILS.LIST":[],
        "VATITCDETAILS.LIST": [],
        "ADVANCETAXDETAILS.LIST": [],
        }

var payheadentrylist = {
    "EMPLOYEENAME": "",
    "EMPLOYEESORTORDER": "",
    "AMOUNT": "",
    "PAYHEADALLOCATIONS.LIST":[]
    }

var individualpayhead = {
    "PAYHEADNAME": "",
    "ISDEEMEDPOSITIVE": "",
    "PAYHEADSORTORDER": "",
    "AMOUNT": ""
}

 var bankallocationslist = {
    "DATE":"",
    "INSTRUMENTDATE":"",
    "NAME":"e79fa682-b254-404b-b019-e0ce428a3ae0",
    "TRANSACTIONTYPE":"Same Bank Transfer",
    "IFSCODE":"",
    "BANKNAME":"Axis",
    "ACCOUNTNUMBER":"",
    "PAYMENTFAVOURING":"",
    "UNIQUEREFERENCENUMBER":"4A5OAXXXenSOq7Bs",
    "STATUS":"No",
    "PAYMENTMODE":"Transacted",
    "BANKEMPLOYEENAME":"",
    "ISCONNECTEDPAYMENT":"No",
    "ISSPLIT":"No",
    "ISCONTRACTUSED":"No",
    "ISACCEPTEDWITHWARNING":"No",
    "ISTRANSFORCED":"No",
    "AMOUNT":"",
    "CONTRACTDETAILS.LIST":[],
    "BANKSTATUSINFO.LIST":[]
 }


 var companyname = payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDESC"]["STATICVARIABLES"]["SVCURRENTCOMPANY"];

 var date = payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["DATE"];

 var partyledgername = payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]
["PARTYLEDGERNAME"];

 var ledgerentryarray = payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["LEDGERENTRIES.LIST"];

 var categoryentrylistarray = payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["CATEGORYENTRY.LIST"];

 var category = payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["CATEGORYENTRY.LIST"][0]["CATEGORY"];

 var employeeentrieslist = payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["CATEGORYENTRY.LIST"][0]["EMPLOYEEENTRIES.LIST"];

var employeeentrieslistamount = payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["CATEGORYENTRY.LIST"][0]["EMPLOYEEENTRIES.LIST"]["AMOUNT"]
var remoteid = payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["_REMOTEID"];

var payheadallocationslist = payrolltallytemplate["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"][0]["VOUCHER"]["CATEGORYENTRY.LIST"][0]["EMPLOYEEENTRIES.LIST"]["PAYHEADALLOCATIONS.LIST"];

module.exports = { payrolltallytemplate,payheadentrylist,ledgerentrieslist,bankallocationslist,individualpayhead,companyname,date,partyledgername,ledgerentryarray,categoryentrylistarray,category,employeeentrieslist,remoteid,employeeentrieslistamount,payheadallocationslist };