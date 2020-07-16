const express = require('express');
const path = require('path');
const app = express();
const axios = require('axios');
const cors = require('cors');
var parseString = require('xml2js').parseString;

app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//setup public folder

app.use(express.static('./public'));

const port = 5050;
var xmlstring = '<ENVELOPE><HEADER><TALLYREQUEST>Export Data</TALLYREQUEST></HEADER><BODY><EXPORTDATA><REQUESTDESC><REPORTNAME>Day Book</REPORTNAME><STATICVARIABLES><SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT><SVCURRENTCOMPANY>Main</SVCURRENTCOMPANY><SVFROMDATE>20190401</SVFROMDATE><SVTODATE>20190401</SVTODATE></STATICVARIABLES></REQUESTDESC></EXPORTDATA></BODY></ENVELOPE>';

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
                                                // console.log(JSON.stringify(tallyArrayObj,null,2));
                                                res.render('pages/recon',{table:tallyArrayObj,table2:req.body,message:false});
                                            })
                    }).catch(err=>console.log(err));

    }catch(error){console.log('error:::::::',error)}
})

app.get('/getrecondetails/:id',getGsApp,(req,res)=>{
    console.log('entered',req.params.id);
    let searchvoucher = req.params.id;
    if(searchvoucher === 'All'){
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
                                                    // console.log(JSON.stringify(tallyArrayObj,null,2));
                                                    res.render('pages/recon',{table:tallyArrayObj,table2:req.body,message:true,vouchername:null});
                                                })
                        }).catch(err=>console.log(err));

        }catch(error){console.log('error:::::::',error)}
    }else{
        try{
            console.log('searchvoucher is ::',searchvoucher);
            axios({url:'http://localhost:9000',method:'POST',headers:{ContentType: 'text/xml',charset:'UTF-8'},data:xmlstring})
            .then(response=>{
                            parseString(response.data, (err, result)=>{
                                let tempArr=[];
                                let tempObj ={};

                                result.ENVELOPE.BODY[0].IMPORTDATA[0].REQUESTDATA[0].TALLYMESSAGE.pop();
                                 let exportData = result.ENVELOPE.BODY[0].IMPORTDATA[0].REQUESTDATA[0].TALLYMESSAGE;
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
                                                                console.log('keys are',key);
                                                                tallyAppArr.push(item)
                                                            }
                                                        })


                                                    })
                                                    // console.log(JSON.stringify(tallyArrayObj,null,2));
                                                    let GsAppArray = [];
                                                    req.body.map(item=>{
                                                        Object.keys(item).map(key=>{
                                                            if(key==searchvoucher){
                                                                console.log('keys are',key);
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
                                                    res.render('pages/recon',{table:tallyAppArr,table2:GsAppArray,message:true,vouchername:searchvoucher,missingvouchertally:output1,missingvouchergs:output2});
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
        GsAppObj.map(obj=>{
            let keys=Object.keys(obj);

            if(item.vouchertype==keys[0]){
               obj[keys[1]] += Number(item.amount);
               obj[keys[0]].push(item);
            }
           })
       })
       req.body = GsAppObj;
       next();
    }).catch(err=>console.log(err));

}