var costcentre = {
	"ENVELOPE": {
		"HEADER": {
			"TALLYREQUEST": "Import Data"
		},
		"BODY": {
			"IMPORTDATA": {
				"REQUESTDESC": {
					"REPORTNAME": "All Masters"
				},
				"REQUESTDATA": {
					"TALLYMESSAGE": {
					"COSTCENTRE":{
                        "_NAME":"",
                        "GUID":null,
                        "PARENT":null,
                        "CATEGORY":"",
                        "REVENUELEDFOROPBAL":null,
                        "ISUPDATINGTARGETID":null,
                        "ASORIGINAL":null,
                        "AFFECTSTOCK":null,
                        "FORPAYROLL":null,
                        "FORJOBCOSTING":null,
                        "ISEMPLOYEEGROUP":null,
                        "SORTPOSITION":null,
                        "ALTERID":null,
                        "LANGUAGENAME.LIST":{
                            "NAME.LIST":{
                                "_TYPE":"String",
                                "NAME":""
                                        },
                        "LANGUAGEID":1033
                                            },
                    "PAYMENTDETAILS.LIST":[],
                    "EMPLOYEEPERIOD.LIST":[],
                    "ITDEDUCTIONDETAILS.LIST":[],
                    "ITDECLARATIONDETAILS.LIST":[],
                    "ITOVERRIDEDETAILS.LIST":[],
                    "ITPREVEMPLYRDETAILS.LIST":[],
                    "ITOPENINGBALDETAILS.LIST":[],
                    },
						"_xmlns:UDF": "TallyUDF"
					}
				}
			}
		}
	}
}


  var costcategory = {
            "ENVELOPE": {
            "HEADER": {
                "TALLYREQUEST": "Import Data"
                     },
            "BODY": {
                "IMPORTDATA": {
                    "REQUESTDESC": {
                        "REPORTNAME": "All Masters"
                    },
                    "REQUESTDATA": {
                        "TALLYMESSAGE": {
                            "COSTCATEGORY": {
                            "_NAME":"",
                            "GUID":null,
                            "ISUPDATINGTARGETID":null,
                            "ASORIGINAL":"Yes",
                            "AFFECTSTOCK":null,
                            "ALLOCATEREVENUE":"Yes",
                            "ALLOCATENONREVENUE":"Yes",
                            "ALTERID":null,
                            "LANGUAGENAME.LIST":{
                                "NAME.LIST":{
                                    "_TYPE":"String",
                                    "NAME":""
                                },
                                "LANGUAGEID":1033
                            },
                            "_xmlns:UDF": "TallyUDF"
                        }
                    }
                }
            }
        }
    }
}

   module.exports = { costcategory,costcentre }