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
    "SVCURRENTCOMPANY": "Main"
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
    "DATE": "20190501",
    "GUID": "0bbd5096-36a4-4111-a30b-ffd161b46c91-00000531",
    "VOUCHERTYPENAME": "Payroll",
    "VOUCHERNUMBER": "3",
    "PARTYLEDGERNAME": "Hdfc Bank Ltd",
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
    "EFFECTIVEDATE": "20190501",
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
            "CATEGORY": "Others",
            "EMPLOYEEENTRIES.LIST": []
            }

    ],
    "PAYROLLMODEOFPAYMENT.LIST": [],
    "ATTDRECORDS.LIST": [],
    "GSTEWAYCONSIGNORADDRESS.LIST": [],
    "GSTEWAYCONSIGNEEADDRESS.LIST": [],
    "TEMPGSTRATEDETAILS.LIST": [],
    "_REMOTEID": "0bbd5096-36a4-4111-a30b-ffd161b46c91-00000531",
    "_VCHKEY": "0bbd5096-36a4-4111-a30b-ffd161b46c91-0000aa41:00000018",
    "_VCHTYPE": "Payroll",
    "_ACTION": "Create",
    "_OBJVIEW": "PaySlip Voucher View"
    },
    "_xmlns:UDF": "TallyUDF"
    },
    {
    "COMPANY": {
    "REMOTECMPINFO.LIST": [
        {
    "NAME": "0bbd5096-36a4-4111-a30b-ffd161b46c91",
    "REMOTECMPNAME": "Main",
    "REMOTECMPSTATE": "Tamil Nadu",
    "_MERGE": "Yes"
    }
]
    },
    "_xmlns:UDF": "TallyUDF"
    }
    ]
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
    "EMPLOYEESORTORDER": "1",
    "AMOUNT": "-4000",
    "PAYHEADALLOCATIONS.LIST":[
        {
            "PAYHEADNAME": "",
            "ISDEEMEDPOSITIVE": "",
            "PAYHEADSORTORDER": "",
            "AMOUNT": ""
        }
    ]
    }


 var bankallocationslist = {
    "DATE":"20190501",
    "INSTRUMENTDATE":"20190501",
    "NAME":"e79fa682-b254-404b-b019-e0ce428a3ae0",
    "TRANSACTIONTYPE":"Same Bank Transfer",
    "IFSCODE":"HDFC0000847",
    "BANKNAME":"Axis",
    "ACCOUNTNUMBER":"977878787878787",
    "PAYMENTFAVOURING":"M Prasad",
    "UNIQUEREFERENCENUMBER":"4A5OAXXXenSOq7Bs",
    "STATUS":"No",
    "PAYMENTMODE":"Transacted",
    "BANKEMPLOYEENAME":"M Prasad",
    "ISCONNECTEDPAYMENT":"No",
    "ISSPLIT":"No",
    "ISCONTRACTUSED":"No",
    "ISACCEPTEDWITHWARNING":"No",
    "ISTRANSFORCED":"No",
    "AMOUNT":"4000",
    "CONTRACTDETAILS.LIST":[],
    "BANKSTATUSINFO.LIST":[]
 }

    module.exports = { payrolltallytemplate,payheadentrylist,ledgerentrieslist,bankallocationslist };