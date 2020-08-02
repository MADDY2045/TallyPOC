const express = require('express');
const router = express.Router();
const axios = require('axios');
var parseString = require('xml2js').parseString;
const TallyMaster = require('../models/TallyTransaction');
var dateFormat = require('dateformat');

function getTallyData(req,res,next){

    var xmlstring = `<ENVELOPE>
    <HEADER>
    <VERSION>1</VERSION>
    <TALLYREQUEST>EXPORT</TALLYREQUEST>
    <TYPE>DATA</TYPE>
    <ID>Voucher Register</ID>
    </HEADER>
    <BODY>
    <DESC>
    <STATICVARIABLES>
    <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
    </STATICVARIABLES>
    </DESC>
    </BODY>
    </ENVELOPE>`;
    let responseContent = [];
    axios({url:'http://localhost:9000',method:'POST',headers:{ContentType: 'text/xml',charset:'UTF-8'},data:xmlstring})
    .then(response=>{
                    parseString(response.data, (err, result)=>{
                        if(!err){
                            responseContent.push(result);
                            req.body=result;
                            next();
                        }
                    })
                }).catch(err=>console.log(err));

}

router.get("/canceltally/:id/:vouchertype/:date/:vouchernumber",getTallyData, async(req,res)=>{

    req.body.ENVELOPE.BODY[0].DATA[0].TALLYMESSAGE.pop();
    let exportData =  req.body.ENVELOPE.BODY[0].DATA[0].TALLYMESSAGE;

    let tallyid = req.params.id.toString();
    let vouchertype = req.params.vouchertype;
    let date = req.params.date;
    let tallyformatdate = dateFormat(date,"dd-mmmm-yyyy");
    console.log('date :::',tallyformatdate);
    let responseContent = [];


let responsedata = [];

                    exportData.map(item=>{

                        let iterabletallyid = item.VOUCHER[0].MASTERID[0].trim();
                        if(item.VOUCHER[0].ISCANCELLED[0] !=='Yes' && item.VOUCHER[0].$.VCHTYPE === vouchertype && tallyid==iterabletallyid ){
                            let cancelVoucher =`<ENVELOPE>
                            <HEADER>
                                <VERSION>1</VERSION>
                                <TALLYREQUEST>Import</TALLYREQUEST>
                                <TYPE>Data</TYPE>
                                <ID>Vouchers</ID>
                            </HEADER>
                            <BODY>
                                <DESC>
                                <VOUCHERTYPENAME>${vouchertype.toUpperCase()}</VOUCHERTYPENAME>
                                </DESC>
                                <DATA>
                                    <TALLYMESSAGE>
                                    <VOUCHER DATE = "${tallyformatdate}" TAGNAME = "MASTER ID" TAGVALUE=" ${tallyid}" ACTION = "Cancel"  VCHTYPE = "${vouchertype}">
                                        <NARRATION>Cancelled by Madhavan</NARRATION>
                                    </VOUCHER>
                                    </TALLYMESSAGE>
                                </DATA>
                            </BODY>
                        </ENVELOPE>	`

                            axios({url:'http://localhost:9000',method:'POST',headers:{ContentType: 'text/xml',charset:'UTF-8'},data:cancelVoucher})
                            .then(response=>{
                                parseString(response.data, (err, result)=>{
                                                if(!err){
                                                    updateDb(tallyid,vouchertype);
                                                    responsedata.push(result.ENVELOPE.BODY[0].DATA[0].IMPORTRESULT[0]);
                                                    res.status(200).send(responsedata);
                                                }
                                            })
                                        }).catch(err=>{console.log(err)

                                        });

                        }else{

                        }

                    })
                })


router.put('/cancelgsdata/:id/:vouchertype',(req,res)=>{
                    console.log("entered route ",req.params.id,req.params.vouchertype);
                    TallyMaster.find({tallyid:req.params.id,vouchertype:req.params.vouchertype}).then(result=>{
                        try{
                            console.log('result is ',result);
                            if(result){
                                result[0].cancelflag=true;
                                result[0].save().then(response=>{
                                   console.log(response)
                               }).catch(err=>{
                                   console.log("error same here",err);
                               })
                            }
                        }catch(error){console.log('error',error)}

                    }).catch(err=>console.log("error here",err))
                })


function updateDb(tallyid,vouchertype){
    console.log(tallyid,vouchertype);
    axios.put(`http://localhost:5050/cancelgsdata/${tallyid}/${vouchertype}`).then(response=>{
        console.log(response.data);
    }).catch(err=>{console.log(err)})
}


module.exports = router;