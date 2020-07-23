const express = require('express');
const path = require('path');
const app = express();
const axios = require('axios');
const cors = require('cors');
const {response}=require('express');
var parseString = require('xml2js').parseString;

app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//setup public folder

app.use(express.static('./public'));

const port = 5050;


app.get('/',getGsApp,(req,res)=>{
     try{
        axios({url:'http://localhost:9000',method:'POST',headers:{ContentType: 'text/xml',charset:'UTF-8'},data:xmlstring})
        .then(response=>{
                        parseString(response.data, (err, result)=>{
                            let tempArr=[];
                            let tempObj ={};

                            result.ENVELOPE.BODY[0].IMPORTDATA[0].REQUESTDATA[0].TALLYMESSAGE.pop();
                             let exportData = result.ENVELOPE.BODY[0].IMPORTDATA[0].REQUESTDATA[0].TALLYMESSAGE;
                                             exportData.map(item=>{
                                                 if(item.VOUCHER[0].ISCANCELLED !='Yes'){
                                                     let tempObj={};
                                                     tempObj['tallyid']=item.VOUCHER[0].MASTERID[0].trim();
                                                     tempObj['vouchernumber']=item.VOUCHER[0].VOUCHERNUMBER[0];
                                                     tempObj['vouchertype']=item.VOUCHER[0].$.VCHTYPE;
                                                     tempObj['date']=item.VOUCHER[0].DATE[0];
                                                    //   tempObj['items']=[];
                                                    //   tempObj['items'].push(item.VOUCHER[0]);
                                                    if(item.VOUCHER[0]['ALLINVENTORYENTRIES.LIST']){
                                                        tempObj['amount']=item.VOUCHER[0]['ALLINVENTORYENTRIES.LIST'][0].AMOUNT[0];
                                                    }else if(item.VOUCHER[0]['ALLLEDGERENTRIES.LIST']){
                                                        tempObj['amount']=item.VOUCHER[0]['ALLLEDGERENTRIES.LIST'][0].AMOUNT[0];
                                                    }else{
                                                        tempObj['amount']=item.VOUCHER[0]['INVENTORYENTRIESIN.LIST'][0].AMOUNT[0];
                                                    }

                                                     tempArr.push(tempObj);
                                                 }

                                             })
                                             let tallyArrayObj=[
                                                 {'Sales':[],amount:0},
                                                 {'Purchase':[],amount:0},
                                                 {'Delivery Note':[],amount:0},
                                                 {'Receipt Note':[],amount:0},
                                                 {'Journal':[],amount:0},
                                                 {'Receipt':[],amount:0},
                                                 {'Payment':[],amount:0},
                                                 {'Credit Note':[],amount:0},
                                                 {'Debit Note':[],amount:0},
                                                 {'Stock Journal':[],amount:0}
                                                ];
                                             tempArr.map(item=>{
                                                 tallyArrayObj.map(obj=>{
                                                     let keys=Object.keys(obj);

                                                     if(item.vouchertype==keys[0]){
                                                        obj[keys[1]] += Number(item.amount);
                                                        obj[keys[0]].push(item);
                                                     }
                                                    })
                                                })

                                                res.render('pages/recon',{table:tallyArrayObj,table2:req.body,message:false});
                                            })
                    }).catch(err=>console.log(err));

    }catch(error){console.log('error:::::::',error)}
})

