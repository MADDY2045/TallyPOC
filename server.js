const express = require('express');
const path = require('path');
const app = express();
const axios = require('axios');
const cors = require('cors');
const {response}=require('express');
var parseString = require('xml2js').parseString;
const mongoose = require('mongoose');
const TallyMaster = require('./models/TallyTransaction');
var dateFormat = require('dateformat');

app.use(cors());
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//setup public folder

app.use(express.static('./public'));

const port = 5050;

/* start of new */
app.post('/posttransaction',(req,res)=>{
    try{
        const { vouchertype,tallyid,amount,vouchernumber,date } = req.body;


        TallyMaster.find({tallyid:tallyid}).exec().then(output=>{
            if(output.length>0){
                console.log('Tally id already exists!!!');
            }else{
                const newTransaction = new TallyMaster({vouchertype,tallyid,amount,vouchernumber,date});
                const newTransactionDetails = newTransaction.save()
                .then(()=>{
                   console.log("saved successfully!!!");
                }).catch(err=>{
                    res.status(404).send(err);
                })
            }
        }).catch(err=>console.log(err))


    }catch(error){res.send(error)}

})

app.get('/posttransaction',(req,res)=>{
    TallyMaster.find().exec().then(result=>{
        res.status(200).send(result);
    }

    ).catch(err=>console.log(err));
})


mongoose.connect('mongodb://localhost/tallyapp2',{useUnifiedTopology:true,useNewUrlParser:true},(err)=>{
    if(!err){
        console.log('DB connected successfully!!!!')
    }else{
        console.log(err);
    }
});
/* endd of new */

app.get('/getrecondetails/:id/:fromdate/:todate',getGsApp,(req,res)=>{

    const fortmattedfromdate= dateFormat(req.params.fromdate, "yyyymmdd");
    const fortmattedtodate= dateFormat(req.params.todate, "yyyymmdd");

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
<SVFROMDATE TYPE="Date">${fortmattedfromdate}</SVFROMDATE>
<SVTODATE TYPE="Date">${fortmattedtodate}</SVTODATE>
</STATICVARIABLES>
</DESC>
</BODY>
</ENVELOPE>`;

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
    axios.get('http://localhost:5050/posttransaction').then(response=>{
      tempArr2=response.data;
      tempArr2.map(item=>{

          comparedate = new Date(item.date).getTime();
          let fromdate = new Date(req.params.fromdate).getTime();
          let todate = new Date(req.params.todate).getTime();
          if(item.cancelflag===false && comparedate>=fromdate && comparedate<=todate ){
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



/*needed*/
app.get("/canceltally/:id/:vouchertype/:date",getTallyData, async(req,res)=>{

    req.body.ENVELOPE.BODY[0].DATA[0].TALLYMESSAGE.pop();
    let exportData =  req.body.ENVELOPE.BODY[0].DATA[0].TALLYMESSAGE;

    let tallyid = req.params.id.toString();


    let vouchertype = req.params.vouchertype;

    let date = req.params.date;
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
                                    <VOUCHER DATE = "01-April-2019" TAGNAME = "MASTER ID" TAGVALUE=" ${tallyid}" ACTION = "Cancel"  VCHTYPE = "${vouchertype}">
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
                                                response.send(404).send("error in cancelling")
                                        });

                        }else{
                            // console.log("not found")
                        }

                    })
                })

/* end of needed*/

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

app.put('/cancelgsdata/:id/:vouchertype',(req,res)=>{
    console.log("entered route ",req.params.id,req.params.vouchertype);
    TallyMaster.find({tallyid:req.params.id,vouchertype:req.params.vouchertype}).then(result=>{
        console.log('result is ',result);
        result[0].cancelflag=true;
         result[0].save().then(response=>{
            console.log(response)
        }).catch(err=>{
            console.log(err);
        })
    }).catch(err=>console.log(err))
})


function updateDb(tallyid,vouchertype){
    console.log(tallyid,vouchertype);
    axios.put(`http://localhost:5050/cancelgsdata/${tallyid}/${vouchertype}`).then(response=>{
        console.log(response.data);
    }).catch(err=>{console.log(err)})
}

