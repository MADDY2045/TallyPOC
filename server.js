const express = require('express');
const path = require('path');
const app = express();
const axios = require('axios');
const cors = require('cors');
var parseString = require('xml2js').parseString;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//setup public folder
app.use(express.static('./public'));

const port = 5050;
var xmlstring = '<ENVELOPE><HEADER><TALLYREQUEST>Export Data</TALLYREQUEST></HEADER><BODY><EXPORTDATA><REQUESTDESC><REPORTNAME>Day Book</REPORTNAME><STATICVARIABLES><SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT></STATICVARIABLES></REQUESTDESC></EXPORTDATA></BODY></ENVELOPE>';


app.get('/test',(req,res)=>{
    axios({
        url:'http://localhost:9000',
        method:'POST',
        headers:{
            ContentType: 'text/xml',
            charset:'UTF-8',
        },
        data:xmlstring
    }).then(response=>{
        //console.log(response.data);

        parseString(response.data, function (err, result) {
            if(result.ENVELOPE.BODY[0].IMPORTDATA[0].REQUESTDATA[0].TALLYMESSAGE && result.ENVELOPE.BODY[0].IMPORTDATA[0].REQUESTDATA[0].TALLYMESSAGE.length>0){


                result.ENVELOPE.BODY[0].IMPORTDATA[0].REQUESTDATA[0].TALLYMESSAGE.pop();
            let exportData = result.ENVELOPE.BODY[0].IMPORTDATA[0].REQUESTDATA[0].TALLYMESSAGE;
            let tempArr = [];
            exportData.map(item=>{
                if(item.VOUCHER[0].ISCANCELLED !='Yes'){
                    let tempObj={};
                    tempObj['tallyid']=item.VOUCHER[0].MASTERID[0].trim();
                    tempObj['vchnumber']=item.VOUCHER[0].VOUCHERNUMBER[0];
                    tempObj['date']=item.VOUCHER[0].DATE[0];
                    tempObj['amount']=item.VOUCHER[0]['ALLINVENTORYENTRIES.LIST'][0].AMOUNT[0];
                    console.log(item.VOUCHER[0].$.VCHTYPE);
                    tempArr.push(tempObj);
                }

            })
            res.render('pages/home',{
                table:tempArr
                })
            }else{
                res.send("no arrays!!!");
            }
        });
    }).catch(err=>console.log(err));
})

app.get('/test/:id', (req, res) => {
    let tallyid = req.params.id.toString()
    //console.log(typeof tallyid);
    axios({
        url:'http://localhost:9000',
        method:'POST',
        headers:{
            ContentType: 'text/xml',
            charset:'UTF-8',
        },
        data:xmlstring
    }).then(response=>{
        parseString(response.data, function (err, result) {
            if(result.ENVELOPE.BODY[0].IMPORTDATA[0].REQUESTDATA[0].TALLYMESSAGE && result.ENVELOPE.BODY[0].IMPORTDATA[0].REQUESTDATA[0].TALLYMESSAGE.length>0){
                result.ENVELOPE.BODY[0].IMPORTDATA[0].REQUESTDATA[0].TALLYMESSAGE.pop();
            let exportData = result.ENVELOPE.BODY[0].IMPORTDATA[0].REQUESTDATA[0].TALLYMESSAGE;
            let tempArr = [];
            exportData.map(item=>{
                tempArr.push(item.VOUCHER[0].MASTERID[0].trim());
            })
            let index = tempArr.indexOf(`${tallyid}`);
            if(index >-1){
                exportData.map(item=>{
                    let masterid = item.VOUCHER[0].MASTERID[0].trim();
                    if(masterid===tallyid){
                        console.log('vouchernumber is',item.VOUCHER[0].VOUCHERNUMBER);
                        let vouchernumber = item.VOUCHER[0].VOUCHERNUMBER;
                        let vchtype = item.VOUCHER[0].$.VCHTYPE
                        //axios goes here
                        let cancelVoucher = `<ENVELOPE><HEADER><TALLYREQUEST>Import Data</TALLYREQUEST></HEADER><BODY><IMPORTDATA><REQUESTDESC><REPORTNAME>All Masters</REPORTNAME></REQUESTDESC><REQUESTDATA><TALLYMESSAGE xmlns:UDF="TallyUDF"><VOUCHER DATE="01-April-2019" TAGNAME = "Voucher Number" TAGVALUE="${vouchernumber}" VCHTYPE = "${vchtype}" ACTION="Cancel"><NARRATION>Cancelled by Madhavan</NARRATION></VOUCHER></TALLYMESSAGE></REQUESTDATA></IMPORTDATA></BODY></ENVELOPE>`;
                        console.log(cancelVoucher);
                        axios({
                            url:'http://localhost:9000',
                            method:'POST',
                            headers:{
                                ContentType: 'text/xml',
                                charset:'UTF-8',
                            },
                            data:cancelVoucher
                        }).then(response=>{

                        }).catch(err=>console.log(err))

                    }

                })
                tempArr.splice(index,1)
                res.send({message:"cancelled successfully"});
            }else{
                res.send("no valid entries found in this id!!");
            }
            }else{
                res.send("no arrays!!!");
            }


        });
    }).catch(err=>console.log(err));
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));