app.get('/getrecondetails/:id/:fromdate/:todate',getGsApp,(req,res)=>{

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
<SVFROMDATE TYPE="Date">${req.params.fromdate}</SVFROMDATE>
<SVTODATE TYPE="Date">${req.params.todate}</SVTODATE>
</STATICVARIABLES>
</DESC>
</BODY>
</ENVELOPE>`;
console.log(xmlstring);
    let searchvoucher = req.params.id;
    if(searchvoucher === 'All'){
        try{
            axios({url:'http://localhost:9000',method:'POST',headers:{ContentType: 'text/xml',charset:'UTF-8'},data:xmlstring})
            .then(response=>{
                            parseString(response.data, (err, result)=>{
                                let tempArr=[];
                                let tempObj ={};

                                result.ENVELOPE.BODY[0].DATA[0].TALLYMESSAGE.pop();
                                 let exportData = result.ENVELOPE.BODY[0].DATA[0].TALLYMESSAGE;
                                                 exportData.map(item=>{
                                                     if(item.VOUCHER[0].ISCANCELLED !='Yes'){
                                                         let tempObj={};
                                                         tempObj['tallyid']=item.VOUCHER[0].MASTERID[0].trim();
                                                         tempObj['vouchernumber']=item.VOUCHER[0].VOUCHERNUMBER[0];
                                                         tempObj['vouchertype']=item.VOUCHER[0].$.VCHTYPE;
                                                         tempObj['date']=item.VOUCHER[0].DATE[0];
                                                        //   tempObj['items']=[];
                                                        //   tempObj['items'].push(item.VOUCHER[0]);
                                                        if(item.VOUCHER[0]['ALLINVENTORYENTRIES.LIST']){
                                                            tempObj['amount']=item.VOUCHER[0]['ALLINVENTORYENTRIES.LIST'][0].AMOUNT[0];
                                                        }else if(item.VOUCHER[0]['ALLLEDGERENTRIES.LIST']){
                                                            tempObj['amount']=item.VOUCHER[0]['ALLLEDGERENTRIES.LIST'][0].AMOUNT[0];
                                                        }else{
                                                            tempObj['amount']=item.VOUCHER[0]['INVENTORYENTRIESIN.LIST'][0].AMOUNT[0];
                                                        }

                                                         tempArr.push(tempObj);
                                                     }

                                                 })
                                                 let tallyArrayObj=[
                                                     {'Sales':[],amount:0},
                                                     {'Purchase':[],amount:0},
                                                     {'Delivery Note':[],amount:0},
                                                     {'Receipt Note':[],amount:0},
                                                     {'Journal':[],amount:0},
                                                     {'Receipt':[],amount:0},
                                                     {'Payment':[],amount:0},
                                                     {'Credit Note':[],amount:0},
                                                     {'Debit Note':[],amount:0},
                                                     {'Stock Journal':[],amount:0}
                                                    ];
                                                 tempArr.map(item=>{
                                                     tallyArrayObj.map(obj=>{
                                                         let keys=Object.keys(obj);

                                                         if(item.vouchertype==keys[0]){
                                                            obj[keys[1]] += Number(item.amount);
                                                            obj[keys[0]].push(item);
                                                         }
                                                        })
                                                    })

                                                    let responseArray=[];


                                                    responseArray.push(tallyArrayObj);
                                                    responseArray.push(req.body);
                                                   res.send(responseArray);
                                                    //res.render('pages/recon',{table:tallyArrayObj,table2:req.body,message:true,vouchername:null});
                                                })
                        }).catch(err=>console.log(err));

        }catch(error){console.log('error:::::::',error)}
    }else{
        try{

            axios({url:'http://localhost:9000',method:'POST',headers:{ContentType: 'text/xml',charset:'UTF-8'},data:xmlstring})
            .then(response=>{
                            parseString(response.data, (err, result)=>{
                                let tempArr=[];
                                let tempObj ={};

                                result.ENVELOPE.BODY[0].DATA[0].TALLYMESSAGE.pop();
                                 let exportData = result.ENVELOPE.BODY[0].DATA[0].TALLYMESSAGE;
                                                 exportData.map(item=>{
                                                     if(item.VOUCHER[0].ISCANCELLED !='Yes' && item.VOUCHER[0].$.VCHTYPE==searchvoucher){
                                                         let tempObj={};
                                                         tempObj['tallyid']=item.VOUCHER[0].MASTERID[0].trim();
                                                         tempObj['vouchernumber']=item.VOUCHER[0].VOUCHERNUMBER[0];
                                                         tempObj['vouchertype']=item.VOUCHER[0].$.VCHTYPE;
                                                         tempObj['date']=item.VOUCHER[0].DATE[0];
                                                        //   tempObj['items']=[];
                                                        //   tempObj['items'].push(item.VOUCHER[0]);
                                                        if(item.VOUCHER[0]['ALLINVENTORYENTRIES.LIST']){
                                                            tempObj['amount']=item.VOUCHER[0]['ALLINVENTORYENTRIES.LIST'][0].AMOUNT[0];
                                                        }else if(item.VOUCHER[0]['ALLLEDGERENTRIES.LIST']){
                                                            tempObj['amount']=item.VOUCHER[0]['ALLLEDGERENTRIES.LIST'][0].AMOUNT[0];
                                                        }else{
                                                            tempObj['amount']=item.VOUCHER[0]['INVENTORYENTRIESIN.LIST'][0].AMOUNT[0];
                                                        }

                                                         tempArr.push(tempObj);
                                                     }

                                                 })
                                                 let tallyArrayObj=[
                                                     {'Sales':[],amount:0},
                                                     {'Purchase':[],amount:0},
                                                     {'Delivery Note':[],amount:0},
                                                     {'Receipt Note':[],amount:0},
                                                     {'Journal':[],amount:0},
                                                     {'Receipt':[],amount:0},
                                                     {'Payment':[],amount:0},
                                                     {'Credit Note':[],amount:0},
                                                     {'Debit Note':[],amount:0},
                                                     {'Stock Journal':[],amount:0}
                                                    ];
                                                    let tallyAppArr=[];
                                                 tempArr.map(item=>{
                                                     tallyArrayObj.map(obj=>{
                                                         let keys=Object.keys(obj);

                                                         if(item.vouchertype==keys[0]&&keys[0]==searchvoucher){
                                                            obj[keys[1]] += Number(item.amount);
                                                            obj[keys[0]].push(item);
                                                         }
                                                        })
                                                    })
                                                    tallyArrayObj.map(item=>{
                                                        Object.keys(item).map(key=>{
                                                            if(key==searchvoucher){
                                                                tallyAppArr.push(item)
                                                            }
                                                        })


                                                    })

                                                    let GsAppArray = [];
                                                    req.body.map(item=>{
                                                        Object.keys(item).map(key=>{
                                                            if(key==searchvoucher){

                                                                GsAppArray.push(item)
                                                            }
                                                        })
                                                    })
                                                    //res.send(tallyAppArr);
                                                    const compareName = (obj1, obj2)=>{
                                                        return (obj1.tallyid === obj2.tallyid);
                                                      }
                                                      let output1=[];
                                                      let output2=[];

                                                        output1 = tallyAppArr[0][searchvoucher].filter(b=>{
                                                            let indexFound = GsAppArray[0][searchvoucher].findIndex(a => compareName(a, b));
                                                            return indexFound == -1;
                                                          })

                                                         output2 = GsAppArray[0][searchvoucher].filter(b=>{
                                                            let indexFound = tallyAppArr[0][searchvoucher].findIndex(a => compareName(a, b));
                                                            return indexFound == -1;
                                                          })

                                                    //res.send(missingVoucher);
                                                    let responseArray=[];
                                                    let vouchername ={};
                                                    let missingobj={}
                                                    missingobj['missingvoucherone'] =[]
                                                    missingobj['missingvouchertwo'] =[]

                                                    responseArray.push(tallyAppArr[0]);
                                                    responseArray.push(GsAppArray[0]);

                                                    missingobj['missingvoucherone'].push(output1);
                                                    missingobj['missingvouchertwo'].push(output2);
                                                    responseArray.push(output1);
                                                    responseArray.push(output2);
                                                    res.send(responseArray)
                                                    //res.render('pages/recon',{table:tallyAppArr,table2:GsAppArray,message:true,vouchername:searchvoucher,missingvouchertally:output1,missingvouchergs:output2});
                                                })
                        }).catch(err=>console.log(err));

        }catch(error){console.log('error:::::::',error)}

    }
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

function getGsApp(req,res,next){
    let GsAppObj=[
        {'Sales':[],amount:0},
        {'Purchase':[],amount:0},
        {'Delivery Note':[],amount:0},
        {'Receipt Note':[],amount:0},
        {'Journal':[],amount:0},
        {'Receipt':[],amount:0},
        {'Payment':[],amount:0},
        {'Credit Note':[],amount:0},
        {'Debit Note':[],amount:0},
        {'Stock Journal':[],amount:0}
       ];
       let tempObj1 = {};
       let tempArr2 = [];
    axios.get('http://localhost:6050/posttransaction').then(response=>{
      tempArr2=response.data;
      tempArr2.map(item=>{
          console.log('item is',item);
          if(item.cancelflag!==true){
            GsAppObj.map(obj=>{
                let keys=Object.keys(obj);

                if(item.vouchertype==keys[0]){
                   obj[keys[1]] += Number(item.amount);
                   obj[keys[0]].push(item);
                }
               })
          }

       })
       req.body = GsAppObj;
       next();
    }).catch(err=>console.log(err));

}

app.get("/gettallydetails",getGsApp,(req,res,next)=>{
    let responseContent = [];
    axios({url:'http://localhost:9000',method:'POST',headers:{ContentType: 'text/xml',charset:'UTF-8'},data:xmlstring})
    .then(response=>{
                    parseString(response.data, (err, result)=>{
                        if(!err){
                            responseContent.push(result);
                            responseContent.push(req.body);
                            console.log('in gs app rendering',req.body);
                             res.status(200).send(responseContent);


                        }
                    })
                }).catch(err=>console.log(err));


});

app.get("/canceltally/:id/:vouchertype/:date",getTallyData, async(req,res)=>{

    req.body.ENVELOPE.BODY[0].DATA[0].TALLYMESSAGE.pop();
    let exportData =  req.body.ENVELOPE.BODY[0].DATA[0].TALLYMESSAGE;
    // console.log(exportData);
    let tallyid = req.params.id.toString();
    // console.log('tallyid from request is ',tallyid);

    let vouchertype = req.params.vouchertype;
    // console.log('vouchertype from request is ',vouchertype);
    let date = req.params.date;
    let responseContent = [];


let responsedata = [];

                    exportData.map(item=>{
                        //console.log('masterid from tally is',item.VOUCHER[0].MASTERID);
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
                                    <VOUCHER DATE = "01-April-2019" TAGNAME = "MASTER ID" TAGVALUE=" ${tallyid}" ACTION = "Cancel"  VCHTYPE = "${vouchertype}">
                                        <NARRATION>Cancelled by Madhavan</NARRATION>
                                    </VOUCHER>
                                    </TALLYMESSAGE>
                                </DATA>
                            </BODY>
                        </ENVELOPE>	`
                        // console.log('entered if:::::::::::::::',item.VOUCHER[0].ISCANCELLED);
                            axios({url:'http://localhost:9000',method:'POST',headers:{ContentType: 'text/xml',charset:'UTF-8'},data:cancelVoucher})
                            .then(response=>{
                                parseString(response.data, async (err, result)=>{
                                                if(!err){
                                                    // console.log('response is',result.ENVELOPE.BODY[0].DATA[0].IMPORTRESULT[0]);
                                                    responsedata.push(result.ENVELOPE.BODY[0].DATA[0].IMPORTRESULT[0]);
                                                    await updateGsApp(tallyid,vouchertype);
                                                    res.status(200).send(responsedata);
                                                }
                                            })
                                        }).catch(err=>{console.log(err)
                                                response.send(404).send("error in cancelling")
                                        });

                        }else{
                            console.log("not found")
                        }

                    })
                })

function updateGsApp(tallyid,vouchertype){
    // console.log('called tallyid',tallyid)

    axios({url:`http://localhost:6050/edittransaction/${tallyid}/${vouchertype}`,method:'PUT'})
    .then(response=>{
        // console.log(response.data);
    }).catch(err=>{
        console.log(err);
    })

}

function getTallyData(req,res,next){


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