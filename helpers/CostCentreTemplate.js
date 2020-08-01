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
                        "_NAME":"Final Test",
                        "GUID":null,
                        "PARENT":null,
                        "CATEGORY":"example",
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
                                "NAME":"Final Test"
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
                            "_NAME":"example",
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
                                    "NAME":"example"
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

  var { costcategory,costcentre }= module.exports;