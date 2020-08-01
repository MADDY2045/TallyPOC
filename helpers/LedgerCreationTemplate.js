var ledgercreator = {
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
					"TALLYMESSAGE": {
						"LEDGER": {
							"MAILINGNAME.LIST": {
								"MAILINGNAME": "Hdfc Bank Ltd",
								"_TYPE": "String"
							},
							"PARENT": "Bank Accounts",
							"NAME.LIST": {
								"NAME": "HDFC BANK Ltd",
								"_TYPE": "String"
							},
							"_NAME": "HDFC BANK Ltd",
							"_RESERVEDNAME": ""
						},
						"_xmlns:UDF": "TallyUDF"
					}
				}
			}
		}
	}
}

module.exports = { ledgercreator };