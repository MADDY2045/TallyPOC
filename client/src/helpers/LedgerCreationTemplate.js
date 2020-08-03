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
								"MAILINGNAME": "",
								"_TYPE": "String"
							},
							"PARENT": "Bank Accounts",
							"NAME.LIST": {
								"NAME": "",
								"_TYPE": "String"
							},
							"_NAME": "",
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